from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import mariadb
import os
from pydantic import BaseModel
import json
from urllib import request
import asyncio

class User(BaseModel):
  email: str
  
class Test(BaseModel):
  code: int

origins = [
    "http://localhost:5173",
    "http://192.168.0.37:5173",
]

COMFYUI_URL = "192.168.0.249:9000"

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

@app.post("/gen")
async def comfyUI(p : str):
  try:  
    # p = "a majestic lion with a crown of stars, photorealistic"
    with open("flow/1.json", "r", encoding="utf-8") as f:
      workflow = json.load(f)
    workflow["6"]["inputs"]["text"] = p
    
    prompt_id = queue_prompt(workflow)
    result = await check_progress(prompt_id)
    
    final_image_url = None
    for node_id, node_output in result['outputs'].items():
      if 'images' in node_output:
        for image in node_output['images']:
          final_image_url = f"http://{COMFYUI_URL}/api/view?filename={image['filename']}&type=output&subfolder="
    
    if final_image_url:
      return {"status": True, "image": final_image_url}
    else:
      return {"status": False, "image": None}
  except HTTPException as e:
    raise e
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))

def queue_prompt(prompt_workflow):
  p = {"prompt": prompt_workflow}
  data = json.dumps(p).encode('utf-8')
  req = request.Request(f"http://{COMFYUI_URL}/prompt", data=data)
  try:
    res = request.urlopen(req)
    if res.code != 200:
      raise Exception(f"Error: {res.code} {res.reason}")
    return json.loads(res.read().decode('utf-8'))['prompt_id']
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))

async def check_progress(prompt_id: str):
  while True:
    try:
      req = request.Request(f"http://{COMFYUI_URL}/history/{prompt_id}")
      res = request.urlopen(req)
      if res.code == 200:
        history = json.loads(res.read().decode('utf-8'))
        if prompt_id in history:
          return history[prompt_id]
    except Exception as e:
      print(f"Error checking progress: {str(e)}")
    await asyncio.sleep(1)
