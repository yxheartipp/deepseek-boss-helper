import OpenAI from 'openai'

class DeepSeekService {
  static MODELS = {
    'deepseek-ai/DeepSeek-R1': '基础模型',
    'Pro/deepseek-ai/DeepSeek-R1': 'Pro基础模型',
    'deepseek-ai/DeepSeek-R1-Distill-Llama-70B': 'Llama 70B',
    'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B': 'Qwen 32B',
    'deepseek-ai/DeepSeek-R1-Distill-Qwen-14B': 'Qwen 14B',
    'deepseek-ai/DeepSeek-R1-Distill-Llama-8B': 'Llama 8B',
    'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B': 'Qwen 7B',
    'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B': 'Qwen 1.5B',
    'Pro/deepseek-ai/DeepSeek-R1-Distill-Llama-8B': 'Pro Llama 8B',
    'Pro/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B': 'Pro Qwen 7B',
    'Pro/deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B': 'Pro Qwen 1.5B'
  }

  static getJobDescription() {
    // 获取职位描述
    const jobDescriptionElement = document.querySelector('.job-detail .job-sec-text')
    if (jobDescriptionElement) {
      return jobDescriptionElement.textContent.trim()
    }
    return ''
  }

  constructor(apiKey, model = 'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B') {
    this.apiKey = apiKey
    this.model = model
    this.client = new OpenAI({
      baseURL: "https://api.siliconflow.cn/v1/",
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    })
  }

  async generateSuggestion(resumeContent, jobRequirements) {
    try {
      const messages = [
        {
          role: 'user',
          content: `我有一份简历和一个职位要求，请帮我：
1. 分析简历与职位的匹配程度
2. 给出改进建议
3. 基于简历内容和职位要求，生成一段专业的求职问候语。问候语需要：
   - 突出简历中与职位最匹配的技能和经验
   - 表达对公司和职位的了解与认同
   - 展现个人对这个职位的热情
   - 语气要专业、诚恳但不过分谦卑

请按以下格式输出：

【匹配分析】
...

【改进建议】
...

【问候语】
...

简历内容：
${resumeContent}

职位要求：
${jobRequirements}`
        }
      ]

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: messages,
        stream: false,
        max_tokens: 2048,
        temperature: 0.7
      })

      return response.choices[0].message.content
    } catch (error) {
      console.error('DeepSeek API调用失败：', error)
      throw error
    }
  }
}

export default DeepSeekService