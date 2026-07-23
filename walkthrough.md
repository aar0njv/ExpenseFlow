1. Implementation Steps:
Open your terminal, navigate to your root ExpenseFlow directory, and follow these steps:
1.Configure the Account Service:Run this inside the account-service directory.

cd account-service
poetry init -n
poetry add fastapi "uvicorn[standard]" pydantic pydantic-settings sqlalchemy "psycopg[binary]"
poetry add pytest black ruff --group dev

2.Configure the Transaction Service:Run this inside the transaction-service directory
cd ../transaction-service
poetry init -n
poetry add fastapi "uvicorn[standard]" pydantic pydantic-settings sqlalchemy "psycopg[binary]"
poetry add pytest black ruff --group dev


3.Configure the Reporting Service:Note the extra httpx package for this service.
cd ../reporting-service
poetry init -n
poetry add fastapi "uvicorn[standard]" pydantic pydantic-settings sqlalchemy "psycopg[binary]" httpx
poetry add pytest black ruff --group dev

2. Technical Rationalepoetry init -n: The -n (no interaction) flag skips the long interactive questionnaire 
(asking for author, license, etc.) and instantly builds a valid pyproject.toml using your directory name and default 
system Python path.Quotes around brackets ("uvicorn[standard]"): Depending on your terminal shell 
(like Zsh), brackets can be misinterpreted as file-globbing characters. Wrapping the package name in quotes 
prevents terminal syntax errors.The --group dev flag: This keeps your production application images light.
 Packages like pytest, black, and ruff are only needed during local development or CI linting stages. 
They will not be packed into the final container that runs the code.

3. ValidationTo verify that Poetry generated everything correctly:Look inside any of the service folders. 
You will now see two new files: pyproject.toml and poetry.lock.Open pyproject.toml to verify it matches the structure we want.
Run a quick check to ensure the environment is healthy and can read the packages:
Bash poetry run python -c "import fastapi; print(fastapi.__version__)"
If it prints out a version number without errors, your Poetry setup is complete.


NOTE: poetry config virtualenvs.create false in Dockerfile since Docker containers already create an isolated env and no need for any extra venv.

