import os

from fastapi import Body, status, HTTPException
from pydantic import BaseModel, Field
from typing import List
import uuid
from bson import ObjectId
from fastapi import APIRouter
from src.group.model import GroupModel
from src.group.database import group_collection


ROUTE_PREFIX = "/" + os.getenv("EXPENSE_SERVICE_VERSION") + "/groups"
router = APIRouter(prefix=ROUTE_PREFIX, tags=["group-service"])


@router.post(
    "/",
    response_description="Add new group",
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
async def create_group(group: GroupModel = Body(...)):
    """
    Insert a new group record.
    A unique `group_id` will be created and provided in the response.
    """

    # group.users = [ObjectId(user.user_id) for user in group.users]
    group_dict = group.dict(by_alias=True, exclude_none=True)
    group_dict["users"] = [ObjectId(user["user_id"]) for user in group_dict["users"]]

    new_group = await group_collection.insert_one(
        group_dict
    )

    return {"message": "successful", "group_id": str(new_group.inserted_id)}


@router.put(
        "/add_user/{group_id}",
        response_description="Add a User",
        response_model=GroupModel,
        response_model_by_alias=False)
async def add_user_to_group(group_id: str, user: str):
    group = await group_collection.find_one({"_id": ObjectId(group_id)})
    if not group:
        raise HTTPException(status_code=404, detail="Group not found.")
    
    # Add user if not already in the list
    if user in group['users']:
        raise HTTPException(status_code=400, detail="User already in the group.")
    
    await group_collection.update_one({"_id": ObjectId(group_id)}, {"$push": {"users": user}})
    group = await group_collection.find_one({"_id": ObjectId(group_id)})
    return group


@router.put("/remove_user/{group_id}",
        response_description="Remove a User",
        response_model=GroupModel,
         )
async def remove_user_from_group(group_id: str, user: str):
    group = await group_collection.find_one({"_id": ObjectId(group_id)})
    if not group:
        raise HTTPException(status_code=404, detail="Group not found.")
    
    if user not in group['users']:
        raise HTTPException(status_code=400, detail="User not in the group.")
    
    await group_collection.update_one({"_id": ObjectId(group_id)}, {"$pull": {"users": user}})
    group = await group_collection.find_one({"_id": ObjectId(group_id)})

    return group
