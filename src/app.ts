import express, {
  type Application,
  type Request,
  type Response,
} from 'express';
import { issuesRoutes } from './modules/issues/issues.routes';

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

// IssuesRoutes
app.use('/api/issues', issuesRoutes);

export default app;
