#!/usr/bin/env node

import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from 'node-fetch';

const args = minimist(process.argv.slice(2));

if (args.h) {
  console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.`);
  process.exit(0);
}

if (args.n) {
	var latitude = args.n;	
}
else if (args.s) {
	var latitude = args.s * -1;	
}
else {
 	process.exit(0);
}



if (args.e) {
        var longtitude = args.e;
}
else if (args.w) {
        var longtitude = args.w * -1;
}
else {
        process.exit(0);
}

if (args.z) {
	var timezone = args.z;
}
else {
	var timezone = moment.tz.guess();
}

if (typeof(args.d) !== 'undefined') {
	var day = args.d;
}
else {
	var day = 1;
}

const API_URL = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longtitude + "&daily=precipitation_hours&current_weather=true&timezone=" + timezone;


const response = await fetch(API_URL);
const data = await response.json();

if (args.j) {
    console.log(JSON.stringify(data, null, 2));
    process.exit(0);
}

if (data.daily.precipitation_hours[day] > 0) {
	process.stdout.write("You might need your galoshes ");
}
else {
	process.stdout.write("You probably won't need your galoshes ");
}

if (day < 0.1) {
  console.log("today.")
} else if (day > 1) {
  console.log("in " + day + " days.")
} else {
  console.log("tomorrow.")
}

