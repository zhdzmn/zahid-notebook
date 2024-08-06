import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// image input
// const prompt = "Does this look store-bought or homemade?";
// const image = {
//   inlineData: {
//     data: Buffer.from(fs.readFileSync("cookie.png")).toString("base64"),
//     mimeType: "image/png",
//   },
// };
// const result = await model.generateContent([prompt, image]);
// console.log(result.response.text());
export default async function run() {
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
  });
  let result = await chat.sendMessage("I have 2 dogs in my house.");
  console.log(result.response.text());
  result = await chat.sendMessage("How many paws are in my house?");
  console.log(result.response.text());  
};
