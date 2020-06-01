Playing around with SQL with Radio4000 as an example.


THE DATABASE

- `r4.db` is a sqlite3 database
- `seed.sql` contains the SQL statements to create the database tables and seed them with test data
- `radio4000-export.json` is a full snapshot of our Firebase database for testing

To populate the database, do:

1. `sqlite3 r4.db`
2. sqlite> `.read seed.sql`

To export results of SQL queries as .csv, do:

```
sqlite3 r4.db
sqlite> .headers on
sqlite> .mode csv
sqlite> .once db.csv
sqlite> SELECT * FROM channels;
cat db.csv
```

THE SERVER

- `index.js` is a node.js API server

To run the server, run `npm install` once followed by `node .`.

It supports the following endpoints:

- GET /users
- GET /users/:id
- GET /channels
- GET /channels/:id


TIPS FOR USING JQ

To find tracks by channel, do
	jq '.tracks | to_entries | .[] | select(.value.channel == "-JXHtCxC9Ew-Ilck6iZ8")' radio4000-export.json
