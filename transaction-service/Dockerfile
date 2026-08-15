FROM python:3.12-slim  

ARG SERVICE_PORT=8000
ENV PORT=$SERVICE_PORT

WORKDIR /app

RUN pip install --no-cache-dir poetry

COPY pyproject.toml poetry.lock /app/

# Install dependencies
RUN poetry config virtualenvs.create false \
    && poetry install --no-root --without dev --no-interaction --no-ansi

COPY . /app

EXPOSE $PORT

CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT