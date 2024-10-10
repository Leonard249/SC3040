# Define the Pydantic models to match the structure of your JSON payload
from pydantic import BaseModel
from typing import List


class Item(BaseModel):
    name: str
    cost: float
    user_id: str
    paid_by: str


class ExpenseGroup(BaseModel):
    group: str
    items: List[Item]
