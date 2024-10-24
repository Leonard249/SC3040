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

    async def add_user_to_group(self, pending_user_id, user_id, user_email):
        pending_user = await self.pending_user_collection.find_one({"_id": ObjectId(pending_user_id)})
        if not pending_user:
            return
        if 'email' not in pending_user or pending_user['email'] != user_email:
            print(f"Wrong Pending Credentials")
            return None

        group_id = pending_user["group_id"]

        try:
            existing_user = await self.group_collection.find_one(
                {
                    "_id": ObjectId(group_id),
                    "users": {
                        "$elemMatch": {
                            "user_id": ObjectId(user_id)
                        }
                    }
                }
            )

            if existing_user:
                print(f"User with ID {user_id} is already in the group.")
                return None

            result = await self.group_collection.update_one(
                {"_id": ObjectId(group_id)},
                {
                    "$push": {
                        "users": {
                            "user_id": ObjectId(user_id)
                        }
                    }
                }
            )
            if pending_user:
                await self.pending_user_collection.delete_one({"_id": ObjectId(pending_user_id)})

            if result.modified_count > 0:
                return await self.group_collection.find_one({"_id": ObjectId(group_id)})
            else:
                print("Group not found or no changes made.")
                return None

        except Exception as e:
            print(f"An error occurred: {e}")
            return None
