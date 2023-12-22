FROM python:3.10-slim

COPY requirements.txt .

RUN apt-get update && \
    apt-get install -y make g++ && \
    apt-get clean

RUN apt-get update && \
    apt-get install -y unzip

RUN rm -rf /var/lib/apt/lists/* && \
    pip install -r requirements.txt

#WORKDIR /app

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]