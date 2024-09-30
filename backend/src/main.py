from fastapi import FastAPI
from fastapi import Request
from fastapi.templating import Jinja2Templates
from starlette.responses import HTMLResponse
from starlette.templating import _TemplateResponse
from src.group_service.router import router as groupRouter

relative_path = "src/"

ApiClient = FastAPI()
ApiClient.include_router(groupRouter)

templates = Jinja2Templates(directory=(relative_path + "templates"))


@ApiClient.get('/', response_class=HTMLResponse)
async def root(request: Request) -> _TemplateResponse:
    return templates.TemplateResponse("index.html", {"request": request})
