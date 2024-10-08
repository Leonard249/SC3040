# Define the Pydantic models to match the structure of your JSON payload
from pydantic import BaseModel
from typing import List


class Item(BaseModel):
    name: str
    cost: str
    users: List[str]
    settled: bool


class ExpenseGroup(BaseModel):
    group: str
    items: List[Item]
