import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from starlette.responses import HTMLResponse
from starlette.templating import _TemplateResponse
from src.expense_service.router import router as groupRouter
from src.group.routes import router as createGroupRouter
from src.common_service.router import router as commonRouter
from src.OCR.router import router as ocrRouter
from src.auth.routes import router as authRouter
from src.get_function.routes import router as getRouter
load_dotenv()
relative_path = "src/"

ApiClient = FastAPI()
ApiClient.include_router(groupRouter)
ApiClient.include_router(createGroupRouter)  # Include the auth router
ApiClient.include_router(commonRouter)
ApiClient.include_router(ocrRouter)
ApiClient.include_router(authRouter)
ApiClient.include_router(getRouter)

templates = Jinja2Templates(directory=(relative_path + "templates"))


@ApiClient.get('/', response_class=HTMLResponse)
async def root(request: Request) -> _TemplateResponse:
    return templates.TemplateResponse("index.html", {"request": request})

