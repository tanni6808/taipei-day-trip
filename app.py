from fastapi import *
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Annotated, Optional
import mysql.connector
import mysql.connector.pooling
from collections import Counter
import jwt
from datetime import datetime, timedelta

dbconfig = {
	'user': 'root',
	'password': '123456',
	'host': 'localhost',
	'database': 'taipei_day_trip'
}

mydbpool=mysql.connector.pooling.MySQLConnectionPool(
	pool_name='mypool', 
	pool_size=10,
	**dbconfig
)

app=FastAPI()

class SignUpData(BaseModel):
	name: str
	email: str
	password: str

class SignInData(BaseModel):
	email: str
	password: str

class Attraction(BaseModel):
	id: int
	name: str
	category: str
	description: str
	address: str
	transport: str
	mrt: str
	lat: float
	lng: float
	images: list[str]

class Error(BaseModel):
	error: bool
	message: str

# Static Pages (Never Modify Code in this Block)
@app.get("/", include_in_schema=False)
async def index(request: Request):
	return FileResponse("./static/index.html", media_type="text/html")
@app.get("/attraction/{id}", include_in_schema=False)
async def attraction(request: Request, id: int):
	return FileResponse("./static/attraction.html", media_type="text/html")
@app.get("/booking", include_in_schema=False)
async def booking(request: Request):
	return FileResponse("./static/booking.html", media_type="text/html")
@app.get("/thankyou", include_in_schema=False)
async def thankyou(request: Request):
	return FileResponse("./static/thankyou.html", media_type="text/html")

# USER
@app.post("/api/user")
async def post_signup(data: SignUpData):
	try: 
		mydb=mydbpool.get_connection()
		mycursor=mydb.cursor()
		mycursor.execute('SELECT*FROM user WHERE email = %s', (data.email, ))
		myresult=mycursor.fetchall()
		mycursor.close()
		if myresult == []:
			mycursor=mydb.cursor()
			mycursor.execute('INSERT INTO user (name, email, password) VALUE (%s, %s, %s)', (data.name, data.email, data.password))
			mydb.commit()
			return {"ok": True}
		return {"error": True, 'message': "註冊失敗，Email已被使用"}
	except:
		print('not ok')
		return {"error": True, "message": "內部錯誤，無法註冊帳戶"}
	
@app.get('/api/user/auth')
async def get_user(request: Request):
	auth_header=request.headers.get("Authorization")
	if auth_header==None:
		return {"data": None}
	else:
		try:
			token=auth_header.split('Bearer ')[1]
			decode = jwt.decode(token, "secret-key-tdt", algorithms=['HS256'])
			decode.pop('exp', None)
			return {"data": decode}
		except:
			return {"data": None}

@app.put('/api/user/auth')
async def put_signin(data: SignInData):
	try: 
		mydb=mydbpool.get_connection()
		mycursor=mydb.cursor(dictionary=True)
		mycursor.execute('SELECT * FROM user WHERE email = %s', (data.email, ))
		myresult=mycursor.fetchone()
		mycursor.close()
		mydb.close()
		if myresult==None or myresult["password"]!=data.password:
			return {"error": True, "message": "帳號或密碼錯誤"}
		encode=jwt.encode({"id": myresult["id"], "name": myresult["name"], "email": myresult["email"], "exp": datetime.now()+timedelta(days=7)}, "secret-key-tdt", algorithm="HS256")
		return {"token": encode}
	except:
		return {"error": "內部錯誤，無法登入"}

# ATTRACTION
@app.get("/api/attractions", responses={500: {'model': Error}})
async def get_attraction(page: int, keyword: str | None=None):
	try:
		per_page=12
		mydb=mydbpool.get_connection()
		mycursor=mydb.cursor(dictionary=True)
		if keyword==None:
			mycursor.execute('SELECT id, name, category, description, address, transport, mrt, ST_X(coordinate) AS lat, ST_Y(coordinate) AS lng, images FROM attractions LIMIT 13 OFFSET %s;', (page*per_page, ))
			myresult=mycursor.fetchall()
			mycursor.close()
			mydb.close()
		else:
			mycursor.execute("SELECT id, name, category, description, address, transport, mrt, ST_X(coordinate) AS lat, ST_Y(coordinate) AS lng, images FROM attractions WHERE name LIKE %s or mrt LIKE %s LIMIT 13 OFFSET %s;", ('%'+ keyword + '%', '%'+ keyword + '%', page*per_page))
			myresult=mycursor.fetchall()
			mycursor.close()
			mydb.close()
		for result in myresult:
			result['images']=result['images'].split(' ')
		if len(myresult)>per_page:
			data=myresult[:per_page]
			next_page=page+1
		else:
			data=myresult
			next_page=None
		return {"nextPage": next_page, "data": data}
	except:
		return JSONResponse(status_code=500, content={"error": True, "message": "發生內部錯誤，無法取得資料"})
	
@app.get("/api/attraction/{attractionId}", responses={400: {"model": Error}, 500: {"model": Error}})
async def get_attraction_by_id(attractionId: int):
	try:
		mydb=mydbpool.get_connection()
		mycursor=mydb.cursor(dictionary=True)
		mycursor.execute('SELECT id, name, category, description, address, transport, mrt, ST_X(coordinate) AS lat, ST_Y(coordinate) AS lng, images FROM attractions WHERE id = %s;', (attractionId, ))
		myresult=mycursor.fetchone()
		mycursor.close()
		mydb.close()
		if myresult==None:
			return JSONResponse(status_code=400, content={"error": True, "message": "景點編號錯誤"})
		else:
			myresult['images']=myresult['images'].split(' ')
			data=Attraction.model_validate(myresult)
			return {"data": data}
	except:
		return JSONResponse(status_code=500, content={"error": True, "message": "發生內部錯誤，無法取得資料"})
	
@app.get("/api/mrts", responses={500: {'model': Error}})
async def get_mrts():
	try:
		mydb=mydbpool.get_connection()
		mycursor=mydb.cursor()
		mycursor.execute(' SELECT DISTINCT mrt FROM attractions GROUP BY mrt ORDER BY count(mrt) DESC;')
		myresult=mycursor.fetchall()
		mycursor.close()
		mydb.close()
		data=[]
		for mrt in myresult:
			if mrt[0]!='無':
				data.append(mrt[0])
		# data=[mrt[0] for mrt in myresult]
		return {'data': data}
	except:
		return JSONResponse(status_code=500, content={"error": True, "message": "發生內部錯誤，無法取得資料"})
	
app.mount("/", StaticFiles(directory="static"))