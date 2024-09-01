FROM python:3.11-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir pipenv

WORKDIR /app

COPY Pipfile Pipfile.lock .

RUN pipenv install --system --deploy

COPY . .

EXPOSE 8000

CMD ["sh", "entrypoint.sh"]
