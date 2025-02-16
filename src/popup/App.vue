<template>
  <div class="popup-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>DeepSeek Boss Helper</span>
        </div>
      </template>
      
      <el-form :model="form" label-width="80px">
        <el-form-item label="API Key">
          <el-input
            v-model="form.apiKey"
            placeholder="请输入DeepSeek API Key"
            show-password
            @change="handleApiKeyChange"
          />
        </el-form-item>

        <el-form-item label="模型">
          <el-select v-model="form.model" placeholder="请选择模型">
            <el-option
              v-for="(desc, key) in DeepSeekService.MODELS"
              :key="key"
              :label="desc"
              :value="key"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="简历">
          <div class="resume-upload">
            <el-upload
              class="upload-demo"
              action="#"
              :auto-upload="false"
              :on-change="handleResumeChange">
              <template #trigger>
                <el-button type="primary">选择文件</el-button>
              </template>
              <template #tip>
                <div class="el-upload__tip">请上传PDF或Word格式的简历文件</div>
              </template>
            </el-upload>
            <div v-if="form.resumeFileName" class="resume-info">
              <span class="resume-name">当前简历：{{ form.resumeFileName }}</span>
              <el-button type="danger" size="small" @click="clearResume">清除</el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="职位要求">
          <el-input
            v-model="form.jobRequirements"
            type="textarea"
            :rows="4"
            placeholder="请粘贴职位要求描述"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="generateSuggestion" :loading="loading">
            生成建议
          </el-button>
        </el-form-item>
      </el-form>

      <div v-if="suggestion" class="suggestion-container">
        <h3>智能建议</h3>
        <p>{{ suggestion }}</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import DeepSeekService from '../services/deepseek'

const form = ref({
  apiKey: '',
  model: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B',
  resume: null,
  resumeFileName: '',
  jobRequirements: ''
})

const loading = ref(false)
const suggestion = ref('')
const deepseekService = ref(null)

const handleApiKeyChange = async (value) => {
  try {
    await chrome.storage.sync.set({ apiKey: value })
    deepseekService.value = new DeepSeekService(value, form.value.model)
    ElMessage.success('API Key已保存')
  } catch (error) {
    console.error('保存API Key失败：', error)
    ElMessage.error('保存API Key失败')
  }
}

onMounted(async () => {
  const result = await chrome.storage.sync.get(['apiKey', 'savedResumeFileName', 'lastSuggestion', 'selectedModel'])
  if (result.apiKey) {
    form.value.apiKey = result.apiKey
    deepseekService.value = new DeepSeekService(result.apiKey, result.selectedModel || form.value.model)
  }
  if (result.selectedModel) {
    form.value.model = result.selectedModel
  }
  if (result.lastSuggestion) {
    suggestion.value = result.lastSuggestion
  }

  // 自动获取职位描述
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab && tab.url && tab.url.includes('zhipin.com')) {
      const jobDescription = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: DeepSeekService.getJobDescription
      })
      if (jobDescription && jobDescription[0] && jobDescription[0].result) {
        form.value.jobRequirements = jobDescription[0].result
      }
    }
  } catch (error) {
    console.error('获取职位描述失败：', error)
  }
  if (result.savedResumeFileName) {
    const savedResume = localStorage.getItem('savedResume')
    if (savedResume) {
      form.value.resume = new File([savedResume], result.savedResumeFileName)
      form.value.resumeFileName = result.savedResumeFileName
    }
  }
})

const handleResumeChange = async (file) => {
  form.value.resume = file.raw
  form.value.resumeFileName = file.raw.name
  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      localStorage.setItem('savedResume', e.target.result)
      localStorage.setItem('savedResumeFileName', file.raw.name)
      await chrome.storage.sync.set({
        savedResumeFileName: file.raw.name
      })
    } catch (error) {
      console.error('保存简历失败：', error)
    }
  }
  reader.readAsArrayBuffer(file.raw)
}

const clearResume = async () => {
  form.value.resume = null
  form.value.resumeFileName = ''
  try {
    localStorage.removeItem('savedResume')
    localStorage.removeItem('savedResumeFileName')
    await chrome.storage.sync.remove(['savedResumeFileName'])
  } catch (error) {
    console.error('清除简历失败：', error)
  }
}

const handleModelChange = async (value) => {
  try {
    await chrome.storage.sync.set({ selectedModel: value })
    if (deepseekService.value) {
      deepseekService.value = new DeepSeekService(form.value.apiKey, value)
    }
  } catch (error) {
    console.error('保存模型选择失败：', error)
    ElMessage.error('保存模型选择失败')
  }
}

const generateSuggestion = async () => {
  if (!form.value.apiKey) {
    ElMessage.warning('请先输入DeepSeek API Key')
    return
  }
  if (!form.value.resume || !form.value.jobRequirements) {
    ElMessage.warning('请上传简历并填写职位要求')
    return
  }

  if (!deepseekService.value || deepseekService.value.apiKey !== form.value.apiKey || deepseekService.value.model !== form.value.model) {
    deepseekService.value = new DeepSeekService(form.value.apiKey, form.value.model)
  }

  loading.value = true
  try {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const resumeContent = e.target.result
        suggestion.value = await deepseekService.value.generateSuggestion(
          resumeContent,
          form.value.jobRequirements
        )
        await chrome.storage.sync.set({
          lastSuggestion: suggestion.value
        })
      } catch (error) {
        console.error('API调用失败：', error)
        ElMessage.error('API调用失败：' + (error.message || '未知错误，请检查网络连接和API Key是否正确'))
      } finally {
        loading.value = false
      }
    }
    reader.onerror = () => {
      ElMessage.error('文件读取失败')
      loading.value = false
    }
    reader.readAsText(form.value.resume)
  } catch (error) {
    console.error('生成建议失败：', error)
    ElMessage.error('生成建议失败：' + (error.message || '未知错误'))
    loading.value = false
  }
}
</script>

<style scoped>
.popup-container {
  width: 600px;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.resume-upload {
  width: 100%;
}

.resume-info {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.resume-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.suggestion-container {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.suggestion-container h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #303133;
}

.suggestion-container p {
  margin: 0;
  white-space: pre-wrap;
  color: #606266;
}
</style>