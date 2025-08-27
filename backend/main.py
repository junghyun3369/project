from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import mariadb
import os
from pydantic import BaseModel

class User(BaseModel):
  email: str
  
class Test(BaseModel):
  code: int

origins = [
    "http://localhost:5173"
]

testCode = 123456

conn_params = {
  "user" : os.getenv('MARIADB_USER'),
  "password" : os.getenv('MARIADB_PASSWORD'),
  "host" : os.getenv('MARIADB_HOST'),
  "database" : "auth",
  "port" : int(os.getenv('MARIADB_PORT'))
}

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
  return {"status": 1}

@app.post("/user")
def signup(user: User):
  print(f"signup : {user.email}")
  conn = mariadb.connect(**conn_params)
  cur = conn.cursor()
  sql = f"SELECT email FROM user WHERE email = '{user.email}'"
  cur.execute(sql)
  result = cur.fetchone()
  cur.close()
  conn.close()
  if result:
    return {
      "status": True,
      "code" : testCode
    }
  else :
    return {
      "status": False
    }
  
@app.post("/code")
def code(test : Test):
  print(f"code : {test.code}, {testCode}")
  if testCode == test.code :  
    return {
      "status": True
    }
  else :
    return {
      "status": False
    }
