import { GoogleGenerativeAI } from "@google/generative-ai";
import { configDotenv } from "dotenv";
configDotenv();

export default async function run() {
  async function setLightValues(brightness, colorTemperature) {
    return {
      brightness,
      colorTemperature,
    };
  }

  const controlLightFunctionDeclaration = {
    name: "controlLight",
    parameters: {
      type: "OBJECT",
      description: "Set the brightness and color temperature of a room light.",
      properties: {
        brightness: {
          type: "NUMBER",
          description:
            "Light level from 0 to 100. Zero is off and 100 is full brightness.",
        },
        colorTemperature: {
          type: "STRING",
          description:
            "Color temperature of the light fixture which can be `daylight`, `cool` or `warm`.",
        },
      },
      required: ["brightness", "colorTemperature"],
    },
  };

  const functions = {
    controlLight: ({ brightness, colorTemperature }) => {
      return setLightValues(brightness, colorTemperature);
    },
  };

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    tools: { functionDeclarations: [controlLightFunctionDeclaration] },
  });
  const chat = model.startChat();
  const prompt = "Dim the lights so the room feels cozy and warm.";

  // Send the message to the model.
  const result = await chat.sendMessage(prompt);

  // For simplicity, this uses the first function call found.
  const call = result.response.functionCalls()[0];

  if (call) {
    // Call the executable function named in the function call
    // with the arguments specified in the function call and
    // let it call the hypothetical API.
    const apiResponse = await functions[call.name](call.args);

    // Send the API response back to the model so it can generate
    // a text response that can be displayed to the user.
    const result2 = await chat.sendMessage([
      {
        functionResponse: {
          name: "controlLight",
          response: apiResponse,
        },
      },
    ]);

    // Log the text response.
    console.log(result2.response.text());
  }
  // [END function_calling]
}

if (import.meta.url.endsWith(process.argv[1])) {
  run();
}
