# PhishGuard AI Backend

## Setup Instructions
1. Install dependencies: `pip install -r requirements.txt`
2. Run database migrations: `alembic upgrade head` (if using alembic)
3. Run the application: `uvicorn app.main:app --reload`
4. Access API docs at: `http://localhost:8000/docs`
