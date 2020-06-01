/*
 Running this file with node takes the local radio4000-export.json database,
 and migrates it to a r4.db sqlite3 database. See db.js.

	If it fails, run this inside `sqlite3 r4.db`: `.read seed.sql` to reset the db.
*/

const fs = require('fs')
const db = require('./db.js')

// Enable this to run the script without modifying the database.
let dryRun = false

// Load our local JSON database. This is what we want to migrate.
const jsonDb = JSON.parse(fs.readFileSync('radio4000-export.json'))
const count = (key) => Object.keys(jsonDb[key]).length

console.log('Migrating JSON database to r4.db.')
console.log('Make some coffee with an amigo. It will take at least 5 mins...')
console.log({users: count('users'), channels: count('channels'), tracks: count('tracks')})

// This is supposed to make it faster.
db.run('PRAGMA journal_mode = WAL;')

// Can also use db.serialize
db.parallelize(function() {
	// 1. Insert users
	// I don't think we need to keep userSettings (user.settings)
	var statement = db.prepare("INSERT INTO users (id, createdAt, channel_id) VALUES (?, ?, ?)")
	for (let [id, data] of Object.entries(jsonDb.users)) {
		// console.log(id, data)
		const channelId = data.channels && Object.keys(data.channels)[0] || null
		if (!dryRun) statement.run(id, data.created, channelId)
	}
	statement.finalize()
	
	// 3. Insert channels
	// 3.1. Merge channelPublics into channels. channelPublics = channel, followers
	for (let [id, data] of Object.entries(jsonDb.channelPublics)) {
		if (data.followers) {
			jsonDb.channels[data.channel].followers = data.followers
		}
	}
	var statement = db.prepare("INSERT INTO channels (id, title) VALUES (?, ?)")
	for (let [id, data] of Object.entries(jsonDb.channels)) {
		// console.log(id, data)
		if (!dryRun) statement.run(id, data.title)
		// @todo body, channelPublic, created, updated, coordinatesLatitude, coordinateLongitude, favoriteChannels, image, slug, isFeatured, isPremium, tracks, followers (merged from channelPublic)
	}
	statement.finalize()

	// Log where we are at with the tracks insert, because it takes forever.
	let logCount = 0
	function log() {
		logCount++
		console.log(`${logCount}/${count('tracks')}`)
	}

	// 4. tracks created, title, url, ytid, channel, body
	var statement = db.prepare("INSERT INTO tracks (id, title, url, body, createdAt, channel_id) VALUES (?, ?, ?, ?, ?, ?)")
	for (let [id, data] of Object.entries(jsonDb.tracks)) {
		if (!data.channel) continue
		// console.log(id, data)
		if (!dryRun) statement.run(id, data.title, data.url, data.body, data.created, data.channel)
		log()
	}
	statement.finalize()
})

db.close()

