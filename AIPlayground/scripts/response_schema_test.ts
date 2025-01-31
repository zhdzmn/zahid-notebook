import '../config';
import { stdout } from 'node:process';

import LLMFactory from '../llm';
import { SchemaType } from '@google-cloud/vertexai';
const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    function_name: {
      description: 'The name of the function to call',
      type: SchemaType.STRING
    },
    parameters: {
      description: 'The parameters to pass to the function in JSON Stringified format', 
      type: SchemaType.STRING
    }
  },
  required: ['function_name', 'parameters'],
};

const generationConfig = {
  responseSchema,
  responseMimeType: 'application/json'
};
const malformed_function_call_error = `malformed_function_call_error = "Malformed function call: print(update_task_content(content_id='e490c01001274501b25f784b41671407', fields=[{'field_x_path': 'e490c01001274501b25f784b41671407.body.bn.0', 'field_key': 'body', 'field_value': '<h1>Social Media Campaign for Optimizely CMP (Gen Z Focus)</h1>\n<p>This campaign is designed to connect with Generation Z (born 1997-2012) on social media platforms they frequent.</p>\n<p><b>Objective:</b> Drive adoption of Optimizely's Content Marketing Platform (CMP) among Gen Z professionals.</p>\n<p><b>Target Audience:</b> Gen Z content creators, marketers, and decision-makers.</p>\n<p><b>Platforms:</b> TikTok, Instagram, YouTube, and Twitter.</p>\n<p><b>Strategy:</b></p>\n<ul><li><b>Content Pillars:</b> Focus on creativity, authenticity, and social impact. Highlight how Optimizely CMP empowers users to create unique and engaging content that resonates with their target audience.  Emphasize mobile-first design, ease of use, and quick results.</li><li><b>Content Types:</b> Create short-form videos, engaging visuals, and interactive content. Leverage user-generated content and influencer marketing. Run contests and challenges to encourage participation.</li><li><b>Paid Advertising:</b> Utilize targeted advertising on platforms frequented by Gen Z. A/B test ad creatives to optimize performance.</li><li><b>Community Engagement:</b> Actively participate in relevant online communities and discussions.  Respond to comments and messages promptly.  Partner with relevant influencers to amplify reach.</li></ul>\n<p><b>Metrics:</b> Track impressions, reach, engagement (likes, shares, comments, saves), website clicks, lead generation, and cost per lead. Regularly analyze data to optimize campaign performance.</p>\n<p><b>Timeline:</b> Align with the overall campaign timeline. Establish clear deadlines for content creation, ad scheduling, and performance analysis.</p>\n<p><b>Deliverables:</b> Regular reports detailing campaign performance, including key metrics and insights. Recommendations for optimization based on data analysis.</p>', 'field_type': 'rich-text', 'is_core_attribute': False, 'order_index': 0}], locale='bn', org_sso_id='5d75447b7f1c1c000957d362', task_id='679ef38439c248babc9127c2', user_id='679cdc0691b9dd759a819820')`;
const prompt = `
You are an Expert function parameter extractor tool.
Extract out the parameters from the following.
\`\`\`
${malformed_function_call_error}
\`\`\`
`;

async function run() {
  const llm = LLMFactory.create("GEMINI_FLASH_NEXT");
  llm.startChat();
  const streamingResult = llm.sendMessage({
      role: 'user',
      parts: [{
        text: prompt
      }]
  }, generationConfig);
  for await (const item of streamingResult) {
    stdout.write(item);
  }
}

if (import.meta.url.endsWith(process.argv[1])) {
  await run();
}
