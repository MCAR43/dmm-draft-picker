-- Create a table for draft boards
CREATE TABLE draft_boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  captains JSON NOT NULL,
  selections JSON NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE draft_boards ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to select their own draft boards
CREATE POLICY "Users can view their own draft boards" 
  ON draft_boards FOR SELECT 
  USING (auth.uid() = user_id);

-- Create a policy that allows users to insert their own draft boards
CREATE POLICY "Users can insert their own draft boards" 
  ON draft_boards FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to update their own draft boards
CREATE POLICY "Users can update their own draft boards" 
  ON draft_boards FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create a policy that allows users to delete their own draft boards
CREATE POLICY "Users can delete their own draft boards" 
  ON draft_boards FOR DELETE 
  USING (auth.uid() = user_id);

-- Create a function to update updated_at automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger for the updated_at column
CREATE TRIGGER update_draft_boards_updated_at
BEFORE UPDATE ON draft_boards
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column(); 