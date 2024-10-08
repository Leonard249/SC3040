import os

import pytest
from fastapi.testclient import TestClient
from src.group_service.router import router, ROUTE_PREFIX
from dotenv import load_dotenv

load_dotenv()

client = TestClient(router)
client.base_url = str(client.base_url) + ROUTE_PREFIX


@pytest.fixture
def mock_hello_world():
    yield "Hello World"


def test_ping():
    print(client.base_url)
    response = client.get("ping")
    response_data = response.json()
    assert response.status_code == 201
    assert os.environ.get("GROUP_SERVICE_VERSION") in response_data["message"]


def test_return_hello_world(mock_hello_world):
    response = client.get("hello")
    response_data = response.json()
    assert response.status_code == 200
    assert response_data["message"] in mock_hello_world
