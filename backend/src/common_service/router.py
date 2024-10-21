from fastapi import APIRouter, HTTPException
import os
from dotenv import load_dotenv

from .pydantic import User
from .service import CommonService
from .utils import hello_world

load_dotenv()
ROUTE_PREFIX = "/" + os.getenv("EXPENSE_SERVICE_VERSION") + "/common"

router = APIRouter(prefix=ROUTE_PREFIX, tags=["common-service"])

common_service = CommonService()


@router.get("/ping", status_code=201)
async def ping() -> dict[str, str]:
    return {"message": "common-service:" + str(os.environ.get("EXPENSE_SERVICE_VERSION"))}


@router.get("/hello")
async def return_hello_world() -> dict[str, str]:
    return {"message": hello_world()}


# Get Expense
@router.get("/users", status_code=200)
async def get_all_users():
    user_result = await common_service.get_all_users()
    if user_result:
        return {"message": "Successfully Retrieve", "data": user_result}
    else:
        return {"message": "No Records Found"}


@router.get("/user/{user_id}",
            response_description="Get user details from user id")
async def get_user(user_id: str):
    user = await common_service.get_user(user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.put("/user/{user_id}",
            response_description="Update user details from user id")
async def update_user(user_id: str, user: User):
    user = await common_service.update_user(user_id, user)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
