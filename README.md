---

# CSV to JSON Converter API

This is an Express API that converts CSV files to JSON format and stores the data in a PostgreSQL database. It also generates an age distribution report based on the user data stored in the database.

## Prerequisites

- Node.js
- PostgreSQL
- Docker (optional, for running PostgreSQL with Docker Compose)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/csv-to-json-api.git
   ```

2. Install dependencies:

   ```bash
   cd csv-to-json-api
   npm install
   ```

3. Set up the environment variables:

   - Create a `.env` file in the root directory.
   - Add the following environment variables and update their values accordingly:

     ```plaintext
     NODE_ENV=development

     PORT=5000

     POSTGRES_USER=root
     POSTGRES_HOST=localhost
     POSTGRES_PASSWORD=password
     POSTGRES_DB=csvtojson
     POSTGRES_PORT=5432
     POSTGRES_MAX_POOL=10
     POSTGRES_MIN_POOL=0
     POSTGRES_IDLE=10000

     CSV_FILE_PATH=/path/to/csv/file.csv
     ```

## Database Setup

If you are not using Docker for PostgreSQL, make sure to set up the database manually.

1. Create a PostgreSQL database with the name specified in the `.env` file (`csvtojson` by default).

2. Update the PostgreSQL connection details in the `.env` file if necessary.

## Running the Application

Start the API server:

```bash
npm start
```

The API will be available at `http://localhost:5000`.

## Usage

1. Set the location of the CSV file in the environment file (.env) under `CSV_FILE_PATH`.

2. Trigger an API to convert CSV to JSON:
   - **Endpoint:** `POST /api/v1/users`
   - The report will be printed in the console.

---
