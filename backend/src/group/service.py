from bson import ObjectId
from src.group.database import db


class GroupService:
    def __init__(self):
        self.group_collection = db["groups"]

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
