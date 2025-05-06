# Take 2: MLB No-Hitter & Trivia Web App

# Tech Stack

- **Frontend**: React (19.0.0) with Next.js
- **Backend**: Flask (Python 3.12+)
- **Database**: MariaDB
- **CICD/Containerization**: Docker & Docker Compose


---

# Features

### User Authentication
- Users can register, login, and manage their accounts.
  - This can be done by using the `/login` and `/register` routes.
  - When a user registers, their first name, last name, email, password, `role = user`, and `team = null`
    - team is set to null because the user has not selected a no hitters team yet.
    - The user can select a team after they login.
    - The user can select a team by using the `Select Team` link in the navbar.

### User Management
- Admins can manage users, including banning and unbanning users.
  - This can be done by using the `/admin` route.
  - Admins can view all users and their details (game history).
  - Admins can ban and unban users by clicking on the `Ban` and `Unban` buttons.
  - A default admin account is:
    - Email: test@example.com
    - Password: password123

### Games (Uses OpenAI API)
- Users can play games like Scoredle, Word Series, and Trivia
  - Scoredle uses an enum of prepared queries in the `queries` table in the database.
  - Word Series uses an enum of prepared queries in the `queries` table in the database.
  - Trivia uses an OpenAI API to generate 5 trivia questions. These questions are then fed back into the API to generate queries for these questions.


---

# Running Locally

## Run App Locally with Local Database

### Requirements

- MariaDB

### Step 1: Load the .env file

```bash
# 1. Copy the .env.example file to .env
cd server
cp .env.example .env
```

Then load the .env values. If you are the person testing the project, these values should be already loaded. If not, an email was sent to you with the values.

> [!IMPORTANT]  
> The server WILL NOT RUN if these values are not loaded.

### Step 2: Setup Database

```bash
# 1. Clone the repository
git clone https://github.com/kirbydyson/Take2.git
cd take2/docker

# 2. Start the database
mysql

# 3. Initialize the database with baseball.sql
mysql < ./baseball.sql

# 4. Initialize the database with take2init.sql
mysql baseball < ./take2init.sql
```

### Step 3: Setup Backend

> [!IMPORTANT]  
> Ensure that you have loaded the .env values correctly.

```bash
# 1. Move to the backend directory
cd ../service

# 2. Build and run
python -m venv venv
. venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
python app.py
```

### Step 4: Setup Frontend

```bash
# 1. Move to the frontend directory
cd ../client

# 2. Install dependencies
yarn install

# 3. Start the client
yarn dev
```

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8080`
- **DB Connection**: `http://localhost:3306`
  - Location: `localhost`
  - Username: `root`
  - Password: `password`
  - Database: `baseball`

## Run App Locally with Dockerized Database

### Requirements

- Docker + Docker Compose

### Step 1: Load the .env file

```bash
# 1. Copy the .env.example file to .env
cd server
cp .env.example .env
```

Then load the .env values. If you are the person testing the project, these values should be already loaded. If not, an email was sent to you with the values.

> [!IMPORTANT]  
> The server WILL NOT RUN if these values are not loaded.

### Step 2: Setup Database

```bash
# 1. Clone the repository
git clone https://github.com/kirbydyson/Take2.git
cd take2/docker

# 2. Build and run
docker compose -f local.docker-compose.yml up
```

### Step 3: Setup Backend

> [!IMPORTANT]  
> Ensure that you have loaded the .env values correctly.

```bash
# 1. Move to the backend directory
cd ../service

# 2. Build and run
python -m venv venv
. venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
python app.py
```

### Step 4: Setup Frontend

```bash
# 1. Move to the frontend directory
cd ../client

# 2. Install dependencies
yarn install

# 3. Start the client
yarn dev
```

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8080`
- **DB Connection**: `http://localhost:3306`
    - Location: `localhost`
    - Username: `root`
    - Password: `password`
    - Database: `baseball`

---

# Troubleshooting

## Common Issues

### 1. "Fernet key must be 32 url-safe base64-encoded bytes."

