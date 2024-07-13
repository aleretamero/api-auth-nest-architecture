import * as fs from 'node:fs';
import * as path from 'node:path';

export class FileSystem {
  static async convertImportDefaultFilesToJSON(
    directory: string,
    regex: RegExp = /^(?!.*\.d\.ts$).*\.(ts|js)$/,
  ) {
    const files = await fs.promises.readdir(directory);

    for (const file of files) {
      const filePath = path.join(directory, file);
      const fileStat = await fs.promises.stat(filePath);

      if (fileStat.isDirectory()) {
        await FileSystem.convertImportDefaultFilesToJSON(filePath, regex);
      } else if (filePath.match(regex)) {
        const data = (await import(filePath))?.default;
        if (!data) continue;

        const jsonFileName = filePath.replace(/\.(ts|js)$/, '.json');
        fs.writeFileSync(jsonFileName, JSON.stringify(data, null, 2));
      }
    }
  }

  static getStream(filePath: string): fs.ReadStream {
    return fs.createReadStream(filePath);
  }

  static deleteFile(filePath: string): void {
    if (filePath) {
      fs.unlinkSync(filePath);
      console.log(`${filePath} was deleted'`);
    }
  }
}
