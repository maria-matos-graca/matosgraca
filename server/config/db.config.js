import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  dialect: 'postgres',
  url: process.env.DATABASE_URL,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

export default dbConfig;