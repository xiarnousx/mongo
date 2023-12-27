up:
	docker-compose up -d

down:
	docker-compose down

sh:
	docker-compose exec -it mongosrvc mongosh --username root --password example

#  make import file="/rawdata/persons.json" db="contactData" collection="contacts"
#  make import file="/rawdata/friends.json" db="analytics" collection="friends"
import:
	docker-compose exec -it mongosrvc mongoimport $(file) -d $(db) -c $(collection) --jsonArray --authenticationDatabase admin --username root --password example