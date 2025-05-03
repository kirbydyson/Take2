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
    name VARCHAR(512) NOT NULL UNIQUE,
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
('DistinctFirstNames5CharLimit', 'SELECT DISTINCT nameFirst FROM people WHERE CHAR_LENGTH(REPLACE(nameFirst, '''', '''')) = 5'),
('DistinctLastNames5CharLimit', 'SELECT DISTINCT nameLast FROM people WHERE CHAR_LENGTH(REPLACE(nameLast, '''', '''')) = 5'),
('DistinctBaseballTerms5CharLimit', 'SELECT term FROM baseball_terms WHERE CHAR_LENGTH(term) = 5'),
('WordSeriesFirstBasemen', 'SELECT CONCAT(p.nameFirst, '' '', p.nameLast) FROM fielding f NATURAL JOIN people p WHERE f.position = ''1B'' GROUP BY p.playerID ORDER BY RAND() LIMIT 4'),
('WordSeriesSecondBasemen', 'SELECT CONCAT(p.nameFirst, '' '', p.nameLast) FROM fielding f NATURAL JOIN people p WHERE f.position = ''2B'' GROUP BY p.playerID ORDER BY RAND() LIMIT 4'),
('WordSeriesThirdBasemen', 'SELECT CONCAT(p.nameFirst, '' '', p.nameLast) FROM fielding f NATURAL JOIN people p WHERE f.position = ''3B'' GROUP BY p.playerID ORDER BY RAND() LIMIT 4'),
('WordSeriesShortstops', 'SELECT CONCAT(p.nameFirst, '' '', p.nameLast) FROM fielding f NATURAL JOIN people p WHERE f.position = ''SS'' GROUP BY p.playerID ORDER BY RAND() LIMIT 4'),
('WordSeriesOutfielders', 'SELECT CONCAT(p.nameFirst, '' '', p.nameLast) FROM fielding f NATURAL JOIN people p WHERE f.position IN (''LF'', ''CF'', ''RF'') GROUP BY p.playerID ORDER BY RAND() LIMIT 4'),
('WordSeriesPitchers', 'SELECT CONCAT(p2.nameFirst, '' '', p2.nameLast) FROM pitching p1 NATURAL JOIN people p2 GROUP BY p1.playerID ORDER BY RAND() LIMIT 4'),
('WordSeriesCatchers', 'SELECT CONCAT(p.nameFirst, '' '', p.nameLast) FROM fielding f NATURAL JOIN people p WHERE f.position = ''C'' GROUP BY p.playerID ORDER BY RAND() LIMIT 4'),
('WordSeriesMVPWinners', 'SELECT CONCAT(p.nameFirst, '' '', p.nameLast) FROM awards a NATURAL JOIN people p WHERE a.awardID = ''Most Valuable Player'' GROUP BY p.playerID ORDER BY RAND() LIMIT 4'),
('WordSeriesYankeesPlayers', 'SELECT CONCAT(p.nameFirst, '' '', p.nameLast) FROM appearances a NATURAL JOIN people p WHERE a.teamID = ''NYA'' GROUP BY p.playerID ORDER BY RAND() LIMIT 4'),
('WordSeriesRedSoxPlayers', 'SELECT CONCAT(p.nameFirst, '' '', p.nameLast) FROM appearances a NATURAL JOIN people p WHERE a.teamID = ''BOS'' GROUP BY p.playerID ORDER BY RAND() LIMIT 4'),
('WordSeriesDodgersPlayers', 'SELECT CONCAT(p.nameFirst, '' '', p.nameLast) FROM appearances a NATURAL JOIN people p WHERE a.teamID = ''LAN'' GROUP BY p.playerID ORDER BY RAND() LIMIT 4'),
('WordSeriesGiantsPlayers', 'SELECT CONCAT(p.nameFirst, '' '', p.nameLast) FROM appearances a NATURAL JOIN people p WHERE a.teamID = ''SFN'' GROUP BY p.playerID ORDER BY RAND() LIMIT 4'),
('WordSeriesCardinalsPlayers', 'SELECT CONCAT(p.nameFirst, '' '', p.nameLast) FROM appearances a NATURAL JOIN people p WHERE a.teamID = ''SLN'' GROUP BY p.playerID ORDER BY RAND() LIMIT 4'),
('WordSeriesCubsPlayers', 'SELECT CONCAT(p.nameFirst, '' '', p.nameLast) FROM appearances a NATURAL JOIN people p WHERE a.teamID = ''CHN'' GROUP BY p.playerID ORDER BY RAND() LIMIT 4'),
('WordSeriesAthleticsPlayers', 'SELECT CONCAT(p.nameFirst, '' '', p.nameLast) FROM appearances a NATURAL JOIN people p WHERE a.teamID = ''OAK'' GROUP BY p.playerID ORDER BY RAND() LIMIT 4'),
('WordSeriesBravesPlayers', 'SELECT CONCAT(p.nameFirst, '' '', p.nameLast) FROM appearances a NATURAL JOIN people p WHERE a.teamID = ''ATL'' GROUP BY p.playerID ORDER BY RAND() LIMIT 4'),
('WordSeriesHallOfFamePlayers', 'SELECT CONCAT(p.nameFirst, '' '', p.nameLast) FROM people p NATURAL JOIN halloffame h WHERE h.inducted = ''Y'' GROUP BY p.playerID ORDER BY RAND() LIMIT 4'),
('WordSeriesAllStarPlayers', 'SELECT CONCAT(p.nameFirst, '' '', p.nameLast) FROM people p NATURAL JOIN allstarfull a WHERE a.yearID = 2023 GROUP BY p.playerID ORDER BY RAND() LIMIT 4');
