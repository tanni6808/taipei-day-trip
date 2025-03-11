import json
import mysql.connector

mydb=mysql.connector.connect(
    host='localhost',
    user='root',
    password='123456',
    database='taipei_day_trip'
)

with open('data/taipei-attractions.json', 'r', encoding='UTF-8') as file:
    raw_data=json.load(file)

data=raw_data['result']['results']
# print(type(data))
# check_data=data[2]
# print(check_data['_id'])
# print(check_data['name'])
# print(check_data['CAT'])
# print(check_data['description'])
# print(check_data['address'])
# print(check_data['direction'])
# print(check_data['MRT'])
# print(check_data['latitude'])
# print(check_data['longitude'])
# print(check_data['file'])

def process_images(files_string):
    files=[]
    start=0
    while True:
        next_start= files_string.find('http', start+1)
        if next_start==-1:
            files.append(files_string[start:])
            break
        files.append(files_string[start:next_start])
        start=next_start
    
    images=list(filter(lambda file: (file[-3:].lower()=='png' or file[-3:].lower()=='jpg'), files))

    return images

# data_files=process_images(check_data['file'])
# print(data_files)

for attraction in data:
    mycursor=mydb.cursor()
    mycursor.execute('SELECT*FROM attractions WHERE id = %s', (attraction['_id'], ))
    myresult=mycursor.fetchone()
    mycursor.close()
    if myresult==None:
        mycursor=mydb.cursor()
        mycursor.execute('INSERT INTO attractions(id, name, category, description, address, transport, mrt, coordinate, images) VALUES (%s, %s, %s, %s, %s, %s, %s, ST_POINTFROMTEXT(%s), %s)', (attraction['_id'], attraction['name'], attraction['CAT'], attraction['description'], attraction['address'], attraction['direction'], attraction['MRT'], f'POINT({attraction['latitude']} {attraction['longitude']})', ' '.join(process_images(attraction['file']))))
        mydb.commit()
    else:
        continue

# print(data[0]['latitude'], data[0]['longitude'])

# mycursor=mydb.cursor(dictionary=True)
# mycursor.execute('SELECT ST_X(coordinate) FROM attractions WHERE id=1')
# myresult=mycursor.fetchone()
# print(myresult)