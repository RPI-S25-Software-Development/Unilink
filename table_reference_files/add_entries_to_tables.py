import psycopg2
import uuid
import random
from datetime import datetime, timedelta
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

# Generate Universities
universities = ["Rensselaer Polytechnic Institute", "Hudson Valley Community College", "Union College"]
for university in universities:
    university_id = str(uuid.uuid4())
    insert_query = """
        INSERT INTO unilink.universities (university_id, university_name)
        VALUES (%s, %s);
    """
    cur.execute(insert_query, (university_id, university))

# Generate Tags
tags = ["Club Fair", "Career Fair", "Basketball", "Swim"]
classifications = ["Club Event", "University Event", "Club Event", "University Event"]
for i in range(len(tags)):
    tag_id = str(uuid.uuid4())
    tag = tags[i]
    classification = classifications[i]
    color = "#{:06x}".format(random.randint(0, 0xFFFFFF))
    insert_query = """
        INSERT INTO unilink.tags (tag_id, tag_name, classification, color)
        VALUES (%s, %s, %s, %s);
    """
    cur.execute(insert_query, (tag_id, tag, classification, color))

cur.execute("SELECT university_id FROM unilink.universities")
university_ids = [row[0] for row in cur.fetchall()]

# Function to generate random data for users
def generate_random_user(i):
    user_id = str(uuid.uuid4())
    user_name = f'student{i}'
    user_type = 'student'
    university_id = random.choice(university_ids)
    login_type = random.choice(('university_sso', 'custom'))
    rec_frequency = random.choice(('daily', 'weekly', 'none'))
    notif_freq  = random.choice((True,False))
    created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    return (user_id, user_name, user_type, university_id, login_type, rec_frequency, notif_freq, created_at)

# Insert 30 Users
for i in range(1, 31):
    user_data = generate_random_user(i)
    insert_query = """
        INSERT INTO unilink.users (user_id, user_name, user_type, university_id, login_type, rec_frequency, notifications, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
    """
    cur.execute(insert_query, user_data)

cur.execute("SELECT tag_id FROM unilink.tags")
tag_ids = [row[0] for row in cur.fetchall()]
cur.execute("SELECT user_id FROM unilink.users")
user_ids = [row[0] for row in cur.fetchall()]

# generate user tags
for user_id in user_ids:
    num_tags = random.choice((1,2,3,4))
    for i in range(num_tags):
        user_tag_id = str(uuid.uuid4())
        tag_id = tag_ids[i]
        insert_query = """
            INSERT INTO unilink.user_tags (user_tag_id, user_id, tag_id)
            VALUES (%s, %s, %s);
        """
        cur.execute(insert_query, (user_tag_id, user_id, tag_id))

# generate organizations
for i in range(20):
    org_id = str(uuid.uuid4())
    org_name = f'org{i}'
    org_bio = 'Description, social media links, etc.'
    org_address = 'Somewhere in the universe (maybe)'
    university_id = random.choice(university_ids)
    insert_query = """
        INSERT INTO unilink.organizations (organization_id, organization_name, organization_bio, organization_address, university_id)
        VALUES (%s, %s, %s, %s, %s);
    """
    cur.execute(insert_query, (org_id, org_name, org_bio, org_address, university_id))

cur.execute("SELECT organization_id FROM unilink.organizations")
org_ids = [row[0] for row in cur.fetchall()]

# Function to generate random event data
def generate_random_event(i, org_id):
    event_id = str(uuid.uuid4())
    title = f"Event {i}"
    description = f"Description of Event {i}"
    poster_path = f"./poster{i}.jpg"
    location = f"Location {i}"
    event_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    max_attendees = random.randint(10, 200)
    expiration_date = (datetime.now() + timedelta(weeks=1)).strftime('%Y-%m-%d %H:%M:%S')
    
    return (event_id, title, description, poster_path, location, event_time, org_id, max_attendees, expiration_date)

# Insert 30 Events
for i in range(1, len(org_ids)):
    event_data = generate_random_event(i, org_ids[i-1])
    insert_query = """
        INSERT INTO unilink.events (event_id, title, event_description, poster_path, event_location, event_time, organization_id, max_attendees, expiration_date)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
    """
    cur.execute(insert_query, event_data)

cur.execute("SELECT event_id FROM unilink.events LIMIT 30")
event_ids = [row[0] for row in cur.fetchall()]

# generate event tags
for event_id in event_ids:
    num_tags = random.choice((1,2,3,4))
    for i in range(num_tags):
        event_tag_id = str(uuid.uuid4())
        tag_id = tag_ids[i]
        insert_query = """
            INSERT INTO unilink.event_tags (event_tag_id, event_id, tag_id)
            VALUES (%s, %s, %s);
        """
        cur.execute(insert_query, (event_tag_id, event_id, tag_id))

# Function to generate random notifications
def generate_random_notification(user_id, event_id):
    notification_id = str(uuid.uuid4())
    notification_type = random.choice(['trending_event', 'new_event_from_followed_poster', 'daily_reminder', 'event_starting_soon'])
    message = f"Notification for {notification_type}"
    sent_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    return (notification_id, user_id, event_id, notification_type, message, sent_at)

# Insert 50 Notifications
for i in range(50):
    user_id = random.choice(user_ids)
    event_id = random.choice(event_ids)
    notification_data = generate_random_notification(user_id, event_id)
    insert_query = """
        INSERT INTO unilink.notifications (notification_id, user_id, event_id, notification_type, message, sent_at)
        VALUES (%s, %s, %s, %s, %s, %s);
    """
    cur.execute(insert_query, notification_data)

# Insert 50 likes
for i in range(50):
    like_id = str(uuid.uuid4())
    user_id = random.choice(user_ids)
    event_id = random.choice(event_ids)
    still_valid = random.choice((True,True,True,True,False))
    insert_query = """
        INSERT INTO unilink.likes (like_id, user_id, event_id, still_valid)
        VALUES (%s, %s, %s, %s);
    """
    cur.execute(insert_query, (like_id, user_id, event_id, still_valid))

# Insert 50 rsvps
for i in range(50):
    rsvp_id = str(uuid.uuid4())
    user_id = random.choice(user_ids)
    event_id = random.choice(event_ids)
    still_valid = random.choice((True,True,True,True,False))
    insert_query = """
        INSERT INTO unilink.rsvps (rsvp_id, user_id, event_id, still_valid)
        VALUES (%s, %s, %s, %s);
    """
    cur.execute(insert_query, (rsvp_id, user_id, event_id, still_valid))

# Commit the transaction
conn.commit()

# Close the cursor and connection
cur.close()
conn.close()

print("Entries have been inserted into each table successfully!")
