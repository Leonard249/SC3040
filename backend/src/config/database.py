import motor.motor_asyncio
import os
from pymongo import ReturnDocument

client = motor.motor_asyncio.AsyncIOMotorClient("mongodb+srv://joelleepx:zRy1JrUHKaoCkFtl@cluster0.whr41.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client.get_database("ASWE")
group_collection = db.get_collection("groups")


# Create a new client and connect to the server
