// backend/config/env.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadEnv = () => {
    const env = process.env.NODE_ENV || 'development';
    
    if (env === 'production') {
        dotenv.config({ path: path.join(__dirname, '../.env.production') });
        console.log('🔧 Carregando configurações de PRODUÇÃO');
    } else {
        dotenv.config({ path: path.join(__dirname, '../.env') });
        console.log('🔧 Carregando configurações de DESENVOLVIMENTO');
    }
    
    console.log(`📦 Ambiente: ${env}`);
    console.log(`💾 Banco: ${process.env.DB_DIALECT}`);
};

export default loadEnv;