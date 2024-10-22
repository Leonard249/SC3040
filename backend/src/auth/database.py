import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from src.auth.models import User
from email.mime.text import MIMEText
import smtplib
from jose import jwt, JWTError
import asyncpg

load_dotenv()

mongo_connection_url = os.environ.get("MONGO_CONNECTION_URL")
mongo_connection_url = mongo_connection_url.replace("<MONGO_USERNAME>", os.environ.get("MONGO_USERNAME"))
mongo_connection_url = mongo_connection_url.replace("<MONGO_PASSWORD>", os.environ.get("MONGO_PASSWORD"))

print(mongo_connection_url)
mongoClient = AsyncIOMotorClient(mongo_connection_url)
db = mongoClient[os.environ.get("DB_NAME")]
users_collection = db["users"]
blacklisted_tokens = set()
#blacklist_collection = db["blacklist"]


async def get_user_by_email(email: str):
    return await users_collection.find_one({"email": email})

async def create_user(email: str, hashed_password: str):
    user = User(email=email, password=hashed_password, username=email)
    user_cursor = await users_collection.insert_one(user.model_dump())
    return user_cursor.inserted_id

async def fetch_smtp_settings_from_db(email):
    # Extract the domain from the email address
    domain = email.split('@')[-1]
    print(domain)
    # Infer SMTP settings based on the domain
    smtp_settings = infer_smtp_settings(domain)
    
    if smtp_settings:
        return smtp_settings
    
    # If not a common provider, fetch from the database
    conn = await asyncpg.connect(user='your_user', password='your_password',
                                 database='your_database', host='your_host')
    try:
        query = 'SELECT smtp_server, smtp_port, smtp_user, smtp_password FROM smtp_settings WHERE domain = $1 LIMIT 1'
        result = await conn.fetchrow(query, domain)
        if result:
            smtp_settings = {
                'server': result['smtp_server'],
                'port': result['smtp_port'],
                'user': result['smtp_user'],
                'password': result['smtp_password']
            }
            return smtp_settings
        else:
            return None
    finally:
        await conn.close()

def infer_smtp_settings(domain):
    common_smtp_settings = {
        'gmail.com': {'server': 'smtp.gmail.com', 'port': 587, 'user': 'aswebananasplit@gmail.com', 'password': 'kgbm pily jksh yteb'},
        'yahoo.com': {'server': 'smtp.mail.yahoo.com', 'port': 465, 'user': '', 'password': ''},
        'outlook.com': {'server': 'smtp.office365.com', 'port': 587, 'user': '', 'password': ''},
        # Add more common domains and their SMTP settings as needed
    }
    return common_smtp_settings.get(domain)


async def send_reset_email(user_id: str, token: str):
    # Fetch user details from the database
    user = await users_collection.find_one({"_id": user_id})
    if not user:
        raise ValueError("User not found in the database")
    
    email = user["email"]
    
    # Fetch SMTP settings from the database
    smtp_settings = await fetch_smtp_settings_from_db(email)
    if not smtp_settings:
        raise ValueError("SMTP settings not found for the given email domain")
    
    sender_email = smtp_settings["user"]
    sender_password = smtp_settings["password"]
    smtp_server = smtp_settings["server"]
    smtp_port = smtp_settings["port"]
    
    # Create the email message
    message = MIMEText(f"Please use the following token to reset your password: {token}")
    message["Subject"] = "Password Reset Request"
    message["From"] = sender_email
    message["To"] = email
    
    # Send the email
    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, email, message.as_string())
    except Exception as e:
        raise RuntimeError(f"Failed to send email: {e}")

async def update_user_password(email: str, hashed_password: str):
    await users_collection.update_one({"email": email}, {"$set": {"password": hashed_password}})

async def blacklist_token(token: str):
    await blacklist_token.add(token)

async def is_token_blacklisted(token: str) -> bool:
    return token in blacklist_token
