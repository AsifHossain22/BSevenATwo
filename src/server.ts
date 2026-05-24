import app from './app';
import config from './config/env';
import { initDB } from './db/db';

const main = () => {
  initDB(); // ConnectDB
  try {
    app.listen(config.port, () => {
      console.log(`Next Level Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server: ', error);
  }
};
main();
