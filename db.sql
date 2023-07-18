-- Create
CREATE DATABASE finonex_exam_db;

-- Use database
\c finonex_exam_db;

-- Create table
CREATE TABLE users_revenue (
  user_id SERIAL PRIMARY KEY,
  revenue INTEGER
);