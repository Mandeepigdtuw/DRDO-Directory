# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, search, admin, analytics
from routes.auth import init_admin

app = FastAPI(title="DRDO Directory API", version="1.0.0")

# Allow frontend (React on port 3000) to talk to backend (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all route groups
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(search.router, prefix="/search", tags=["Search"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(analytics.router, prefix="/admin/analytics", tags=["Analytics"])

# Create admin account on startup if it doesn't exist
@app.on_event("startup")
def startup_event():
    init_admin()
    print("✅ DRDO Directory API is running")

@app.get("/")
def root():
    return {"message": "DRDO Directory API is live"}