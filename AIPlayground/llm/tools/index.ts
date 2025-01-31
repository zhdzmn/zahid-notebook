import { readdirSync } from 'fs';
import { join } from 'path';
const currentDir = new URL('.', import.meta.url).pathname;
// Function to recursively get all tool files
function getToolFiles(dir: string): string[] {
  const files: string[] = [];
  const items = readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...getToolFiles(fullPath));
    } else if (item.name.endsWith('.ts') && !item.name.endsWith('index.ts')) {
      files.push(fullPath);
    }
  }
  return files;
}

// Get all tool files dynamically
const toolFiles = getToolFiles(currentDir);
// Import all tools dynamically
const importedTools = toolFiles.map(file => {
  const relativePath = './' + file.slice(currentDir.length).replace(/\.ts$/, '');
  return import(relativePath).then(module => module.default);
});

// Combine all tools into a single object
const allTools = Promise.all(importedTools).then(tools => {
  return Object.assign({}, ...tools);
});

export default await allTools;
