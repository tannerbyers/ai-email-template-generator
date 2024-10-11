const express = require("express");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const port = 3000;

// Initialize OpenAI API with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());
app.use(express.static("public")); // Serve static files

app.post("/ai-request", async (req, res) => {
  const { userInput, template, handlebarsKeys } = req.body;

  try {
    // Prepare the AI request to include handlebars keys
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an assistant that modifies email HTML & Handlebars templates. Ensure all provided Handlebars keys are used in the template. The current email template is:\n${template}`,
        },
        { role: "user", content: `Handlebar keys: ${handlebarsKeys.join(', ')}` },
        { role: "user", content: userInput }
      ],
    });

    let aiResponse = response.choices[0].message.content.replace(/.*```html\n?|```/g, "").trim();
    res.json({ success: true, updatedTemplate: aiResponse });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong with the AI request. Please ensure valid Handlebars syntax." });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

