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
('DistinctBaseballTerms5CharLimit', 'SELECT term FROM baseball_terms WHERE CHAR_LENGTH(term) = 5'),
('WordSeriesFirstBasemen', 'SELECT CONCAT(nameFirst, ' ', nameLast) FROM fielding f NATURAL JOIN people p WHERE position = '1B' GROUP BY p.playerid ORDER BY RAND() LIMIT 4'),
('WordSeriesSecondBasemen', 'SELECT CONCAT(nameFirst, ' ', nameLast) FROM fielding f NATURAL JOIN people p WHERE position = '2B' GROUP BY p.playerid ORDER BY RAND() LIMIT 4'),
('WordSeriesThirdBasemen', 'SELECT CONCAT(nameFirst, ' ', nameLast) FROM fielding f NATURAL JOIN people p WHERE position = '3B' GROUP BY p.playerid ORDER BY RAND() LIMIT 4'),
('WordSeriesShortstops', 'SELECT CONCAT(nameFirst, ' ', nameLast) FROM fielding f NATURAL JOIN people p WHERE position = 'SS' GROUP BY p.playerid ORDER BY RAND() LIMIT 4'),,
('WordSeriesOutfielders', 'SELECT CONCAT(nameFirst, ' ', nameLast) FROM fielding f NATURAL JOIN people p WHERE position IN ('LF', 'CF', 'RF') GROUP BY p.playerid ORDER BY RAND() LIMIT 4'),
('WordSeriesPitchers', 'SELECT CONCAT(nameFirst, ' ', nameLast) FROM pitching p NATURAL JOIN people p WHERE position = 'P' GROUP BY p.playerid ORDER BY RAND() LIMIT 4'),
('WordSeriesCatchers', 'SELECT CONCAT(nameFirst, ' ', nameLast) FROM fielding f NATURAL JOIN people p WHERE position = 'C' GROUP BY p.playerid ORDER BY RAND() LIMIT 4'),
('WordSeriesMVPWinners', 'SELECT CONCAT(nameFirst, ' ', nameLast) FROM awards a NATURAL JOIN people p WHERE awardid = 'Most Valuable Player' GROUP BY p.playerid ORDER BY RAND() LIMIT 4'),
('WordSeriesYankeesPlayers', 'SELECT CONCAT(nameFirst, ' ', nameLast) FROM appearances a NATURAL JOIN people p WHERE teamID = 'NYA' GROUP BY p.playerid ORDER BY RAND() LIMIT 4'),
('WordSeriesRedSoxPlayers', 'SELECT CONCAT(nameFirst, ' ', nameLast) FROM appearances a NATURAL JOIN people p WHERE teamID = 'BOS' GROUP BY p.playerid ORDER BY RAND() LIMIT 4'),
('WordSeriesDodgersPlayers', 'SELECT CONCAT(nameFirst, ' ', nameLast) FROM appearances a NATURAL JOIN people p WHERE teamID = 'LAN' GROUP BY p.playerid ORDER BY RAND() LIMIT 4'),
('WordSeriesGiantsPlayers', 'SELECT CONCAT(nameFirst, ' ', nameLast) FROM appearances a NATURAL JOIN people p WHERE teamID = 'SFG' GROUP BY p.playerid ORDER BY RAND() LIMIT 4'),
('WordSeriesCardinalsPlayers', 'SELECT CONCAT(nameFirst, ' ', nameLast) FROM appearances a NATURAL JOIN people p WHERE teamID = 'STL' GROUP BY p.playerid ORDER BY RAND() LIMIT 4'),
('WordSeriesCubsPlayers', 'SELECT CONCAT(nameFirst, ' ', nameLast) FROM appearances a NATURAL JOIN people p WHERE teamID = 'CHN' GROUP BY p.playerid ORDER BY RAND() LIMIT 4'),
('WordSeriesAthleticsPlayers', 'SELECT CONCAT(nameFirst, ' ', nameLast) FROM appearances a NATURAL JOIN people p WHERE teamID = 'OAK' GROUP BY p.playerid ORDER BY RAND() LIMIT 4'),
('WordSeriesBravesPlayers', 'SELECT CONCAT(nameFirst, ' ', nameLast) FROM appearances a NATURAL JOIN people p WHERE teamID = 'ATL' GROUP BY p.playerid ORDER BY RAND() LIMIT 4'),
('WordSeriesHallOfFamePlayers', 'SELECT CONCAT(nameFirst, ' ', nameLast) FROM people p NATURAL JOIN halloffame h WHERE h.inducted = 'Y' GROUP BY p.playerid ORDER BY RAND() LIMIT 4'),
('WordSeriesAllStarPlayers', 'SELECT CONCAT(nameFirst, ' ', nameLast) FROM people p NATURAL JOIN allstarfull a WHERE a.yearid = 2023 GROUP BY p.playerid ORDER BY RAND() LIMIT 4'),
('WordSeriesWorldSeriesPlayers', 'SELECT CONCAT(nameFirst, ' ', nameLast) FROM people p NATURAL JOIN worldseries w WHERE w.yearid = 2023 GROUP BY p.playerid ORDER BY RAND() LIMIT 4'),
('WordSeriesWorldSeriesMVPs', 'SELECT CONCAT(nameFirst, ' ', nameLast) FROM people p NATURAL JOIN worldseries w WHERE w.mvp = p.playerid GROUP BY p.playerid ORDER BY RAND() LIMIT 4');