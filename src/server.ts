import app from './app';
import config from './config/env';

const main = () => {
  try {
    app.listen(config.port, () => {
      console.log(`Next Level Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server: ', error);
  }
};
main();
