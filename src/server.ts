import app from './app';
import config from './config/env';

const main = () => {
  app.listen(config.port, () => {
    console.log(`Next Level Server running on port ${config.port}`);
  });
};
main();
