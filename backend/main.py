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
    "http://localhost:5173",
    "http://192.168.0.37:5173",
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

@app.post("/board")
def signup():
  conn = mariadb.connect(**conn_params)
  cur = conn.cursor()
  sql = '''
        SELECT b.no, b.prompt, b.fileNo AS boardFileNo, u.`name`, u.no, u.fileNo AS userFileNo,
            b.modDate
        FROM pixel.`board` AS b 
      INNER JOIN auth.`user` AS u
          ON (b.regUserNo = u.no AND u.useYn = 'Y') 
      WHERE b.useYn = 'Y'
      ORDER BY 1 desc
      LIMIT 5
  '''
  cur.execute(sql)
  columns = [desc[0] for desc in cur.description]
  rows = cur.fetchall()
  result = [dict(zip(columns, row)) for row in rows]
  cur.close()
  conn.close()
  if result:
    return {
      "status": True,
      "result" : result
    }
  else :
    return {
      "status": False
    }
    
@app.post("/board/{no}")
def signup(no: int):
  conn = mariadb.connect(**conn_params)
  cur = conn.cursor()
  sql = f'''
        SELECT b.no, b.prompt, b.fileNo AS boardFileNo, u.`name`, u.no, u.fileNo AS userFileNo,
            b.modDate
        FROM pixel.`board` AS b 
      INNER JOIN auth.`user` AS u
          ON (b.regUserNo = u.no AND u.useYn = 'Y') 
      WHERE b.useYn = 'Y'
        AND b.regUserNo = {no}
      ORDER BY 1 desc
  '''
  cur.execute(sql)
  columns = [desc[0] for desc in cur.description]
  rows = cur.fetchall()
  result = [dict(zip(columns, row)) for row in rows]
  cur.close()
  conn.close()
  if result:
    return {
      "status": True,
      "result" : result
    }
  else :
    return {
      "status": False
    }
    
@app.post("/subsribe/{no}")
def signup(no: int):
  conn = mariadb.connect(**conn_params)
  cur = conn.cursor()
  sql = f'''
        SELECT u.no, u.name, u.fileNo
          FROM pixel.`subscribe` AS s
        INNER JOIN auth.`user` AS u
            ON (s.userNo = u.no AND u.useYn = 'Y')
          WHERE s.useYn = 'Y'
          AND s.regUserNo = {no}
        ORDER BY 1 DESC
  '''
  cur.execute(sql)
  columns = [desc[0] for desc in cur.description]
  rows = cur.fetchall()
  result = [dict(zip(columns, row)) for row in rows]
  cur.close()
  conn.close()
  if result:
    return {
      "status": True,
      "result" : result
    }
  else :
    return {
      "status": False
    }
    
@app.post("/info/{no}")
def signup(no: int):
  conn = mariadb.connect(**conn_params)
  cur = conn.cursor()
  sql = f'''
        SELECT u.no, u.name, u.fileNo, COUNT(s.no) AS subscribeCount
          FROM auth.`user` u
          LEFT JOIN pixel.`subscribe` s
            ON s.regUserNo = u.no AND s.useYn = 'Y'
        WHERE u.useYn = 'Y'
          AND u.no = {no}
        GROUP BY u.no, u.name, u.fileNo
  '''
  cur.execute(sql)
  columns = [desc[0] for desc in cur.description]
  row = cur.fetchone()
  result = dict(zip(columns, row)) if row else None
  cur.close()
  conn.close()
  if result:
    return {
      "status": True,
      "result" : result
    }
  else :
    return {
      "status": False
    }
