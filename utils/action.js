'use server';
import Groq from 'groq-sdk';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateChatResponse = async (chatMessages) => {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: 'user', content: 'you are a helpful assistant' },
        ...chatMessages,
      ],
      model: 'llama3-8b-8192',
    });

    console.log(response);
    return response.choices[0].message;
  } catch (error) {
    return null;
  }
};
