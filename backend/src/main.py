import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from starlette.responses import HTMLResponse
from starlette.templating import _TemplateResponse
from src.expense_service.router import router as groupRouter
from src.group.routes import router as createGroupRouter
from src.user_service.router import router as commonRouter
from src.OCR.router import router as ocrRouter
from src.auth.routes import router as authRouter

from fastapi.middleware.cors import CORSMiddleware

from src.get_function.routes import router as getRouter

load_dotenv()
relative_path = "src/"

ApiClient = FastAPI()
ApiClient.include_router(groupRouter)
ApiClient.include_router(createGroupRouter)  
ApiClient.include_router(commonRouter)
ApiClient.include_router(ocrRouter)
ApiClient.include_router(authRouter)
ApiClient.include_router(getRouter)

ApiClient.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],  # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

templates = Jinja2Templates(directory=(relative_path + "templates"))


@ApiClient.get('/', response_class=HTMLResponse)
async def root(request: Request) -> _TemplateResponse:
    return templates.TemplateResponse("index.html", {"request": request})

