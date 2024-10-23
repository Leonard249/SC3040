import os

from fastapi import Body, status, HTTPException
from pydantic import BaseModel, Field
from typing import List
from bson import ObjectId
from fastapi import APIRouter
from src.group.database import group_collection
from src.auth.database import get_user_by_email_or_username, users_collection

ROUTE_PREFIX = "/" + os.getenv("EXPENSE_SERVICE_VERSION") + "/get"
router = APIRouter(prefix=ROUTE_PREFIX, tags=["get-service"])

@router.get("/get-group-name/{group_id}",
response_description="Get group name",)
async def get_group_name(group_id: str):
    try:
        # Convert group_id to ObjectId if it's a valid one
        object_id = ObjectId(group_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid group ID format")

    # Find the group with the given group_id
    group = await group_collection.find_one({"_id": object_id})
    
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    return {"group_name": group['name']}


@router.get("/get-group-id/{group_name}",
response_description="Get group id",)
async def get_group_id(group_name: str):
    # Find the group with the given group_name
    group = await group_collection.find_one({"name": group_name})
    
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    return {"group_id": str(group["_id"])}

@router.get("/get-username-from-id/{user_id}",
             response_description="Get username and email from user id",)
async def get_user_id(user_id: str):
    # Find the group with the given group_name
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"username": user["username"], 
            "email":user["email"]}



@router.get("/get-user-id-from-username/{username}",
             response_description="Get user ID from username",)
async def get_user_id_from_username(username: str):
    # Find the user with the given username
    user = await users_collection.find_one({"username": username})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"user_id": str(user["_id"])}


@router.get("/get-user-id-from-email/{email}",
             response_description="Get user ID from email",)
async def get_user_id_from_email(email: str):
    # Find the user with the given email
    user = await users_collection.find_one({"email": email})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"user_id": str(user["_id"])}