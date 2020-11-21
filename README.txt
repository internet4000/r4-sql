WHAT IS THIS

Playing around with SQL with Radio4000 as an example.
This repo contains a database, a migration from firebase to sql, and a node API server.


THE DATABASE

- r4.json is a full snapshot of our Firebase database for testing (pull a fresh copy with `run-script export-live-db`)
- r4.sqlite is the sqlite3 database
- schema.sql defines the database tables

To run the schema on the database, do:

1. sqlite3 r4.sqlite
2. sqlite> .read schema.sql

Use https://sqlitebrowser.org/ to inspect the database cross-platform.


THE MIGRATION

migration.js runs through the Firebase json db in r4.json and inserts it into the r4.sqlite.
Note that is takes a long time with all the tracks.

node migration.js


THE SERVER

- `index.js` is a node.js API server

To run the server, run `npm install` once followed by `node .`

It supports the following endpoints:

- GET /users
- GET /users/:id
- GET /channels
- GET /channels/:id


TIPS 

Find tracks by channel with jq, do:
	jq '.tracks | to_entries | .[] | select(.value.channel == "-JXHtCxC9Ew-Ilck6iZ8")' r4.json

To export results of SQL queries as .csv, do:
	sqlite3 r4.sqlite
	sqlite> .headers on
	sqlite> .mode csv
	sqlite> .once db.csv
	sqlite> SELECT * FROM channels;
	cat r4.csv

