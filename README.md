# Phishcal

This is a Phish calendar built on top of Cloudflare Workers and the Phish.net API.

## Add to your calendar

Add https://phishcal.saewitz.com as a new Calendar Subscription to Calendar on Mac or iOS.

## Running yourself

Set the URL env var to:

```
vars = {URL = "https://api.phish.net/v5/shows.json?apikey=YOURKEY&order_by=showdate&direction=desc&limit=100"}
```
