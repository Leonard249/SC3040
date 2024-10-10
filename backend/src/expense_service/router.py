from fastapi import APIRouter, HTTPException
import os
from dotenv import load_dotenv

from .pydantic import ExpenseGroup
from .service import ExpenseService
from .utils import hello_world

load_dotenv()
ROUTE_PREFIX = "/" + os.getenv("EXPENSE_SERVICE_VERSION") + "/expense"

router = APIRouter(prefix=ROUTE_PREFIX, tags=["expense-service"])

expense_service = ExpenseService()


@router.get("/ping", status_code=201)
async def ping() -> dict[str, str]:
    return {"message": "expense-service:" + str(os.environ.get("EXPENSE_SERVICE_VERSION"))}


@router.get("/hello")
async def return_hello_world() -> dict[str, str]:
    return {"message": hello_world()}


# TODO: group_id instead of group_name
# Create Expense
@router.post("/", status_code=200)
async def create_expense(expense_group: ExpenseGroup):
    group_id = expense_group.group
    items = [item.dict() for item in expense_group.items]

    insert_result = await expense_service.create_expenses(group_id, items)
    if insert_result:
        return {"message": "Successfully Updated"}
    else:
        return {"message": "Failed"}


# Get Expense
@router.get("/{group_id}", status_code=200)
async def get_expense(group_id: str):
    expense_result = await expense_service.get_expense(group_id)
    if expense_result:
        return {"message": "Successfully Retrieve", "data": expense_result}
    else:
        return {"message": "No Records Found"}


# Get ALL Expense
@router.get("/all/{user_id}", status_code=200)
async def get_all_expenses(user_id: str):
    all_expense_result = await expense_service.get_all_expense(user_id)
    if all_expense_result:
        return {"message": "Successfully Retrieve", "data": all_expense_result}
    else:
        return {"message": "No Records Found"}
