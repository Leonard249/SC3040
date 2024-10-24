from fastapi import APIRouter, HTTPException
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List
from .EasyOCR import EasyOCRReader

load_dotenv()
ROUTE_PREFIX = "/" + os.getenv("EXPENSE_SERVICE_VERSION") + "/ocr"

router = APIRouter(prefix=ROUTE_PREFIX, tags=["ocr-service"])

ocr_service = EasyOCRReader()


@router.get("/ping", status_code=201)
async def ping() -> dict[str, str]:
    return {"message": "ocr-service:" + str(os.environ.get("EXPENSE_SERVICE_VERSION"))}


class ImageRequest(BaseModel):
    groupid: str
    images: List[str]



# Get Expense
@router.post("/scan", status_code=200)
async def get_items_scan(request: ImageRequest):
    try:
        encoded_image = request.image

        result = ocr_service.get_output(encoded_image)

        if result:
            return {"message": "Successfully Retrieve", "data": result}
        else:
            return {"message": "Scan Failed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the image: {str(e)}")
