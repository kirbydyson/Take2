FROM python:3.10-slim AS build

#env variables go here
# ENV example_env=true

WORKDIR /build

RUN apt-get update && apt-get install -y gcc libmariadb-dev && rm -rf /var/lib/apt/lists/*

COPY . .

RUN pip install --upgrade pip && pip install -r requirements.txt

CMD ["python", "app.py"]
