CREATE SCHEMA unilink

CREATE TABLE unilink.users (
    user_id UUID PRIMARY KEY, 
    user_type TEXT, 
    university TEXT, 
    organization_name TEXT, 
    preferences JSON, 
    login_type TEXT CHECK (login_type IN ('university_sso', 'custom')), 
    notification_frequency TEXT CHECK (notification_frequency IN ('daily', 'weekly', 'none')), 
    tags_of_interest JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE unilink.events (
    event_id UUID PRIMARY KEY, 
    title TEXT NOT NULL, 
    description TEXT, 
    poster TEXT, 
    tags JSON, 
    location TEXT, 
    event_time TIMESTAMP NOT NULL, 
    created_by UUID REFERENCES unilink.users(user_id) ON DELETE CASCADE, 
    likes_count INT DEFAULT 0, 
    max_attendees INT NULL
)

CREATE TABLE unilink.trending_events (
    event_id UUID PRIMARY KEY REFERENCES unilink.events(event_id) ON DELETE CASCADE, 
    trending_score FLOAT NOT NULL, 
    date_ranked TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE unilink.calendar (
    calendar_id UUID PRIMARY KEY, 
    user_id UUID REFERENCES unilink.users(user_id) ON DELETE CASCADE, 
    event_id UUID REFERENCES unilink.events(event_id) ON DELETE SET NULL, 
    calendar_view TEXT CHECK (calendar_view IN ('day', 'week', 'month')), 
    reminders_enabled BOOLEAN DEFAULT TRUE
)

CREATE TABLE unilink.notifications (
    notification_id UUID PRIMARY KEY, 
    user_id UUID REFERENCES unilink.users(user_id) ON DELETE CASCADE,
    event_id UUID REFERENCES unilink.events(event_id) ON DELETE SET NULL,
    notification_type TEXT, 
    message TEXT NOT NULL, 
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE unilink.organization_profiles (
    organization_id UUID PRIMARY KEY REFERENCES unilink.users(user_id) ON DELETE CASCADE, 
    profile_details TEXT, 
    past_events JSON, 
    upcoming_events JSON
)

CREATE TABLE unilink.event_signups (
    signup_id UUID PRIMARY KEY, 
    user_id UUID REFERENCES unilink.users(user_id) ON DELETE CASCADE, 
    event_id UUID REFERENCES unilink.events(event_id) ON DELETE CASCADE, 
    rsvp_status TEXT, 
    checked_in BOOLEAN DEFAULT FALSE, 
    signup_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    preferences JSON
)

CREATE TABLE unilink.tags (
    tag_id UUID PRIMARY KEY,
    tag_name TEXT,
    classification TEXT
)

CREATE TABLE unilink.likes (
    like_id UUID PRIMARY KEY,
    user_id UUID REFERENCES unilink.users(user_id) ON DELETE CASCADE,
    event_id UUID REFERENCES unilink.events(event_id) ON DELETE CASCADE,
    still_valid BOOLEAN
)

CREATE TABLE unilink.rsvps (
    rsvp_id UUID PRIMARY KEY,
    user_id UUID REFERENCES unilink.users(user_id) ON DELETE CASCADE,
    event_id UUID REFERENCES unilink.events(event_id) ON DELETE CASCADE,
    still_valid BOOLEAN
)