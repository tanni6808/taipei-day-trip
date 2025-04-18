from fastapi import *
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Annotated, Optional
import mysql.connector
import mysql.connector.pooling
from collections import Counter
import jwt, requests, json
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

def generate_order_number(user_id: int) -> str:
	now=datetime.now()
	date_str = now.strftime('%Y%m%d')
	timestamp_suffix = str(int(now.timestamp()*1000))[-5:]
	user_code = f"U{user_id:05d}"
	order_number = f"ORD{date_str}-{timestamp_suffix}{user_code}"
	return order_number

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

class BookingData(BaseModel):
	attractionId: int
	date: str
	time: str
	price: int

class AttractionGeneral(BaseModel):
	id: int
	name: str
	address: str
	image: str

class Trip(BaseModel):
	attraction: AttractionGeneral
	date: str
	time: str

class Contact(BaseModel):
	name: str
	email: str
	phone: str

class Order(BaseModel):
	price: int
	trip: Trip
	contact: Contact

class OrderData(BaseModel):
	prime: str
	order: Order

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
		mydb.close()
		if myresult == []:
			mycursor=mydb.cursor()
			mycursor.execute('INSERT INTO user (name, email, password) VALUE (%s, %s, %s)', (data.name, data.email, data.password))
			mydb.commit()
			return {"ok": True}
		return {"error": True, 'message': "註冊失敗，Email已被使用"}
	except:
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

#MRT Station
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
	
# BOOKING
@app.get("/api/booking", responses={403: {'model': Error}})
async def get_booking(request: Request):
	auth_header=request.headers.get("Authorization")
	if auth_header==None:
		return JSONResponse(status_code=403, content={"error": True, "message": "未登入，無法取得訂單資料"})
	else:
		token=auth_header.split('Bearer ')[1]
		decode = jwt.decode(token, "secret-key-tdt", algorithms=['HS256'])
		mydb=mydbpool.get_connection()
		mycursor=mydb.cursor(dictionary=True)
		mycursor.execute('SELECT attractions.id AS attraction_id, attractions.name, attractions.address, attractions.images, booking.book_date, booking.morning FROM booking JOIN attractions ON booking.attraction_id=attractions.id WHERE user_id = %s;', (decode["id"], ))
		myresult=mycursor.fetchone()
		mycursor.close()
		mydb.close()
		if myresult==None:
			return {"data": None}
		attraction_data= {"id": myresult["attraction_id"], "name": myresult["name"], "address": myresult["address"], "image": myresult["images"].split(' ')[0]}
		time='morning' if myresult['morning']==1 else 'afternoon'
		price=2000 if myresult['morning']==1 else 2500
		return {"data": {"attraction": attraction_data, "date": myresult["book_date"], "time": time, "price": price}}
	
@app.post('/api/booking', responses={400: {'model': Error}, 403: {'model': Error}})
async def post_booking(data: BookingData, request: Request):
	auth_header=request.headers.get("Authorization")
	if auth_header==None:
		return JSONResponse(status_code=403, content={"error": True, "message": "未登入，無法新增訂單資料"})
	else:
		try: 
			token=auth_header.split('Bearer ')[1]
			decode = jwt.decode(token, "secret-key-tdt", algorithms=['HS256'])
			mydb=mydbpool.get_connection()
			mycursor=mydb.cursor()
			try: 
				mycursor.execute('SELECT*FROM booking WHERE user_id = %s', (decode["id"], ))
				myresult=mycursor.fetchall()
				mycursor.close()
				if myresult != []:
					mycursor=mydb.cursor()
					mycursor.execute('DELETE FROM booking WHERE user_id = %s', (decode["id"], ))
					mydb.commit()
					mycursor.close()
				morning=1 if data.time=='morning' else 0
				mycursor=mydb.cursor()
				mycursor.execute('INSERT INTO booking (user_id, attraction_id, book_date, morning) VALUE (%s, %s, %s, %s)', (decode['id'], data.attractionId, data.date, morning))
				mydb.commit()
				mycursor.close()
				mydb.close()
				return {"ok": True}
			except:
				return JSONResponse(status_code=400, content={"error": True, "message": "資料錯誤，無法新增訂單"})
		except:
			return {"error": True, "message": "內部錯誤，無法新增訂單"}
	
@app.delete('/api/booking', responses={403: {'model': Error}})
async def delete_booking(request: Request):
	auth_header=request.headers.get("Authorization")
	if auth_header==None:
		return JSONResponse(status_code=403, content={"error": True, "message": "未登入，無法刪除訂單資料"})
	else:
		try:
			token=auth_header.split('Bearer ')[1]
			decode = jwt.decode(token, "secret-key-tdt", algorithms=['HS256'])
		except:
			return JSONResponse(status_code=403, content={"error": True, "message": "未登入，無法刪除訂單資料"})
		mydb=mydbpool.get_connection()
		mycursor=mydb.cursor()
		mycursor.execute('DELETE FROM booking WHERE user_id = %s', (decode["id"], ))
		mydb.commit()
		mycursor.close()
		mydb.close()
		return {"ok": True}
	

