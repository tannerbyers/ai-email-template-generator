# 🚀 AI Email Template Generator

Welcome to the **AI Email Template Generator**! 🎉 This tool uses OpenAI to help you generate and modify HTML & Handlebars email templates with ease. Whether you're building marketing emails or transactional notifications, this tool provides live previews and allows you to dynamically modify templates. 🤖

## ✨ Features

- 🔄 **Live Preview**: See your template updates in real-time.
- 📝 **Code Editor**: Modify the email template using a built-in code editor powered by [CodeMirror](https://codemirror.net/).
- 💡 **Handlebars Support**: Dynamically insert Handlebars placeholders (e.g., `{{productTitle}}`) into your template.
- 🖼️ **Dummy Data**: Automatically pull placeholder data and images from [DummyJSON](https://dummyjson.com/).
- 🧩 **AI Assistance**: AI-powered responses help you quickly update and format your templates.
- 🎨 **Export**: Save your generated email template as an HTML file.

## 🛠️ Configuration

Before you can start using the AI Email Template Generator, you'll need to configure a few things:

### 1. Clone the Repository

First, clone this repository to your local machine:

```bash
git clone https://github.com/your-username/ai-email-template-generator.git
cd ai-email-template-generator
```

### 2. Set up Environment Variables

Create a `.env` file in the root directory and add your OpenAI API key:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

Make sure you replace `your_openai_api_key_here` with your actual OpenAI API key. You can get your API key by signing up at [OpenAI](https://openai.com/).

### 3. Install Dependencies

Install all the required dependencies for both the frontend and backend:

```bash
npm install
```

### 4. Deploy Locally

You can now deploy the app locally:

```bash
npm start
```

By default, the app will be available at: [`http://localhost:3000`](http://localhost:3000)

## 🚀 Deployment

To deploy the app for production, follow these steps:

### 1. Build for Production

```bash
npm run build
```

This will bundle your frontend code and prepare it for deployment.

### 2. Host on a Server

You can now deploy the generated build files to a server of your choice (e.g., AWS, Heroku, DigitalOcean, or your own VPS). Make sure your `.env` file is correctly set up in the production environment.

### 3. Deploy to AWS (Optional)

To deploy to AWS, follow these steps:

1. Set up an S3 bucket for static file hosting (for the frontend).
2. Use [AWS Lambda](https://aws.amazon.com/lambda/) or [Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/) for the backend.
3. Create a CloudFront distribution for CDN and SSL support.

Once deployed, your app will be fully functional on the cloud! ☁️

## 🛠️ Usage

Once the app is running:

1. You can chat with the AI and modify your email templates.
2. The live preview will show the rendered HTML email in real-time.
3. You can add Handlebars keys directly into the template (e.g., `{{productTitle}}`, `{{productPrice}}`).
4. Export the email template as an HTML file for immediate use.

## 🧑‍💻 Contributing

We welcome contributions! To contribute:

1. Fork this repository.
2. Create a new branch: `git checkout -b my-feature-branch`
3. Make your changes.
4. Push to your branch: `git push origin my-feature-branch`
5. Submit a pull request.

## 🤝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## 💬 Feedback

If you have any feedback, suggestions, or issues, feel free to open an issue or contact us!
