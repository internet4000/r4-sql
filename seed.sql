DROP TABLE users;
DROP TABLE channels;
DROP TABLE tracks;

CREATE TABLE IF NOT EXISTS users (
	--id text PRIMARY KEY,
	email text UNIQUE NOT NULL,
	channel_id int
);

CREATE TABLE IF NOT EXISTS channels (
	--id text PRIMARY KEY,
	title text NOT NULL,
	body text,
	user_id int NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE IF NOT EXISTS tracks (
	--id text PRIMARY KEY,
	title text NOT NULL,
	body text,
	channel_id int NOT NULL
);

INSERT INTO users (email) 
VALUES ('hey@mail.com'), ('two@mail.com'), ('person@hotmail.com');

INSERT INTO channels (title, user_id) 
VALUES ('Radio 123', 1), ('Boogie 24/7', 2), ('Rapid Radio', 3);
