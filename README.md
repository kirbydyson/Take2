# Take 2: MLB No-Hitter & Trivia Web App

## Tech Stack

- **Frontend**: React with Next.js
- **Backend**: Flask (Python 3.10+)
- **Database**: MariaDB
- **CICD/Containerization**: Docker & Docker Compose

---

## Running Locally (with Docker)

### Requirements
- Docker + Docker Compose

### Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/kirbydyson/Take2.git
cd take2/docker

# 2. Build and run all services
docker compose -f local.docker-compose.yml up
```

- **Frontend**: `{{CLIENT_URL}}:3000`
- **Backend API**: `{{API_URL}}:8080`
- **DB Connection**: `{{DB_URL}}:3306`  
  - Username: `root`  
  - Password: `password`
    
## Running Locally

### Requirements
- Node 20+
- Flask (Python 3.10+)
- MariaDB

### Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/kirbydyson/Take2.git
cd take2

# 2. Install dependencies for the client
yarn install

# 3. Start the client
yarn dev

# 4. Start the server
python -m venv venv
. venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
python app.py
```
