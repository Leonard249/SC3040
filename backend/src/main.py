import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from starlette.responses import HTMLResponse
from starlette.templating import _TemplateResponse
from src.expense_service.router import router as groupRouter
from src.auth.routes import router as auth_router 
from src.group.routes import router as createGroupRouter
load_dotenv()
relative_path = "src/"

ApiClient = FastAPI()
ApiClient.include_router(groupRouter)
ApiClient.include_router(auth_router, prefix="/auth")  # Include the auth router
ApiClient.include_router(createGroupRouter)  # Include the auth router

templates = Jinja2Templates(directory=(relative_path + "templates"))

@ApiClient.get('/', response_class=HTMLResponse)
async def root(request: Request) -> _TemplateResponse:
    return templates.TemplateResponse("index.html", {"request": request})

