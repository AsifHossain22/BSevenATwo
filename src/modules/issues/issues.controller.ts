import type { Request, Response } from 'express';
import { issuesService } from './issues.service';
import sendResponse from '../../utils/sendResponse';

// CreateIssue
const createIssue = async (req: Request, res: Response) => {
  try {
    const reporterId = req.user?.id;

    const result = await issuesService.createIssueIntoDB(req.body, reporterId);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Issue created successfully!',
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message,
    });
  }
};

// GetAllIssues
const getAllIssues = async (req: Request, res: Response) => {
  try {
    const result = await issuesService.getAllIssuesFromDB(req.query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'All Issues found successfully!',
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};

// GetSingleIssue
const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const result = await issuesService.getSingleIssueFromDB(
      req.params.id as string,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Issue found successfully!',
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: error.message.includes('not found') ? 404 : 400,
      success: false,
      message: error.message,
    });
  }
};

export const issuesController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
};
