import { pool } from '../../db/db';

// CreatedIssue
const createIssueIntoDB = async (payload: any, reporterId: number) => {
  const { title, description, type } = payload;

  // Validates
  if (!title || title.length > 150)
    throw new Error('Title is missing or more than 150 characters!');

  if (!description || description.length < 20)
    throw new Error(
      'Description is missing or must contain at least 20 characters!',
    );

  if (type !== 'bug' && type !== 'feature_request')
    throw new Error('Type must be bug or feature_request!');

  const result = await pool.query(
    `
    INSERT INTO issues (title, description, type, status, reporter_id)
    VALUES ($1, $2, $3, 'open', $4)
    RETURNING *
    `,
    [title, description, type, reporterId],
  );
  return result.rows[0];
};

// GetAllIssues
const getAllIssuesFromDB = async (payload: any) => {
  const { sort, type, status } = payload;

  let queryText = 'SELECT * FROM issues';
  const queryValues: any[] = [];
  const filters: string[] = [];

  if (type) {
    queryValues.push(type);
    filters.push(`type = $${queryValues.length}`);
  }

  if (status) {
    queryValues.push(status);
    filters.push(`status = $${queryValues.length}`);
  }

  if (filters.length > 0) {
    queryText += ' WHERE ' + filters.join(' AND ');
  }

  // IssuesSortOrderByCreatedAt
  const orderDir = sort === 'oldest' ? 'ASC' : 'DESC';
  queryText += ` ORDER BY created_at ${orderDir}`;

  const issuesResult = await pool.query(queryText, queryValues);
  const issues = issuesResult.rows;

  if (issues.length === 0) return [];

  // ReporterId
  const reporterIds = Array.from(
    new Set(issues.map(issue => issue.reporter_id)),
  );

  const usersResult = await pool.query(
    `
    SELECT id, name, role FROM users WHERE id = ANY($1)
    `,
    [reporterIds],
  );

  const userMap = usersResult.rows.reduce((acc: any, user: any) => {
    acc[user.id] = user;
    return acc;
  }, {});

  return issues.map(issue => {
    const { reporter_id, ...rest } = issue;
    return {
      ...rest,
      reporter: userMap[reporter_id] || null,
    };
  });
};

// GetSingleIssue
const getSingleIssueFromDB = async (id: string) => {
  const issueResult = await pool.query(
    `
    SELECT * FROM issues WHERE id = $1
    `,
    [id],
  );

  if (issueResult.rows.length === 0) {
    throw new Error('Issue not found!');
  }

  const issue = issueResult.rows[0];

  const userResult = await pool.query(
    `
    SELECT id, name, role FROM users WHERE id = $1
    `,
    [issue.reporter_id],
  );

  const { reporter_id, ...rest } = issue;
  return {
    ...rest,
    reporter: userResult.rows[0] || null,
  };
};

export const issuesService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
};
