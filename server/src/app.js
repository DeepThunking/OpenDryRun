import express from 'express';
import weatherRoutes from './routes/weatherRoutes.js';

function createApp() {
  const app = express();
  app.use(weatherRoutes);
  return app;
}

function startServer(port = process.env.PORT || 3000) {
  const app = createApp();
  return app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export { createApp, startServer };
export default createApp();
