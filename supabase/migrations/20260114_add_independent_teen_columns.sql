-- Add columns for independent teen accounts
ALTER TABLE children
ADD COLUMN IF NOT EXISTS is_independent_teen BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS linked_parent_email TEXT;

-- Add account_type column to profiles for distinguishing parent vs teen accounts
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'parent';

-- Create index for faster lookup of independent teens
CREATE INDEX IF NOT EXISTS idx_children_independent_teen ON children(is_independent_teen) WHERE is_independent_teen = TRUE;

-- Comment explaining the columns
COMMENT ON COLUMN children.is_independent_teen IS 'True if this is a high school student with their own independent account';
COMMENT ON COLUMN children.linked_parent_email IS 'Optional parent email for oversight - teen can share progress with parents';
COMMENT ON COLUMN profiles.account_type IS 'Account type: parent or teen';
