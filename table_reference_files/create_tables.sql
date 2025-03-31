CREATE SCHEMA unilink

CREATE TABLE unilink.universities (
    university_id UUID PRIMARY KEY,
    university_name TEXT
)

CREATE TABLE unilink.tags (
    tag_id UUID PRIMARY KEY,
    tag_name TEXT,
    classification TEXT,
    color TEXT
)

CREATE TABLE unilink.users (
    user_id UUID PRIMARY KEY, 
    user_name TEXT,
    user_type TEXT, 
    university_id UUID REFERENCES unilink.universities(university_id) ON DELETE CASCADE, 
    login_type TEXT CHECK (login_type IN ('university_sso', 'custom')), 
    rec_frequency TEXT CHECK (rec_frequency IN ('daily', 'weekly', 'none')), 
    notications BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE unilink.user_tags (
    user_tag_id UUID PRIMARY KEY,
    user_id UUID REFERENCES unilink.users(user_id) ON DELETE CASCADE,
    tag_id UUID REFERENCES unilink.tags(tag_id) ON DELETE CASCADE
)

CREATE TABLE unilink.organizations (
    organization_id UUID PRIMARY KEY,
    organization_name TEXT,
    organization_bio TEXT,
    organization_address TEXT,
    university_id UUID REFERENCES unilink.universities(university_id) ON DELETE CASCADE
)

CREATE TABLE unilink.events (
    event_id UUID PRIMARY KEY, 
    title TEXT NOT NULL, 
    event_description TEXT, 
    poster_path TEXT, 
    event_location TEXT, 
    event_time TIMESTAMPTZ NOT NULL, 
    organization_id UUID REFERENCES unilink.organizations(organization_id), 
    max_attendees INT NOT NULL,
    expirtation_date TIMESTAMPTZ NOT NULL
)

CREATE TABLE unilink.event_tags (
    event_tag_id UUID PRIMARY KEY,
    event_id UUID REFERENCES unilink.events(event_id) ON DELETE CASCADE,
    tag_id UUID REFERENCES unilink.tags(tag_id) ON DELETE CASCADE
)

CREATE TABLE unilink.notifications (
    notification_id UUID PRIMARY KEY, 
    user_id UUID REFERENCES unilink.users(user_id) ON DELETE CASCADE,
    event_id UUID REFERENCES unilink.events(event_id) ON DELETE CASCADE,
    notification_type TEXT, 
    message TEXT NOT NULL, 
    sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
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