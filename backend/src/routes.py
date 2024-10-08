from fastapi import Body, status, HTTPException
from pydantic import BaseModel, Field
from typing import List
import uuid
from bson import ObjectId
from fastapi import APIRouter
from backend.src.models.groups import GroupModel
from backend.src.config.database import group_collection


router = APIRouter()
@router.post(
    "/groups/",
    response_description="Add new group",
    response_model=GroupModel,
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
async def create_group(group: GroupModel = Body(...)):
    """
    Insert a new group record.
    A unique `group_id` will be created and provided in the response.
    """

    # Insert the group into the database, excluding the 'id' (MongoDB will generate it)
    new_group = await group_collection.insert_one(
        group.model_dump(by_alias=True, exclude=["id"])
    )

    # Fetch the newly created group from the database
    created_group = await group_collection.find_one({"_id": new_group.inserted_id})

    return created_group

@router.put(
        "/groups/{group_id}/add_user/",
        response_description="Add a User",
        response_model=GroupModel,
        response_model_by_alias=False)

async def add_user_to_group(group_id: str, user: int):
    group = await group_collection.find_one({"_id": ObjectId(group_id)})
    if not group:
        raise HTTPException(status_code=404, detail="Group not found.")
    
    # Add user if not already in the list
    if user in group['users']:
        raise HTTPException(status_code=400, detail="User already in the group.")
    
    await group_collection.update_one({"_id": ObjectId(group_id)}, {"$push": {"users": user}})
    group = await group_collection.find_one({"_id": ObjectId(group_id)})
    return group

@router.put("/groups/{group_id}/remove_user/",
        response_description="Remove a User",
        response_model=GroupModel,
         )

async def remove_user_from_group(group_id: str, user: int):
    group = await group_collection.find_one({"_id": ObjectId(group_id)})
    if not group:
        raise HTTPException(status_code=404, detail="Group not found.")
    
    if user not in group['users']:
        raise HTTPException(status_code=400, detail="User not in the group.")
    
    await group_collection.update_one({"_id": ObjectId(group_id)}, {"$pull": {"users": user}})
    group = await group_collection.find_one({"_id": ObjectId(group_id)})

    return group