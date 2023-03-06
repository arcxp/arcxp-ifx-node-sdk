const { readdirSync, writeFileSync } = require('fs');
const { parse } = require('path');

const codeDirectory = './src/';
const eventHandlersDirectory = 'eventsHandlers/';
const eventHandlersFile = 'eventsHandlers.js';

const constructImportSection = (imports) => `${imports.join('\n')}\n`;

const constructExportSection = (functionNames) => `module.exports = {\n  ${functionNames.join(',\n  ')},\n}`;

const getFileName = (fileDirectory) => parse(fileDirectory).name;

const constructImport = (fileDirectory, baseDirectory) => `const ${getFileName(fileDirectory)} = require('${baseDirectory}${getFileName(fileDirectory)}');`;

try {
  const handlersFiles = readdirSync(codeDirectory + eventHandlersDirectory);
  let eventHandlersFileContent = '';

  const functionNames = handlersFiles.map((fileDirectory) => getFileName(
    fileDirectory,
  ));

  const imports = handlersFiles.map((fileDirectory) => constructImport(
    fileDirectory,
    `./${eventHandlersDirectory}`,
  ));

  eventHandlersFileContent += constructImportSection(imports);
  eventHandlersFileContent += '\n';
  eventHandlersFileContent += constructExportSection(functionNames);

  console.log("The 'eventsHandlers' file content:");
  console.log(eventHandlersFileContent);

  writeFileSync(codeDirectory + eventHandlersFile, eventHandlersFileContent);
} catch (err) {
  console.error(err);
}
