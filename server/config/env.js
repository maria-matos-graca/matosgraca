// config/env.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function loadEnv() {

    if (process.env.RAILWAY_ENVIRONMENT) {
        console.log('Ambiente Railway detectado');
        return;
    }
    
    const result = dotenv.config({ path: path.join(__dirname, '../.env') });
    if (result.error) {
        console.log('Ficheiro .env não encontrado');
    } else {
        console.log('Variáveis carregadas do .env');
    }
}