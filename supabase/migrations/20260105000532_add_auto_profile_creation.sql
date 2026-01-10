/*
  # Add Automatic Profile Creation Trigger

  1. Changes
    - Create a trigger function that automatically creates a profile when a user signs up
    - Trigger runs after INSERT on auth.users
    - Ensures every user always has a corresponding profile record
    
  2. Security
    - Function runs with SECURITY DEFINER to bypass RLS
    - Only creates profiles, doesn't modify existing ones
*/

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, parent_pin)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    '0000'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();