# ORDER 
@app.post('/api/orders', responses={400: {'model': Error}, 403: {'model': Error}, 500: {'model': Error}})
async def post_orders(data: OrderData, request: Request):
	try:
		auth_header=request.headers.get("Authorization")
		if auth_header==None:
			return JSONResponse(status_code=403, content={"error": True, "message": "未登入，無法進行訂購"})
		else:
			try: 
				token=auth_header.split('Bearer ')[1]
				decode = jwt.decode(token, "secret-key-tdt", algorithms=['HS256'])
			except:
				return JSONResponse(status_code=403, content={"error": True, "message": "未登入，無法進行訂購"})
			try: 
				morning=1 if data.order.trip.time=='morning' else 0
				order_number = generate_order_number(decode['id'])
				mydb=mydbpool.get_connection()
				mycursor=mydb.cursor()
				mycursor.execute('INSERT INTO orders (user_id, attraction_id, price, book_date, morning, contact_name, contact_email, contact_phone, order_number) VALUE (%s, %s, %s, %s, %s, %s, %s, %s, %s)', (decode['id'], data.order.trip.attraction.id, data.order.price, data.order.trip.date, morning, data.order.contact.name, data.order.contact.email, data.order.contact.phone, order_number))
				mydb.commit()
				mycursor.execute('DELETE FROM booking WHERE user_id = %s', (decode["id"], ))
				mydb.commit()
				mycursor.close()
				mydb.close()
				partner_key = 'partner_jA6jWYh2Ewn3v1g0y4dlAhQquwOIZO0nULriaW1x5wXVDwqrrkqBuLLS'
				tappay_header = {"Content-Type": "application/json", "x-api-key": partner_key}
				tappay_data = {
					"prime": data.prime,
					"partner_key": partner_key,
					"merchant_id": "tanniY521_CTBC",
					"details":"TapPay Test",
					"amount": data.order.price,
					"cardholder": {
						"phone_number": "+886923456789",
						"name": "王小明",
						"email": "LittleMing@Wang.com",
						"zip_code": "100",
						"address": "台北市天龍區芝麻街1號1樓",
						"national_id": "A123456789"
					},
					"remember": False
				}
				tappay_response=requests.post('https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime', headers=tappay_header, json=tappay_data)
				tappay_response_data=tappay_response.json()
				tappay_response_data_json_str=json.dumps(tappay_response_data, ensure_ascii=False)
				mydb=mydbpool.get_connection()
				mycursor=mydb.cursor()
				mycursor.execute('INSERT INTO payment_log (order_number, status_code, details) VALUE (%s, %s, %s)', (order_number, tappay_response_data['status'], tappay_response_data_json_str))
				mydb.commit()
				if tappay_response_data['status']==0:
					mycursor.execute('UPDATE orders SET paid=1 WHERE order_number=%s', (order_number, ))
					mydb.commit()
					response_message = '付款成功'
				else:
					response_message = '付款失敗'
				mycursor.close()
				mydb.close()
				return {'data': {"number": order_number, 'payment': {"status": tappay_response_data['status'], 'message': response_message}}}
			except:
				return JSONResponse(status_code=400, content={"error": True, "message": "資料錯誤，無法進行訂購"})
	except:
		return JSONResponse(status_code=500, content={"error": True, "message": "內部錯誤，無法進行訂購"})

@app.get('/api/order/{orderNumber}')
async def get_order(orderNumber: str, request: Request):
	auth_header=request.headers.get("Authorization")
	if auth_header==None:
		return JSONResponse(status_code=403, content={"error": True, "message": "未登入"})
	else:
		try:
			token=auth_header.split('Bearer ')[1]
			decode = jwt.decode(token, "secret-key-tdt", algorithms=['HS256'])
		except:
			return JSONResponse(status_code=403, content={"error": True, "message": "未登入"})
		mydb=mydbpool.get_connection()
		mycursor=mydb.cursor(dictionary=True)
		mycursor.execute("SELECT orders.order_number, orders.price, orders.attraction_id, attractions.name, attractions.address, attractions.images, orders.book_date, orders.morning, orders.contact_name, orders.contact_email, orders.contact_phone, orders.paid FROM orders JOIN attractions ON orders.attraction_id=attractions.id WHERE order_number=%s", (orderNumber, ))
		result=mycursor.fetchone()
		print(result)
		data={"number":result['order_number'], "price": result['price'], "trip": {"attraction": {"id":result['attraction_id'], 'name':result['name'], 'address': result['address'], 'image': result['images'].split(' ')[0]}, "date": result['book_date'], "time": 'morning' if result['morning']==1 else 'afternoon'}, "contact": {"name":result['contact_name'], 'email': result['contact_email'], 'phone': result['contact_phone']}, 'status': result['paid']}
		mycursor.close()
		mydb.close()
		return {"data": data}
	
# SELECT attractions.id AS attraction_id, attractions.name, attractions.address, attractions.images, booking.book_date, booking.morning FROM booking JOIN attractions ON booking.attraction_id=attractions.id WHERE user_id = %s;', (decode["id"], )

app.mount("/", StaticFiles(directory="static"))