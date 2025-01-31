// import { FunctionDeclarationSchemaType } from '@google-cloud/vertexai';

async function getToday(): Promise<{date: string}> {
  const today = new Date();
  const date = today.toISOString().split('T')[0];
  return { date };
}

getToday.definition = {
  name: 'getToday',
  description: 'Get the current date',
};

const tools = {
  getToday,
};

export default tools;
