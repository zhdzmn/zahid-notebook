import { ChatSession, Content, FunctionCall, FunctionResponse, FunctionResponsePart, GenerationConfig, GenerativeModel, HarmBlockThreshold, HarmCategory, Part, SchemaType, Tool, VertexAI } from "@google-cloud/vertexai";
import allTools from "./tools";

export abstract class LLMInterface {
  static MODEL_MAP =  {
    GEMINI_PRO: 'gemini-1.5-pro-002',
    GEMINI_FLASH: 'gemini-1.5-flash-002',
    GEMINI_FLASH_NEXT: 'gemini-2.0-flash-exp',
    GEMINI_FLASH_THINKING: 'gemini-2.0-flash-thinking-exp-01-21'
  } as const;


  static create(model: string, systemInstruction?: string) {
    throw new Error('Method not implemented.');
  }
  startChat() {
    throw new Error('Method not implemented.');
  }
  async *sendMessage(prompt: any): AsyncGenerator<string> {
    throw new Error('Method not implemented.');
  }
  generateContent(prompt: string) {
    throw new Error('Method not implemented.')
  }
  processFunctionCalls() {
    throw new Error('Method not implemented.')
  }
}

export class GeminiLLM extends LLMInterface {
  static SUPPORTED_MODELS = ['GEMINI_PRO', 'GEMINI_FLASH', 'GEMINI_FLASH_NEXT', 'GEMINI_FLASH_THINKING'];

  static isSupportedModel = (model: string) => GeminiLLM.SUPPORTED_MODELS.includes(model);

  model: GenerativeModel;
  history: Content[] = [];

  constructor(model: GenerativeModel) {
    super();
    this.model = model;
  }

  static create(model: string, systemInstruction?: string) {
    const vertexAI = new VertexAI({project: process.env.PROJECT, location: process.env.REGION});

    const tools = [{
      functionDeclarations: Object.values(allTools).map(tool => tool.definition)
    }];

    const generativeModel = vertexAI.getGenerativeModel({
      model: LLMInterface.MODEL_MAP[model as keyof typeof LLMInterface.MODEL_MAP],
      safetySettings: [{
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
      }],
      tools,
      generationConfig: {maxOutputTokens: 8192},
      systemInstruction,
    });

    const geminiLLM = new GeminiLLM(generativeModel);
    return geminiLLM;
  }

  startChat(history?: Content[]): void {
    this.history = history || [];
  }

  async *sendMessage(prompt: Content, generationConfig?: GenerationConfig): AsyncGenerator<string> {
    const contents: Content[] = [
      ...this.history,
      prompt
    ];
    const streamingResult = await this.model.generateContentStream({
      contents,
      generationConfig
    });
    const modelResponseContent: Content = {
      role: 'model',
      parts: []
    };
    this.history = contents;
    for await (const response of streamingResult.stream) {
      if (!response.candidates || !response.candidates.length) { throw new Error('No candidates found'); }
      const candidate = response.candidates[0];
      const functionCalls: FunctionCall[] = [];
      if (candidate.content) {
        for (const part of candidate.content.parts) {
          if (part.text) {
            yield part.text;
          } else if (part.functionCall) {
            console.debug(`Received function call: ${JSON.stringify(part.functionCall)}`);
            functionCalls.push(part.functionCall);
          } else {
            continue;
          }
          modelResponseContent.parts.push(part);
        }
        this.history.push(modelResponseContent);

        if (functionCalls.length > 0) {
          const functionResponseParts: FunctionResponsePart[] = await Promise.all(functionCalls.map(async functionCall => {
            const tool = allTools[functionCall.name as keyof typeof allTools];
            try {
              const result = await (tool as (...args: any[]) => Promise<any>)(...Object.values(functionCall.args));
              return {
                functionResponse: {
                  name: functionCall.name,
                  response: result
                }
              };
            } catch (error) {
              console.error(`Error calling tool ${functionCall.name}: ${error}`);
              return {
                functionResponse: {
                  name: functionCall.name,
                  response: error
                }
              };
            }            
          }));
          const functionResponseContent: Content = {
            role: 'model',
            parts: functionResponseParts
          };

          yield* this.sendMessage(functionResponseContent);
        }
      } else {
        throw new Error('No content found');
      }
    }
  }
}

export default class LLMFactory {
  static create = (model: string, systemInstruction?: string) => {
    if (GeminiLLM.isSupportedModel(model)) {
      return GeminiLLM.create(model, systemInstruction);
    }
    throw new Error(`Model ${model} not supported`);
  };
}
