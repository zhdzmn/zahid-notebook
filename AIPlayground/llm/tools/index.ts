import googleSearchTools from './standard/googleSearch';
import scrapeTools from './standard/scrape';
const allTools = {
  ...googleSearchTools,
  ...scrapeTools
};
export default allTools;
