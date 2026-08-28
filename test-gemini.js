import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AQ.Ab8RN6KN5bCHaF9XvlQatknFBSTFpztDgmi2rAG7AnGh1zddqg');

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Say Hello');
    console.log('SUCCESS:', result.response.text());
  } catch (error) {
    console.error('ERROR:', error.message);
  }
}

test();
