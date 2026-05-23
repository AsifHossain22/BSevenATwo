import dotenv from 'dotenv';
import path from 'path';

// JoinPath
dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

// Config
const config = {
  port: process.env.PORT,
};

export default config;
