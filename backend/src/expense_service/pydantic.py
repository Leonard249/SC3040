# Define the Pydantic models to match the structure of your JSON payload
from pydantic import BaseModel
from typing import List, Optional


class Item(BaseModel):
    name: str
    cost: float
    user_id: str
    paid_by: str


class ExpenseGroup(BaseModel):
    group: str
    items: List[Item] = []


class ItemUpdate(BaseModel):
    item: str
    amount: float
    id: str
    paid_by: str


class User(BaseModel):
    user_id: str
    memberName: str
    items: List[ItemUpdate] = []


class ExpenseUpdate(BaseModel):
    group_id: str
    group_name: str
    users: List[User] = []

class ExpenseUpdateCurrent(BaseModel):
    currentGroup: ExpenseUpdate
