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
