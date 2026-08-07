FROM python:3.12-slim  

ARG SERVICE_PORT=8000
ENV PORT=$SERVICE_PORT

WORKDIR /app

RUN pip install --no-cache-dir poetry

COPY pyproject.toml poetry.lock* /app/

# Synchronize lockfile if pyproject.toml was updated, then install prod dependencies
RUN poetry config virtualenvs.create false \
    && poetry lock \
    && poetry install --no-root --without dev --no-interaction --no-ansi

COPY . /app

EXPOSE $PORT

CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT