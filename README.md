# DeepSeek Boss Helper

一个基于DeepSeek AI的Chrome扩展，帮助你在Boss直聘上更高效地投递简历。它能自动分析职位要求与你的简历的匹配程度，并生成专业的求职问候语。

## 功能特点

- 🔍 自动获取Boss直聘职位描述
- 📄 简历与职位匹配度分析
- 💡 个性化改进建议
- 💬 智能生成专业求职问候语
- 🔒 本地简历存储，保护隐私

## 安装步骤

1. 克隆项目到本地：
```bash
git clone https://github.com/your-username/deepseek-boss-helper.git
cd deepseek-boss-helper
```

2. 安装依赖：
```bash
npm install
```

3. 构建项目：
```bash
npm run build
```

4. 在Chrome浏览器中加载扩展：
   - 打开Chrome浏览器，进入扩展管理页面（chrome://extensions/）
   - 开启右上角的「开发者模式」
   - 点击「加载已解压的扩展程序」
   - 选择项目的dist目录

## 使用说明

1. 获取DeepSeek API Key：
   - 访问 [DeepSeek平台](https://platform.deepseek.com)
   - 注册/登录账号
   - 在个人设置中获取API Key

2. 配置扩展：
   - 点击Chrome工具栏中的扩展图标
   - 点击「设置」进入选项页面
   - 输入你的DeepSeek API Key并保存
   - 选择合适的模型（可选）

3. 使用扩展：
   - 在Boss直聘上浏览职位时，点击扩展图标
   - 上传你的简历（支持PDF格式）
   - 职位描述会自动获取，你也可以手动修改
   - 点击「生成建议」获取分析结果

## 支持的模型

本扩展支持以下DeepSeek模型：

### 基础模型
- DeepSeek-R1 基础模型
- DeepSeek-R1 Pro基础模型

### Llama系列
- DeepSeek-R1-Distill-Llama-70B
- DeepSeek-R1-Distill-Llama-8B
- Pro DeepSeek-R1-Distill-Llama-8B

### Qwen系列
- DeepSeek-R1-Distill-Qwen-32B
- DeepSeek-R1-Distill-Qwen-14B
- DeepSeek-R1-Distill-Qwen-7B
- DeepSeek-R1-Distill-Qwen-1.5B
- Pro DeepSeek-R1-Distill-Qwen-7B
- Pro DeepSeek-R1-Distill-Qwen-1.5B

默认使用DeepSeek-R1-Distill-Qwen-1.5B模型，您可以根据需要选择其他模型。较大的模型通常能提供更好的分析质量，但响应时间可能会更长。

## 注意事项

- 首次使用需要配置DeepSeek API Key
- 简历将保存在浏览器本地存储中，保证隐私安全
- 建议使用PDF格式的简历以获得最佳效果

## 技术栈

- Vue 3
- Element Plus
- OpenAI API（DeepSeek模型）
- Chrome Extension API
- Vite

## 许可证

[MIT License](LICENSE)