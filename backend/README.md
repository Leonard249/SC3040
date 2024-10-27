For the backend to be fully operational, you need to run both the main server and the email server.

Creating a new Virtual Environment (terminal should be in backend):

`python -m venv venv`

`cd venv/Scripts`

`activate`

Email server is used for the requirements of Resetting Password, Group Invite

To run email server locally

`cd backend\src\flask_email_service`

`python app.py`

To run server locally (terminal should be in backend):

`uvicorn src.main:ApiClient --reload --host localhost --port 8888`

Check [Swagger](http://localhost:8888/docs) for API documentation.

Run with tox (recommended):

`pip install tox`

`tox`

To import:

`pip install -r requirements.txt`
