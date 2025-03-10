import json

with open('data/taipei-attractions.json', 'r', encoding='UTF-8') as file:
    raw_data=json.load(file)

data=raw_data['result']['results']
# print(data[2])
check_data=data[2]
print(check_data['_id'])
print(check_data['name'])
print(check_data['CAT'])
print(check_data['description'])
print(check_data['address'])
print(check_data['direction'])
print(check_data['MRT'])
print(check_data['latitude'])
print(check_data['longitude'])
print(check_data['file'])

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

data_files=process_images(check_data['file'])
# print(check_data['file'][1:].find('http'))
print(data_files)