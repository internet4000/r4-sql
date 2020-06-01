DROP TABLE users;
DROP TABLE channels;
DROP TABLE tracks;

CREATE TABLE IF NOT EXISTS users (
	id text PRIMARY KEY,
	email text UNIQUE,
	createdAt int,
	channel_id int
);

CREATE TABLE IF NOT EXISTS channels (
	id text PRIMARY KEY,
	title text NOT NULL,
	createdAt int,
	body text,
	user_id int,
	FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS tracks (
	id text PRIMARY KEY,
	title text NOT NULL,
	body text,
	url text,
	createdAt int,
	channel_id int NOT NULL
);

/* INSERT INTO users (email) */ 
/* VALUES ('hey@mail.com'), ('two@mail.com'), ('person@hotmail.com'); */

/* INSERT INTO channels (id, title, user_id) */ 
/* VALUES ('one', 'Radio 123', 1), ('two', 'Boogie 24/7', 2), ('three', 'Rapid Radio', 3); */
