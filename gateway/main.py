from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# CORS CONFIGURATION

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# BACKEND URLS
SPRING_URL = "http://localhost:2007"
NODE_URL = "http://localhost:5001"

# Helper to forward Authorization header
def get_headers(request: Request):
    headers = {}
    if "authorization" in request.headers:
        headers["Authorization"] = request.headers["authorization"]
    return headers

# -----------------------------------
# AUTH APIs (Spring Boot)
# -----------------------------------

@app.post("/auth/login")
def login(data: dict):

    response = requests.post(
        f"{SPRING_URL}/auth/login",
        json=data
    )

    return response.json()


@app.post("/auth/register")
def register(data: dict):

    response = requests.post(
        f"{SPRING_URL}/auth/register",
        json=data
    )

    return response.json()

# -----------------------------------
# COURSE APIs (Spring Boot)
# -----------------------------------

@app.get("/courses")
def get_courses(request: Request):

    response = requests.get(
        f"{SPRING_URL}/courses",
        headers=get_headers(request)
    )

    return response.json()


@app.post("/courses")
def add_course(data: dict, request: Request):

    response = requests.post(
        f"{SPRING_URL}/courses",
        json=data,
        headers=get_headers(request)
    )

    return response.json()


@app.put("/courses/{id}")
def update_course(id: int, data: dict, request: Request):

    response = requests.put(
        f"{SPRING_URL}/courses/{id}",
        json=data,
        headers=get_headers(request)
    )

    return response.json()


@app.delete("/courses/{id}")
def delete_course(id: int, request: Request):

    response = requests.delete(
        f"{SPRING_URL}/courses/{id}",
        headers=get_headers(request)
    )

    return response.text

# -----------------------------------
# DETAILED PROGRESS / STUDY LOG APIs (Node.js & MongoDB)
# -----------------------------------

@app.get("/api/progress")
def get_progress(request: Request):
    response = requests.get(
        f"{NODE_URL}/api/progress",
        headers=get_headers(request)
    )
    return response.json()


@app.post("/api/progress")
def add_progress(data: dict, request: Request):
    response = requests.post(
        f"{NODE_URL}/api/progress",
        json=data,
        headers=get_headers(request)
    )
    return response.json()


@app.put("/api/progress/{id}")
def update_progress(id: str, data: dict, request: Request):
    response = requests.put(
        f"{NODE_URL}/api/progress/{id}",
        json=data,
        headers=get_headers(request)
    )
    return response.json()


@app.delete("/api/progress/{id}")
def delete_progress(id: str, request: Request):
    response = requests.delete(
        f"{NODE_URL}/api/progress/{id}",
        headers=get_headers(request)
    )
    return response.json()