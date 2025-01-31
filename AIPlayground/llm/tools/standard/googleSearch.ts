import { FunctionDeclarationSchemaType } from '@google-cloud/vertexai';
import '../../../config';
import { google } from 'googleapis';

interface SearchResultItem {
  title: string;
  link: string;
  snippet: string;
}

interface SearchResults {
  results: SearchResultItem[];
}

async function searchCustomSearchAPI(
  query: string
): Promise<SearchResults> {
  const customsearch = google.customsearch('v1');

  const response = await customsearch.cse.list({
    cx: process.env.CUSTOM_SEARCH_ENGINE_ID,
    q: query,
    auth: process.env.GOOGLE_SEARCH_API_KEY,
  });

  if (!response.data || !response.data.items) {
    return { results: [] };
  }
  return {
    results: response.data.items.map((item: any) => ({
      title: item.title || '',
      link: item.link || '',
      snippet: item.snippet || '',
    }))
  };
}

searchCustomSearchAPI.definition = {
  name: 'searchCustomSearchAPI',
  description: 'A tool for searching the web to retrieve information. Use this tool when you need to access up-to-date information, require additional knowledge to complete a task, or need to perform research. You can issue multiple search queries within a single call to refine your search and gather comprehensive results. After using this tool, use the `scrapeURL` tool to examine the content of the returned URLs.',
  parameters: {
    type: FunctionDeclarationSchemaType.OBJECT,
    properties: {
      query: {
        type: FunctionDeclarationSchemaType.STRING,
        description: 'A single web search query. Be as specific as possible to get the best results.  You can include keywords, phrases, or questions.  Consider varying your queries to explore different facets of the topic.'
      }
    },
    required: ['query'],
  }
};

const tools = {
  searchCustomSearchAPI
};

export default tools;

if (import.meta.url.endsWith(process.argv[1])) {
  const v = await searchCustomSearchAPI('DeepSeek AI');
  console.log(v)
}
