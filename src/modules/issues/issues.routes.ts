import { Router } from 'express';
import { issuesController } from './issues.controller';
import auth from '../../middleware/auth';

const router = Router();

// CreateIssue - POST
router.post(
  '/',
  auth('maintainer', 'contributor'),
  issuesController.createIssue,
);

// GetAllIssues - GET
router.get('/', issuesController.getAllIssues);

// GetSingleIssue - GET
router.get('/:id', issuesController.getSingleIssue);

export const issuesRoutes = router;
