from bson import ObjectId
from fastapi import HTTPException

from .db import db


# TODO: Raise Error in API Layer
class ExpenseService:
    def __init__(self):
        self.expense_collection = db["expense"]

    async def create_expenses(self, group_name, items):
        expense = {
          "group": group_name,
          "items": items
        }
        try:
            insert_result = await self.expense_collection.insert_one(expense)
            print(f"Group inserted with ID: {insert_result.inserted_id}")
            return insert_result
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

    async def get_expense(self, group_name):
        try:
            documents = await self.expense_collection.find({"group": group_name}).to_list(length=None)
            if documents:
                for document in documents:
                    if "_id" in document and isinstance(document["_id"], ObjectId):
                        document["_id"] = str(document["_id"])
                return documents
            else:
                return None
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

    async def get_all_expense(self, user_id):
        group_collection = db['groups']
        user_collection = db['users']

        # Step 1: Retrieve data from collections
        groups_cursor = group_collection.find({
            "users": {
                "$elemMatch": {
                    "user_id": ObjectId(user_id)
                }
            }
        })
        groups = await groups_cursor.to_list(length=None)

        user_ids = []

        for group in groups:
            for user in group['users']:
                user_ids.append(user['user_id'])

        user_ids = [ObjectId(uid) for uid in user_ids]

        user_cursor = user_collection.find({'_id': {'$in': user_ids}})
        matching_users = await user_cursor.to_list(length=None)

        # Step 4: Retrieve all expenses
        expense_cursor = self.expense_collection.find()
        expenses = await expense_cursor.to_list(length=None)

        # Step 5: Create a mapping from user ID to their expenses
        user_expense_map = {str(user['_id']): [] for user in matching_users}
        for expense in expenses:
            user_id_str = str(expense['user_id'])  # Convert ObjectId to string for comparison
            user = await user_collection.find_one({"_id": expense['paid_by']})
            paid_by_username = user.get("username")
            if user_id_str in user_expense_map:
                user_expense_map[user_id_str].append({
                    "id": str(expense.get('_id')),
                    "item": expense.get('item'),
                    "amount": expense.get('amount'),
                    "paid_by": paid_by_username
                })

        # Step 6: Construct the final structure to match the desired JSON format
        final_structure = {
            "groups": []
        }

        # Iterate through the groups to create the structure
        for group in groups:
            for user in group['users']:
                user_id_str = str(user['user_id'])

                # Find matching user details
                user_details = next((u for u in matching_users if str(u['_id']) == user_id_str), None)

                if user_details:
                    member_name = user_details.get('username', 'Default')

                    # Check if this user already has a group entry in the final structure
                    group_entry = next((g for g in final_structure['groups'] if g.get('user_id') == user_id_str), None)

                    if not group_entry:
                        # Create a new group entry for this user if it doesn't exist
                        group_entry = {
                            "user_id": user_id_str,
                            "memberName": member_name,
                            "items": []
                        }
                        final_structure['groups'].append(group_entry)

                    # Add user-specific items to the user's group entry
                    group_entry["items"].extend(user_expense_map.get(user_id_str, []))

        # Print or return the final structure
        return final_structure
