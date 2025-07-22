-- Atomic position calculation function
CREATE OR REPLACE FUNCTION get_waitlist_position(entry_id BIGINT)
RETURNS JSON AS $$
DECLARE
    result JSON;
    position_count INTEGER;
    total_count INTEGER;
    estimated_weeks INTEGER;
    position_tier TEXT;
BEGIN
    -- Calculate queue position (only for pending entries)
    SELECT COUNT(*) + 1 INTO position_count
    FROM waitlist w1, waitlist w2 
    WHERE w2.id = entry_id 
    AND w1.created_at <= w2.created_at 
    AND w1.status = 'pending'
    AND w2.status = 'pending';
    
    -- Get total submissions
    SELECT COUNT(*) INTO total_count FROM waitlist;
    
    -- Calculate position tier
    IF position_count <= 50 THEN
        position_tier := 'priority';
        estimated_weeks := GREATEST(1, LEAST(12, CEIL(position_count::FLOAT / 100) * 2 * 0.5));
    ELSIF position_count <= 500 THEN
        position_tier := 'regular';
        estimated_weeks := GREATEST(1, LEAST(12, CEIL(position_count::FLOAT / 100) * 2 * 0.8));
    ELSE
        position_tier := 'extended';
        estimated_weeks := GREATEST(1, LEAST(12, CEIL(position_count::FLOAT / 100) * 2 * 1.2));
    END IF;
    
    -- Build result JSON
    SELECT json_build_object(
        'queue_position', position_count,
        'total_submissions', total_count,
        'estimated_wait_weeks', estimated_weeks,
        'position_tier', position_tier
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to submit waitlist entry with position calculation
CREATE OR REPLACE FUNCTION submit_waitlist_with_position(
    p_email TEXT,
    p_name TEXT,
    p_company TEXT DEFAULT NULL,
    p_use_case TEXT DEFAULT NULL,
    p_source TEXT DEFAULT 'unknown'
)
RETURNS JSON AS $$
DECLARE
    new_entry_id BIGINT;
    position_info JSON;
    result JSON;
    entry_record RECORD;
BEGIN
    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM waitlist WHERE email = p_email) THEN
        -- Return existing entry with position info
        SELECT w.*, get_waitlist_position(w.id) as position_data
        INTO entry_record
        FROM waitlist w 
        WHERE w.email = p_email;
        
        -- Build error response with waitlist info
        SELECT json_build_object(
            'error', 'Email already exists',
            'waitlist_info', json_build_object(
                'id', entry_record.id,
                'email', entry_record.email,
                'name', entry_record.name,
                'company', entry_record.company,
                'use_case', entry_record.use_case,
                'source', entry_record.source,
                'status', entry_record.status,
                'priority', entry_record.priority,
                'notes', entry_record.notes,
                'created_at', entry_record.created_at,
                'updated_at', entry_record.updated_at,
                'reviewed_at', entry_record.reviewed_at,
                'reviewed_by', entry_record.reviewed_by,
                'queue_position', (entry_record.position_data->>'queue_position')::INTEGER,
                'total_submissions', (entry_record.position_data->>'total_submissions')::INTEGER,
                'estimated_wait_weeks', (entry_record.position_data->>'estimated_wait_weeks')::INTEGER,
                'position_tier', entry_record.position_data->>'position_tier'
            )
        ) INTO result;
        
        RETURN result;
    END IF;
    
    -- Insert new entry
    INSERT INTO waitlist (email, name, company, use_case, source)
    VALUES (p_email, p_name, p_company, p_use_case, p_source)
    RETURNING id INTO new_entry_id;
    
    -- Get position information
    SELECT get_waitlist_position(new_entry_id) INTO position_info;
    
    -- Get the full entry record
    SELECT * FROM waitlist WHERE id = new_entry_id INTO entry_record;
    
    -- Build success response
    SELECT json_build_object(
        'id', entry_record.id,
        'email', entry_record.email,
        'name', entry_record.name,
        'company', entry_record.company,
        'use_case', entry_record.use_case,
        'source', entry_record.source,
        'status', entry_record.status,
        'priority', entry_record.priority,
        'notes', entry_record.notes,
        'created_at', entry_record.created_at,
        'updated_at', entry_record.updated_at,
        'reviewed_at', entry_record.reviewed_at,
        'reviewed_by', entry_record.reviewed_by,
        'queue_position', (position_info->>'queue_position')::INTEGER,
        'total_submissions', (position_info->>'total_submissions')::INTEGER,
        'estimated_wait_weeks', (position_info->>'estimated_wait_weeks')::INTEGER,
        'position_tier', position_info->>'position_tier'
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get waitlist statistics
CREATE OR REPLACE FUNCTION get_waitlist_stats()
RETURNS JSON AS $$
DECLARE
    stats JSON;
    recent_entries JSON;
BEGIN
    -- Get basic statistics
    WITH stats_data AS (
        SELECT 
            COUNT(*) as total_submissions,
            COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
            COUNT(*) FILTER (WHERE status = 'approved') as approved_count,
            COUNT(*) FILTER (WHERE status = 'rejected') as rejected_count
        FROM waitlist
    )
    SELECT json_build_object(
        'total_submissions', sd.total_submissions,
        'pending_count', sd.pending_count,
        'approved_count', sd.approved_count,
        'rejected_count', sd.rejected_count
    ) INTO stats
    FROM stats_data sd;
    
    -- Get recent submissions (last 10)
    SELECT json_agg(
        json_build_object(
            'id', w.id,
            'email', w.email,
            'name', w.name,
            'company', w.company,
            'use_case', w.use_case,
            'source', w.source,
            'status', w.status,
            'priority', w.priority,
            'notes', w.notes,
            'created_at', w.created_at,
            'updated_at', w.updated_at,
            'reviewed_at', w.reviewed_at,
            'reviewed_by', w.reviewed_by
        )
    ) INTO recent_entries
    FROM (
        SELECT * FROM waitlist 
        ORDER BY created_at DESC 
        LIMIT 10
    ) w;
    
    -- Combine stats and recent entries
    RETURN stats || json_build_object('recent_submissions', recent_entries);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;