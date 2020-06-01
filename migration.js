/*
 Running this file with node takes the local radio4000-export.json database,
 and migrates it to a sqlite3 database. 

	If it fails, run this inside `sqlite3 r4.sqlite`: `.read schema.sql` to reset the db.
*/

const fs = require('fs')
const sqlite3 = require('sqlite3')
const db = require('./db.js')
const jsonDb = JSON.parse(fs.readFileSync('r4.json'))

// Enable this to run the script without modifying the database.
let dryRun = false

// Log what's happening to the console.
const count = (key) => Object.keys(jsonDb[key]).length
console.log('Migrating JSON database to r4.sqlite.')
console.log('Make some coffee with an amigo. It will take at least 5 mins...')
console.log({users: count('users'), channels: count('channels'), tracks: count('tracks')})

// This is supposed to make it faster.
db.run('PRAGMA journal_mode = WAL;')

// Can also use db.serialize
db.parallelize(function() {
	// 1. Insert users
	var statement = db.prepare("INSERT INTO users (id, createdAt, channel_id) VALUES (?, ?, ?)")
	for (let [id, data] of Object.entries(jsonDb.users)) {
		// console.log(id, data)
		const channelId = data.channels && Object.keys(data.channels)[0] || null
		if (!dryRun) statement.run(id, data.created, channelId)
	}
	statement.finalize()
	
	// 2. Merge channelPublics into channels. channelPublics = channel, followers
	for (let [id, data] of Object.entries(jsonDb.channelPublics)) {
		if (data.followers) {
			jsonDb.channels[data.channel].followers = data.followers
		}
	}

	// 3. Insert channels
	var statement = db.prepare("INSERT INTO channels (id, createdAt, title, body, slug, image) VALUES (?, ?, ?, ?, ?, ?)")
	for (let [id, data] of Object.entries(jsonDb.channels)) {
		// console.log(id, data)
		if (!dryRun) statement.run(id, data.created, data.title, data.body, data.slug, data.image)
		// @todo channelPublic, created, updated, coordinatesLatitude, coordinateLongitude, favoriteChannels, image, slug, isFeatured, isPremium, tracks, followers (merged from channelPublic)
	}
	statement.finalize()

	// Log where we are at with the tracks insert, because it takes forever.
	let logCount = 0
	function log() {
		logCount++
		console.log(`${logCount}/${count('tracks')}`)
	}

	// 4. Insert tracks
	// var statement = db.prepare("INSERT INTO tracks (id, title, url, body, createdAt, channel_id) VALUES (?, ?, ?, ?, ?, ?)")
	// for (let [id, data] of Object.entries(jsonDb.tracks)) {
	// 	if (!data.channel) continue
	// 	// console.log(id, data)
	// 	if (!dryRun) statement.run(id, data.title, data.url, data.body, data.created, data.channel)
	// 	log()
	// }
	// statement.finalize()
})

db.close()

