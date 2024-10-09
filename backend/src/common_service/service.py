from bson import ObjectId
from fastapi import HTTPException

from .db import db


# TODO: Raise Error in API Layer
class CommonService:
    def __init__(self):
        self.user_collection = db["users"]

    async def get_all_users(self):
        user_cursor = self.user_collection.find()
        matching_users = await user_cursor.to_list(length=None)

        for user in matching_users:
            if "_id" in user:
                user["_id"] = str(user["_id"])
                del user["password"]

        # Print and return the list of users
        return matching_users
