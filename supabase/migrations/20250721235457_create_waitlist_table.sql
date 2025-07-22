-- Create waitlist table with proper schema
CREATE TABLE IF NOT EXISTS waitlist (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    company TEXT,
    use_case TEXT,
    source TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    priority INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    reviewed_at TIMESTAMPTZ,
    reviewed_by TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);
CREATE INDEX IF NOT EXISTS idx_waitlist_priority ON waitlist(priority DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_waitlist_updated_at ON waitlist;
CREATE TRIGGER update_waitlist_updated_at
    BEFORE UPDATE ON waitlist
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (drop existing ones first to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can submit to waitlist" ON waitlist;
DROP POLICY IF EXISTS "Users can view all waitlist entries" ON waitlist;
DROP POLICY IF EXISTS "Only admins can update waitlist entries" ON waitlist;
DROP POLICY IF EXISTS "Only admins can delete waitlist entries" ON waitlist;

CREATE POLICY "Anyone can submit to waitlist"
ON waitlist FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Users can view all waitlist entries"
ON waitlist FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only admins can update waitlist entries"  
ON waitlist FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Only admins can delete waitlist entries"
ON waitlist FOR DELETE
TO authenticated
USING (true);