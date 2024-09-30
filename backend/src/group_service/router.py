from fastapi import APIRouter
import os
from dotenv import load_dotenv
from .utils import hello_world

load_dotenv()
ROUTE_PREFIX = "/" + os.getenv("GROUP_SERVICE_VERSION") + "/group-service"

router = APIRouter(prefix=ROUTE_PREFIX, tags=["group-service"])


@router.get("/ping", status_code=201)
async def ping() -> dict[str, str]:
    return {"message": "group-service:" + str(os.environ.get("GROUP_SERVICE_VERSION"))}


@router.get("/hello")
async def return_hello_world() -> dict[str, str]:
    return {"message": hello_world()}
