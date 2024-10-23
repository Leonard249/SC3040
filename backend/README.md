Creating a new Virtual Environment (terminal should be in backend):

`python -m venv venv`

`cd venv/Scripts`

`activate`
To run email server locally

To run server locally (terminal should be in backend):

`uvicorn src.main:ApiClient --reload --host localhost --port 8888`

Check [Swagger](http://localhost:8888/docs) for API documentation.

Run with tox (recommended):

`pip install tox`

`tox`

To import:

`pip install -r requirements.txt`

To run individual tests:

`pytest {file to tests, from tests/}`
