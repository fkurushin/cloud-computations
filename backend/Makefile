all:
	run
build:
	docker build -f Dockerfile -t backend .

run:
	docker run -p 8080:8080 backend

test:
	curl -X GET "http://localhost:8000/health"
