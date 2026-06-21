import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../../db/db';
import config from '../../config/env';

// RegisterUser
const registerUserIntoDB = async (payload: any) => {
  const { name, email, password, role } = payload;

  if (!name) {
    throw new Error('Name is required!');
  }

  if (!email) {
    throw new Error('Email is required!');
  }

  if (!password) {
    throw new Error('Password is required!');
  }

  if (role && role !== 'contributor' && role !== 'maintainer') {
    throw new Error('Role must be contributor or maintainer!');
  }

  const userExists = await pool.query(
    `
    SELECT * FROM users WHERE email = $1
    `,
    [email],
  );

  // ValidateUser
  if (userExists.rows.length > 0) {
    throw new Error('User already exists with this email address!');
  }

  // HashPassword
  const hashPassword = await bcrypt.hash(password, 10);

  // UserRole
  const defaultRole = role || 'contributor';

  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, role) 
    VALUES ($1, $2, $3, $4) 
    RETURNING id, name, email, role, created_at, updated_at
    `,
    [name, email, hashPassword, defaultRole],
  );
  return result.rows[0];
};

// LogInUser
const loginUserIntoDB = async (payload: any) => {
  const { email, password } = payload;

  const userResult = await pool.query(
    `
    SELECT * FROM users WHERE email = $1
    `,
    [email],
  );

  // Validate - LogInData
  if (userResult.rows.length === 0) {
    throw new Error('Invalid Credentials!');
  }

  const user = userResult.rows[0];

  // Validate - Password
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error('Invalid Credentials!');
  }

  // GenerateTOKEN
  const jwtTokenPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };

  // RefreshTOKEN
  const refreshToken = jwt.sign(
    jwtTokenPayload,
    config.refreshSecret as string,
    {
      expiresIn: '10d',
    },
  );

  // AccessTOKEN
  const accessToken = jwt.sign(jwtTokenPayload, config.secret as string, {
    expiresIn: '1d',
  });

  return {
    token: accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  };
};

export const authService = {
  registerUserIntoDB,
  loginUserIntoDB,
};
