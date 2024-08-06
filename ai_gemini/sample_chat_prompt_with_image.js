import { readFileSync } from 'fs';
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from 'path';

export default async function chatStreamingWithImages() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const chat = model.startChat();

  let result = await chat.sendMessageStream("Hello, I'm designing inventions. Can I show you one?");
  process.stdout.write('\n\nmodel:\n');
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    process.stdout.write(chunkText);
  }
  result = await chat.sendMessageStream(["What do you think about this design?", {
    inlineData: {
      data: Buffer.from(readFileSync(path.resolve('jetpack.jpeg'))).toString("base64"),
      mimeType: "image/jpeg",
    },
  }]);
  process.stdout.write('\n\nmodel:\n');
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    process.stdout.write(chunkText);
  }
};
