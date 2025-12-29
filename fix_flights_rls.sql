-- Enable RLS on the table
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read flights (public access)
CREATE POLICY "Enable read access for all users" ON "public"."flights"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Policy to allow authenticated users to insert new flights
CREATE POLICY "Enable insert for authenticated users only" ON "public"."flights"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy to allow authenticated users to update flights
CREATE POLICY "Enable update for authenticated users only" ON "public"."flights"
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy to allow authenticated users to delete flights
CREATE POLICY "Enable delete for authenticated users only" ON "public"."flights"
AS PERMISSIVE FOR DELETE
TO authenticated
USING (true);
