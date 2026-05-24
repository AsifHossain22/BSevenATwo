import { Router } from 'express';
import { issuesController } from './issues.controller';

const router = Router();

// CreateIssue - POST
router.post('/', issuesController.createIssue);

// GetAllIssues - GET
router.get('/', issuesController.getAllIssues);

// GetSingleIssue - GET
router.get('/:id', issuesController.getSingleIssue);

// UpdateIssue - PATCH
router.patch('/:id', issuesController.updateIssue);

// DeleteIssue - DELETE
router.delete('/:id', issuesController.deleteIssue);

export const issuesRoutes = router;
