import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from src.auth.models import User
from email.mime.text import MIMEText
import smtplib
from jose import jwt, JWTError

load_dotenv()

mongo_connection_url = os.environ.get("MONGO_CONNECTION_URL")
mongo_connection_url = mongo_connection_url.replace("<MONGO_USERNAME>", os.environ.get("MONGO_USERNAME"))
mongo_connection_url = mongo_connection_url.replace("<MONGO_PASSWORD>", os.environ.get("MONGO_PASSWORD"))

print(mongo_connection_url)
mongoClient = AsyncIOMotorClient(mongo_connection_url)
db = mongoClient[os.environ.get("DB_NAME")]
users_collection = db["users"]

# In-memory token blacklist (for demonstration purposes)
token_blacklist = set()

async def get_user_by_email(email: str):
    return await users_collection.find_one({"email": email})

async def create_user(email: str, hashed_password: str):
    user = User(email=email, password=hashed_password, username=email)
    user_cursor = await users_collection.insert_one(user.model_dump())
    return user_cursor.inserted_id

async def fetch_smtp_settings_from_db():
    config_collection = db["sc3040"]
    smtp_settings = await config_collection.find_one({"type": "smtp_settings"})
    if not smtp_settings:
        raise ValueError("SMTP settings not found in the database")
    return {
        "sender_email": smtp_settings["sender_email"],
        "sender_password": smtp_settings["sender_password"],
        "smtp_server": smtp_settings["smtp_server"],
        "smtp_port": smtp_settings["smtp_port"]
    }

async def send_reset_email(user_id: str, token: str):
    user = await users_collection.find_one({"_id": user_id})
    if not user:
        raise ValueError("User not found in the database")
    email = user["email"]
    smtp_settings = await fetch_smtp_settings_from_db()
    sender_email = smtp_settings["sender_email"]
    sender_password = smtp_settings["sender_password"]
    smtp_server = smtp_settings["smtp_server"]
    smtp_port = smtp_settings["smtp_port"]
    message = MIMEText(f"Please use the following token to reset your password: {token}")
    message["Subject"] = "Password Reset Request"
    message["From"] = sender_email
    message["To"] = email
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, email, message.as_string())

async def update_user_password(email: str, hashed_password: str):
    await users_collection.update_one({"email": email}, {"$set": {"password": hashed_password}})

def is_token_blacklisted(token: str) -> bool:
    return token in token_blacklist
