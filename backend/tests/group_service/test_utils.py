import pytest
from src.group_service import utils


@pytest.fixture
def mock_hello_world_return() -> str:
    yield "Hello World"


def test_hello_world(mock_hello_world_return):
    assert utils.hello_world() == mock_hello_world_return
