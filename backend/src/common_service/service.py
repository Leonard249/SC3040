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

    async def get_user(self, user_id):
        user = await self.user_collection.find_one({"_id": ObjectId(user_id)})

        if not user:
            return None

        return {
            "username": user.get("username", "dummy"),
            "email": user.get("email", "dummy"),
            "phone": user.get("phone", "99999999"),
            "pic_url": user.get("pic_url", "")
        }

    async def update_user(self, user_id, user):
        query = {"_id": ObjectId(user_id)}
        new_values = {"$set": {
            "username": user.username,
            "email": user.email,
            "pic_url": user.pic_url,
            "phone": user.phone
        }}

        try:
            result = await self.user_collection.update_one(query, new_values)

            if result.modified_count >= 0:
                return {"message": "User updated successfully"}
        except Exception as e:
            print(f"Error updating user: {e}")
            return {"error": "An error occurred while updating the user"}
