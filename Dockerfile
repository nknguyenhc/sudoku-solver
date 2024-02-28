FROM python:3.8

WORKDIR .

COPY requirements.txt ./requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 80

CMD ["uvicorn", "index:app", "--host", "0.0.0.0", "--port", "80"]
