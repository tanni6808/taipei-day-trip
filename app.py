from fastapi import *
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from typing import Annotated, Optional
import mysql.connector
import mysql.connector.pooling
from collections import Counter

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


@app.get("/api/attractions", responses={500: {'model': Error}})
async def get_attraction(page: int, keyword: str | None=None):
	try:
		mydb=mydbpool.get_connection()
		mycursor=mydb.cursor(dictionary=True)
		if keyword==None:
			mycursor.execute('SELECT id, name, category, description, address, transport, mrt, ST_X(coordinate) AS lat, ST_Y(coordinate) AS lng, images FROM attractions;')
			myresult=mycursor.fetchall()
			mycursor.close()
			mydb.close()
		else:
			mycursor.execute("SELECT id, name, category, description, address, transport, mrt, ST_X(coordinate) AS lat, ST_Y(coordinate) AS lng, images FROM attractions WHERE name LIKE %s or mrt LIKE %s;", ('%'+ keyword + '%', '%'+ keyword + '%'))
			myresult=mycursor.fetchall()
			mycursor.close()
			mydb.close()
		for result in myresult:
			result['images']=result['images'].split(' ')
		data=myresult[page*12:page*12+12]
		if len(myresult)<page*12+13:
			next_page=None
		else:
			next_page=page+1
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
		data=[mrt[0] for mrt in myresult]
		return {'data': data}
	except:
		return JSONResponse(status_code=500, content={"error": True, "message": "發生內部錯誤，無法取得資料"})