```
Traceback (most recent call last):
  File "/Users/sam/Desktop/database/Take2/server/app.py", line 9, in <module>
    from admin_controller import admin_bp
  File "/Users/sam/Desktop/database/Take2/server/admin_controller.py", line 5, in <module>
    from utils.crypto import encrypt_user_id, decrypt_token
  File "/Users/sam/Desktop/database/Take2/server/utils/crypto.py", line 5, in <module>
    fernet = Fernet(FERNET_KEY)
  File "/Users/sam/Desktop/database/Take2/server/venv/lib/python3.10/site-packages/cryptography/fernet.py", line 40, in __init__
    raise ValueError(
ValueError: Fernet key must be 32 url-safe base64-encoded bytes.
```

This error occurs when the Fernet key is not set correctly in the `.env` file. Ensure that you have set the
`FERNET_SECRET_KEY` variable in the `.env` file to a valid Fernet key.

### 2. "No module named 'openai'"

```
Traceback (most recent call last):
  File "/Users/sam/Desktop/database/Take2/server/app.py", line 6, in <module>
    from trivia_controller import trivia_bp
  File "/Users/sam/Desktop/database/Take2/server/trivia_controller.py", line 4, in <module>
    from openai import OpenAI
ModuleNotFoundError: No module named 'openai'
```

This error occurs when the OpenAI library is not installed in your Python environment. Ensure that you have run
`pip install -r requirements.txt` in the `service` directory to install all required dependencies.

### 3. "/bin/sh: next: command not found"

```
yarn run v1.22.22
$ next dev --turbopack
/bin/sh: next: command not found
error Command failed with exit code 127.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

This error occurs when the Next.js CLI is not installed globally. You can install it by running the following command:

```bash
yarn install

# Start the client again
yarn dev
```

### 4. "Can't connect to MySQL server on 'localhost' (61)"

```
mysql.connector.errors.DatabaseError: 2003 (HY000): Can't connect to MySQL server on 'localhost:3306' (61)
```

This error occurs when the MySQL server is not running or not accessible. Ensure that you have started the Docker
container with the database and that it is running. You can check the status of the container by running:

```bash
docker ps
```

You should see the `take2-mariadb` container running. If it is not running, you can start it with:

```bash
cd docker
docker compose -f local.docker-compose.yml up -d
```

---

# Pages

| **Route**                  | **Component**              | **Description**                                    | **Access**                      |
|----------------------------|----------------------------|----------------------------------------------------|---------------------------------|
| `/`                        | `Homepage`                 | Landing page with an overview and call-to-action.  | Public                          |
| `/login`                   | `LoginComponent`           | User authentication page.                          | Public (redirects if logged in) |
| `/register`                | `RegisterComponent`        | User signup page.                                  | Public (redirects if logged in) |
| `/register-success`        | `RegisterSuccessComponent` | Registration success page.                         | Public                          |
| `/my-games`                | `MyGamesComponent`         | User games after logging in.                       | Private (Auth required)         |
| `/catalogue`               | `Catalogue`                | A catalogue of games that we offer                 | Public                          |
| `/team-info`               | `TeamInfoComponent`        | No hitter team information page for users.         | Public                          |
| `/banned`                  | `BannedComponent`          | Banned page for users who are banned.              | Public                          |
| `/trivia`                  | `TriviaComponent`          | Trivia page for users to answer questions.         | Private (Auth required)         |
| `/scoredle`                | `ScoredleComponent`        | Scoredle game page for users to play.              | Private (Auth required)         |
| `/word-series`             | `WordSeriesComponent`      | Word series game page for users to play.           | Private (Auth required)         |
| `/admin`                   | `AdminComponent`           | Admin page for managing users.                     | Private (Admin only)            |
| `/admin/create-account`    | `CreateAccountComponent`   | Admin page for creating new accounts.              | Private (Admin only)            |
| `/admin/verify`            | `VerifyComponent`          | Verification page to access /admin/create-account. | Private (Password required)     |
| `/admin/view-user/<token>` | `ViewUserComponent`        | Admin page for viewing user details.               | Private (Admin only)            |
| `*`                        | `NotFoundPage`             | 404 page for undefined routes.                     | Public                          |

