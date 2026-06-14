from fastapi import FastAPI
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

# SPRING BOOT URL

SPRING_URL = "http://localhost:2007"

# -----------------------------------
# AUTH APIs
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
# COURSE APIs
# -----------------------------------

@app.get("/courses")
def get_courses():

    response = requests.get(
        f"{SPRING_URL}/courses"
    )

    return response.json()


@app.post("/courses")
def add_course(data: dict):

    response = requests.post(
        f"{SPRING_URL}/courses",
        json=data
    )

    return response.json()


@app.put("/courses/{id}")
def update_course(id: int, data: dict):

    response = requests.put(
        f"{SPRING_URL}/courses/{id}",
        json=data
    )

    return response.json()


@app.delete("/courses/{id}")
def delete_course(id: int):

    response = requests.delete(
        f"{SPRING_URL}/courses/{id}"
    )

    return response.text