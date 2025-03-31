import psycopg2
import uuid
import random
from datetime import datetime
import json

# Establish a connection to your PostgreSQL database
conn = psycopg2.connect(
    dbname="postgres",
    user="postgres",
    password="post123",
    host="3.128.200.240",
    port="5432"
)

# Create a cursor to interact with the database
cur = conn.cursor()

# Function to generate random user preferences
def generate_random_user_preferences():
    notification_frequency = random.choice(['daily', 'weekly', 'none'])
    tags_of_interest = json.dumps([f"interest_tag{random.randint(1, 5)}"])
    
    return (notification_frequency, tags_of_interest)

# Function to generate random data for users
def generate_random_user(i):
    user_id = str(uuid.uuid4())
    user_type = 'student' if i % 2 == 0 else 'organization'
    university = f'RPI {i}' if user_type == 'student' else None
    organization_name = f'Random Organization {i}' if user_type == 'organization' else None
    preferences = json.dumps({"tags": [f"tag{i}"]})
    login_type = 'university_sso' if user_type == 'student' else 'custom'
    notif_freq, tags  = generate_random_user_preferences()
    created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    return (user_id, user_type, university, organization_name, preferences, login_type, notif_freq, tags, created_at)

# Insert 30 Users
for i in range(1, 31):
    user_data = generate_random_user(i)
    insert_query = """
        INSERT INTO unilink.users (user_id, user_type, university, organization_name, preferences, login_type, notification_frequency, tags_of_interest, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
    """
    cur.execute(insert_query, user_data)

# Function to generate random event data
def generate_random_event(i, user_id):
    event_id = str(uuid.uuid4())
    title = f"Event {i}"
    description = f"Description of Event {i}"
    poster = f"https://example.com/poster{i}.jpg"
    tags = json.dumps([f"tag{i}", f"event_tag{i}"])
    location = f"Location {i}"
    event_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    likes_count = random.randint(0, 100)
    max_attendees = random.randint(50, 500) if i % 2 == 0 else None
    
    return (event_id, title, description, poster, tags, location, event_time, user_id, likes_count, max_attendees)

# Insert 30 Events
cur.execute("SELECT user_id FROM unilink.users")
user_ids = [row[0] for row in cur.fetchall()]
for i in range(1, len(user_ids)):
    event_data = generate_random_event(i, user_ids[i-1])
    insert_query = """
        INSERT INTO unilink.events (event_id, title, description, poster, tags, location, event_time, created_by, likes_count, max_attendees)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    """
    cur.execute(insert_query, event_data)

# Function to generate random trending events data
def generate_random_trending_event(event_id):
    trending_score = round(random.uniform(1.0, 10.0), 2)
    date_ranked = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    return (event_id, trending_score, date_ranked)

# Insert 30 Trending Events
cur.execute("SELECT event_id FROM unilink.events LIMIT 30")
event_ids = [row[0] for row in cur.fetchall()]

for event_id in event_ids:
    trending_event_data = generate_random_trending_event(event_id)
    insert_query = """
        INSERT INTO unilink.trending_events (event_id, trending_score, date_ranked)
        VALUES (%s, %s, %s);
    """
    cur.execute(insert_query, trending_event_data)

# Function to generate random calendar entries
def generate_random_calendar(user_id, event_id):
    calendar_id = str(uuid.uuid4())
    calendar_view = random.choice(['day', 'week', 'month'])
    reminders_enabled = random.choice([True, False])
    
    return (calendar_id, user_id, event_id, calendar_view, reminders_enabled)

# Insert 30 Calendar Entries
for user_id in user_ids:
    event_id = random.choice(event_ids)
    calendar_data = generate_random_calendar(user_id, event_id)
    insert_query = """
        INSERT INTO unilink.calendar (calendar_id, user_id, event_id, calendar_view, reminders_enabled)
        VALUES (%s, %s, %s, %s, %s);
    """
    cur.execute(insert_query, calendar_data)

# Function to generate random notifications
def generate_random_notification(user_id, event_id):
    notification_id = str(uuid.uuid4())
    notification_type = random.choice(['trending_event', 'new_event_from_followed_poster', 'daily_reminder', 'event_starting_soon'])
    message = f"Notification for {notification_type}"
    sent_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    return (notification_id, user_id, event_id, notification_type, message, sent_at)

# Insert 30 Notifications
for i in range(len(event_ids)):
    user_id = user_ids[i]
    event_id = event_ids[i]
    notification_data = generate_random_notification(user_id, event_id)
    insert_query = """
        INSERT INTO unilink.notifications (notification_id, user_id, event_id, notification_type, message, sent_at)
        VALUES (%s, %s, %s, %s, %s, %s);
    """
    cur.execute(insert_query, notification_data)

# Function to generate random organization profiles
def generate_random_organization_profile(organization_id):
    profile_details = "Description, social media links, etc."
    past_events = json.dumps(event_ids[:15])
    upcoming_events = json.dumps(event_ids[15:])
    
    return (organization_id, profile_details, past_events, upcoming_events)

# Insert Organization Profiles
cur.execute("SELECT user_id FROM unilink.users WHERE user_type='organization'")
organization_ids = [row[0] for row in cur.fetchall()]
for organization_id in organization_ids:
    org_profile_data = generate_random_organization_profile(organization_id)
    insert_query = """
        INSERT INTO unilink.organization_profiles (organization_id, profile_details, past_events, upcoming_events)
        VALUES (%s, %s, %s, %s);
    """
    cur.execute(insert_query, org_profile_data)

# Function to generate random event signups
def generate_random_event_signup(user_id, event_id):
    signup_id = str(uuid.uuid4())
    rsvp_status = random.choice(['interested', 'going', 'not_going'])
    checked_in = random.choice([True, False])
    signup_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    preferences = json.dumps({"dietary_restrictions": f"none", "accessibility_needs": f"none"})
    
    return (signup_id, user_id, event_id, rsvp_status, checked_in, signup_time, preferences)

# Insert 30 Event Signups
for user_id in random.sample(user_ids, 30):
    event_id = random.choice(event_ids)
    signup_data = generate_random_event_signup(user_id, event_id)
    insert_query = """
        INSERT INTO unilink.event_signups (signup_id, user_id, event_id, rsvp_status, checked_in, signup_time, preferences)
        VALUES (%s, %s, %s, %s, %s, %s, %s);
    """
    cur.execute(insert_query, signup_data)

# Commit the transaction
conn.commit()

# Close the cursor and connection
cur.close()
conn.close()

print("Entries have been inserted into each table successfully!")
