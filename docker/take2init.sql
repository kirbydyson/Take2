USE baseball;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nameFirst VARCHAR(100),
    nameLast VARCHAR(100),
    role ENUM('user', 'admin') DEFAULT 'user'
);


CREATE TABLE IF NOT EXISTS scoredle_games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    correctWord VARCHAR(255) NOT NULL,
    attemptCount INT NOT NULL,
    guessedWord BOOLEAN NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS baseball_terms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    term VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS queries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    query TEXT NOT NULL
);

INSERT INTO baseball_terms (term) VALUES
('bunt'),
('curveball'),
('changeup'),
('double'),
('dugout'),
('fastball'),
('fielder'),
('grounder'),
('homerun'),
('infield'),
('inning'),
('manager'),
('mound'),
('outfield'),
('pitcher'),
('reliever'),
('shortstop'),
('slider'),
('strike'),
('swing'),
('triple'),
('umpire'),
('walk'),
('wildpitch'),
('tag'),
('catcher'),
('basehit'),
('bat'),
('boxscore'),
('pitch'),
('catch'),
('glove'),
('curve'),
('steal'),
('slide'),
('bench'),
('baton'),
('score'),
('spike'),
('bulky'),
('brush'),
('bloop'),
('popup'),
('choke'),
('check'),
('split'),
('grips'),
('swung'),
('lined'),
('throws');

INSERT INTO queries (name, query) VALUES
('DistinctFirstNames5CharLimit', 'SELECT DISTINCT nameFirst FROM people WHERE CHAR_LENGTH(REPLACE(nameFirst, '' '', '''')) = 5'),
('DistinctLastNames5CharLimit', 'SELECT DISTINCT nameLast FROM people WHERE CHAR_LENGTH(REPLACE(nameLast, '' '', '''')) = 5'),
('DistinctBaseballTerms5CharLimit', 'SELECT term FROM baseball_terms WHERE CHAR_LENGTH(term) = 5');
