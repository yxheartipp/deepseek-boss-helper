<template>
  <div class="options-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>DeepSeek Boss Helper 设置</span>
        </div>
      </template>
      
      <el-form :model="form" label-width="120px">
        <el-form-item label="DeepSeek API Key">
          <el-input v-model="form.apiKey" placeholder="请输入您的DeepSeek API Key"/>
        </el-form-item>

        <el-form-item label="选择模型">
          <el-select v-model="form.model" placeholder="请选择模型">
            <el-option
              v-for="(label, value) in modelOptions"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveSettings">保存设置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import DeepSeekService from '../services/deepseek'

const form = ref({
  apiKey: '',
  model: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B'
})

const modelOptions = DeepSeekService.MODELS

onMounted(async () => {
  // 从storage中加载已保存的设置
  const result = await chrome.storage.sync.get(['apiKey', 'model'])
  form.value.apiKey = result.apiKey || ''
  form.value.model = result.model || 'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B'
})

const saveSettings = async () => {
  try {
    if (!form.value.apiKey) {
      ElMessage.warning('请输入DeepSeek API Key')
      return
    }

    await chrome.storage.sync.set({
      apiKey: form.value.apiKey,
      model: form.value.model
    })
    ElMessage.success('设置已保存')
  } catch (error) {
    console.error('保存设置失败：', error)
    ElMessage.error('保存设置失败：' + (error.message || '未知错误，请检查网络连接和API Key是否正确'))
  }
}
</script>

<style scoped>
.options-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 0 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>