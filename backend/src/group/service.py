from bson import ObjectId
from src.group.database import db


class GroupService:
    def __init__(self):
        self.group_collection = db["groups"]
        self.pending_user_collection = db["pending user"]

    async def create_group_with_owner(self, group_name, owner_id):
        try:
            group_doc = {
                "name": group_name,
                "users": [
                    {
                        "user_id": ObjectId(owner_id)
                    }
                ]
            }

            result = await self.group_collection.insert_one(group_doc)
            return result.inserted_id

        except Exception as e:
            print(f"An error occurred: {e}")
            return None

    async def add_user_to_group(self, pending_user_id, user_id):
        pending_user = await self.pending_user_collection.find_one({"_id": ObjectId(pending_user_id)})
        group_id = pending_user["group_id"]

        try:
            existing_user = await self.group_collection.find_one(
                {
                    "_id": ObjectId(group_id),  # Match the group by its ObjectId
                    "users": {
                        "$elemMatch": {  # Check if the user already exists
                            "user_id": ObjectId(user_id)
                        }
                    }
                }
            )

            if existing_user:
                print(f"User with ID {user_id} is already in the group.")
                return None

            # If the user is not found, proceed to add them
            result = await self.group_collection.update_one(
                {"_id": ObjectId(group_id)},  # Match the group by its ObjectId
                {
                    "$push": {  # Use the $push operator to add the new user to the array
                        "users": {
                            "user_id": ObjectId(user_id)
                        }
                    }
                }
            )
            if pending_user:
                await self.pending_user_collection.delete_one({"_id": pending_user})

            if result.modified_count > 0:
                return await self.group_collection.find_one({"_id": ObjectId(group_id)})
            else:
                print("Group not found or no changes made.")
                return None

        except Exception as e:
            print(f"An error occurred: {e}")
            return None
