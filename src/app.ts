import express, {
  type Application,
  type Request,
  type Response,
} from 'express';

// ExpressApp
const app: Application = express();

// ExpressMiddleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// RootRoute
app.get('/', async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Hello Next Level Server!',
  });
});

export default app;
