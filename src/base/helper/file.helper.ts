import * as fs from 'fs';

export function deleteFile(filePath: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    fs.unlink(filePath, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
