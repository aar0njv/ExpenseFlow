FROM python:3.12-slim  

ARG SERVICE_PORT=8000
ENV PORT=$SERVICE_PORT

WORKDIR /app

RUN --mount=type=cache,target=/root/.cache/pip \
    pip install poetry

COPY pyproject.toml poetry.lock /app/

RUN --mount=type=cache,target=/root/.cache/pypoetry \
    --mount=type=cache,target=/root/.cache/pip \
    poetry config virtualenvs.create false \
    && poetry install --no-root --without dev --no-interaction --no-ansi

COPY . /app

EXPOSE $PORT

CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT
