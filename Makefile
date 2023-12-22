all:
    	echo "Running back-end"
   	run-back
    	echo "Running front-end"	
build-back:
	docker build -f backend/Dockerfile -t backend .

run-back:
	docker run -p 8000:8000 backend

test-back:
	curl -X GET "http://localhost:8000/health"