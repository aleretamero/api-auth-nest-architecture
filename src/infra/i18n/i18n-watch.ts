// import * as chokidar from 'chokidar';
// import * as fs from 'node:fs';
// import * as path from 'node:path';

// async function convertJsAndTsToJSON(pathName: string) {
//   const regex = /^(?!.*\.d\.ts$).*\.(ts|js)$/;
//   if (!pathName.match(regex)) return;

//   try {
//     const data = (await import(pathName))?.default;

//     if (!data) return;

//     delete require.cache[pathName];

//     const replacePathExtensionToJson = pathName.replace(/\.(ts|js)$/, '.json');

//     fs.writeFileSync(replacePathExtensionToJson, JSON.stringify(data, null, 2), 'utf8'); // prettier-ignore
//   } catch (error) {}
// }

// function removeFiles(path: string) {
//   const regex = /^(?!.*\.d\.ts$).*\.(ts|js)$/;
//   if (!path.match(regex)) return;

//   const replacePathExtensionToJson = path.replace(/\.(ts|js)$/, '.json');

//   console.log(`Removing ${replacePathExtensionToJson}`);

//   if (fs.existsSync(replacePathExtensionToJson)) {
//     fs.unlinkSync(replacePathExtensionToJson);
//   }

//   const replacePathExtensionToJs = path
//     .replace(/src/, 'dist')
//     .replace(/\.(ts)$/, '.js');

//   if (fs.existsSync(replacePathExtensionToJs)) {
//     fs.unlinkSync(replacePathExtensionToJs);
//   }
// }

// export function watchI18nFiles() {
//   chokidar
//     .watch(path.resolve(__dirname, 'locales', '**/*.(ts|js)'))
//     .on('add', convertJsAndTsToJSON)
//     .on('change', convertJsAndTsToJSON)
//     .on('unlink', removeFiles)
//     .on('all', (event, path) => console.log(event, path));
// }
