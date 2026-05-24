import dotenv from 'dotenv';
import path from 'path';

// Path
dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

// Config
const config = {
  connectionString: process.env.CONNECTION_STRING as string,
  port: process.env.PORT,
  secret: process.env.JWT_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
};

export default config;
