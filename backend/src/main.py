import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi import Request
from fastapi.templating import Jinja2Templates
from starlette.responses import HTMLResponse
from starlette.templating import _TemplateResponse
from src.expense_service.router import router as groupRouter
from src.common_service.router import router as commonRouter

load_dotenv()
relative_path = "src/"

ApiClient = FastAPI()
ApiClient.include_router(groupRouter)
ApiClient.include_router(commonRouter)

templates = Jinja2Templates(directory=(relative_path + "templates"))


@ApiClient.get('/', response_class=HTMLResponse)
async def root(request: Request) -> _TemplateResponse:
    return templates.TemplateResponse("index.html", {"request": request})
