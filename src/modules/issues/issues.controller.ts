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
    const result = await issuesService.getSingleIssueFromDB(req.params.id);

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

// UpdateIssue
const updateIssue = async (req: Request, res: Response) => {
  try {
    const result = await issuesService.updateIssueIntoDB(
      req.params.id,
      req.body,
      req.user,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Issue updated successfully!',
      data: result,
    });
  } catch (error: any) {
    let statusCode = 400;
    const errorMessage = error.message.toLowerCase();
    if (errorMessage.includes('not found')) statusCode = 404;
    if (errorMessage.includes('forbidden')) statusCode = 403;
    sendResponse(res, {
      statusCode: statusCode,
      success: false,
      message: error.message,
    });
  }
};

// DeleteIssue
const deleteIssue = async (req: Request, res: Response) => {
  try {
    await issuesService.deleteIssueFromDB(req.params.id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Issue deleted successfully!',
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
  updateIssue,
  deleteIssue,
};
