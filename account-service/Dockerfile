

FROM python:3.12-slim  

ARG SERVICE_PORT=8000

ENV PORT=$SERVICE_PORT

WORKDIR /app

RUN pip install poetry

COPY pyproject.toml /app/

RUN poetry config virtualenvs.create false && poetry install --no-root

COPY . /app

EXPOSE $PORT

CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT