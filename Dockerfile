FROM node:20 AS frontend

WORKDIR /app

COPY ./frontend/package.json ./package.json

RUN npm i

COPY ./frontend .

RUN npm run build

FROM python:3.8

WORKDIR /app

COPY ./requirements.txt ./requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

COPY --from=frontend /app/build ./frontend/build

EXPOSE 80

CMD ["uvicorn", "index:app", "--host", "0.0.0.0", "--port", "80", "--workers", "4"]
