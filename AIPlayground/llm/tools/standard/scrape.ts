import { FunctionDeclarationSchemaType } from '@google-cloud/vertexai';
import playwright from 'playwright';

async function scrapeURL(url: string): Promise<{html: string}> {
  try {
    new URL(url);
  } catch (error) {
    throw new Error(`Invalid URL provided: ${url}`);
  }

  try {
    const browser = await playwright.chromium.launch();
    const page = await browser.newPage({});

    // Navigate to URL
    await page.goto(String(url), {
      waitUntil: 'domcontentloaded',
      timeout: 120000
    });

    // Remove scripts and stylesheets before getting content
    await page.evaluate(() => {
      // Remove all script tags
      const scripts = document.getElementsByTagName('script');
      while(scripts.length > 0) {
        scripts[0].parentNode?.removeChild(scripts[0]);
      }
      
      // Remove all style tags
      const styles = document.getElementsByTagName('style');
      while(styles.length > 0) {
        styles[0].parentNode?.removeChild(styles[0]);
      }
      
      // Remove all link tags (external stylesheets)
      const links = document.getElementsByTagName('link');
      for(let i = links.length - 1; i >= 0; i--) {
        if(links[i].rel === 'stylesheet') {
          links[i].parentNode?.removeChild(links[i]);
        }
      }
    });

    // Get cleaned HTML content
    const html = await page.content();

    await browser.close();

    return {
      html,
    };
  } catch (error) {
    console.log(error);
    return {
      html: ''
    };
  }
}

scrapeURL.definition = {
  name: 'scrapeURL',
  description: 'Scrapes HTML content of a given URL. Use this tool to gather information from a specific URL.',
  parameters: {
    type: FunctionDeclarationSchemaType.OBJECT,
    properties: {
      url: {
        type: FunctionDeclarationSchemaType.STRING,
        description: 'The URL to scrape.'
      },
    },
    required: ['url'],
  }
};

async function takeURLScreenshot(url: string): Promise<{imageBase64: string}> {
  try {
    new URL(url);
  } catch (error) {
    throw new Error(`Invalid URL provided: ${url}`);
  }

  try {
    const browser = await playwright.chromium.launch();
    const page = await browser.newPage({});

    // Navigate to URL
    await page.goto(String(url), {
      waitUntil: 'domcontentloaded',
      timeout: 120000
    });

    // Take screenshot and convert to base64
    const screenshot = await page.screenshot({
      type: 'jpeg',
      quality: 50,
      fullPage: true
    });
    const base64Screenshot = screenshot.toString('base64');

    await browser.close();

    return {
      imageBase64: base64Screenshot
    };
  } catch (error) {
    console.log(error);
    return {
      imageBase64: ''
    };
  }
}

takeURLScreenshot.definition = {
  name: 'takeURLScreenshot',
  description: 'Takes a screenshot of a given URL. Use this tool to gather visual information from a specific URL.',
  parameters: {
    type: FunctionDeclarationSchemaType.OBJECT,
    properties: {
      url: {
        type: FunctionDeclarationSchemaType.STRING,
        description: 'The URL to take a screenshot of.'
      },
    },
    required: ['url'],
  }
};

const tools = {
  scrapeURL,
  takeURLScreenshot
};

export default tools;

if (import.meta.url.endsWith(process.argv[1])) {
  // const url = 'https://www.optimizely.com';
  // const url = 'https://www.rtings.com/printer/reviews/best/by-usage/photo';
  // const url = 'https://www.techradar.com/news/best-photo-printer';
  // const url = 'https://www.rtings.com/printer/reviews/brother/mfc-j1205w';
  // const url = 'https://www.techradar.com/best/best-cheap-printers';
  // const url = "https://www.digitalcameraworld.com/buying-guides/best-budget-photo-printer";
  // const url = "https://www.pcmag.com/picks/the-best-budget-photo-printers";
  const url = "https://www.unilever.com/news/press-and-media/press-releases/";
  const v = await scrapeURL(url);
  console.log(v);
}
