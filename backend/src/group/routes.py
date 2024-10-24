import os

from fastapi import Body, status, HTTPException
from pydantic import BaseModel, Field
from typing import List
import uuid
import requests
from bson import ObjectId
from fastapi import APIRouter
from src.group.model import GroupModel, User
from src.group.database import group_collection

from src.group.database import db

from src.group.database import pending_user_collection
from src.group.model import GroupInvite

ROUTE_PREFIX = "/" + os.getenv("EXPENSE_SERVICE_VERSION") + "/groups"
router = APIRouter(prefix=ROUTE_PREFIX, tags=["group-service"])


# Go to sample.json to see example request body
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

    group_dict["users"] = [{"user_id": ObjectId(user["user_id"])} for user in group_dict["users"]]

    new_group = await group_collection.insert_one(group_dict)

    return {"message": "successful", "group_id": str(new_group.inserted_id)}


@router.put(
        "/add_user",
        response_description="Add a User",
        response_model_by_alias=False)
async def add_user_to_group(user: User):
    group = await group_collection.find_one({"_id": ObjectId(user.group_id)})
    if not group:
        raise HTTPException(status_code=404, detail="Group not found.")
    
    # Add user if not already in the list
    if {"user_id": ObjectId(user.user_id)} in group['users']:
        raise HTTPException(status_code=400, detail="User already in the group.")
    
    await group_collection.update_one({"_id": ObjectId(user.group_id)}, {"$push": {"users": {"user_id": ObjectId(user.user_id)}}})
    return {"message": "successful"}


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


@router.get("/get_user/{group_id}",
            response_description="Get Users"
            )
async def get_user_from_group(group_id: str):
    group = await group_collection.find_one({"_id": ObjectId(group_id)})

    if not group:
        raise HTTPException(status_code=404, detail="Group not found.")

    return_group = []

    # Check if group["users"] is a list before iterating
    if isinstance(group.get("users"), list):
        for user in group["users"]:
            # Ensure "user_id" exists in each user dictionary
            if "user_id" in user:
                user_data = await db["users"].find_one({"_id": ObjectId(user["user_id"])})
                if user_data:
                    # Convert ObjectId fields to strings for serialization
                    user_data["_id"] = str(user_data["_id"])

                    # If there are other ObjectId fields in user_data, convert them as well
                    for key, value in user_data.items():
                        if isinstance(value, ObjectId):
                            user_data[key] = str(value)

                    del user_data["password"]

                    return_group.append(user_data)
    else:
        raise HTTPException(status_code=500, detail="Invalid data structure for group users.")

    return {"message": "successful", "data": return_group}


@router.post("/invite")
async def invite_users(group_invite: GroupInvite):
    group = await group_collection.find_one({"_id": ObjectId(group_invite.group_id)})

    if not group:
        raise HTTPException(status_code=404, detail="Group not found.")

    for user_invite in group_invite.user_list:
        email_invite = user_invite.email

        pending_user = {
            "group_id": group["_id"],
            "email": email_invite
        }

        # Insert the object into the collection
        pending_user = await pending_user_collection.insert_one(pending_user)
        inserted_id = pending_user.inserted_id

        payload = {
            "pending_user_id": str(inserted_id),
            "email": email_invite,
            "group_name": group["name"]
        }
        api_url = os.environ.get("EMAIL_SERVER") + "send-invite-link"
        response = requests.post(api_url, json=payload)
        if response.status_code != 200:
            raise RuntimeError(f"Failed to send email: {response.text}")

    return {"message": "successful"}
