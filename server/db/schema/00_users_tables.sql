DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NO NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create the trigger function to update the 'updated_at' column
CREATE OR REPLACE FUNCTION update_updated_at_column() 
RETURNS TRIGGER AS $$  -- Indicates that this is a trigger function returning a TRIGGER type
BEGIN
  -- Set the 'updated_at' column to the current timestamp
  NEW.updated_at = NOW();  -- Assign the current timestamp to the 'updated_at' column of the new row being updated
  RETURN NEW;  -- Return the modified row with the updated 'updated_at' timestamp
END;
$$ LANGUAGE 'plpgsql';  -- Specifies that the function is written in PL/pgSQL language

-- Create the trigger for the 'users' table
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users  -- Specifies that the trigger should fire before any UPDATE operation on the 'users' table
FOR EACH ROW  -- Indicates that the trigger will execute for each row affected by the UPDATE operation
EXECUTE PROCEDURE update_updated_at_column();  -- Calls the trigger function to update the 'updated_at' column
