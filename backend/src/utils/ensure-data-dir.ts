import * as fs from 'fs';
import * as path from 'path';

export function ensureDataDirectory(databasePath: string): void {
  const dir = path.dirname(databasePath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Directorio de datos creado: ${dir}`);
  }
}
