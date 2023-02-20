const ICAL = require('ical.js');

//read calendar URL from environment variable
const url = URL;

addEventListener('fetch', (event) => {
  return event.respondWith(eventHandler());
});

async function eventHandler() {
  const data = await fetch(url);
  let response = await gatherResponse(data);
  response = new Response(response);
  response.headers.set('cache-control', 's-maxage=86400'); // 1 day
  response.headers.set('content-type', 'text/calendar; charset=UTF-8');
  response.headers.set('content-disposition', 'inline');

  return response;
}

async function gatherResponse(data) {
  //reads the icalendar URL as text
  const json = await data.json();

  //define new vcalendar to construct to
  const newvcal = new ICAL.Component(['vcalendar', [], []]);
  newvcal.updatePropertyWithValue('prodid', '-//PhishNetIcal');
  newvcal.updatePropertyWithValue('x-wr-calname', 'Phish');
  newvcal.updatePropertyWithValue('x-wr-caldesc', 'Upcoming Phish Shows');
  newvcal.updatePropertyWithValue('x-wr-timezone', 'America/New_York');
  console.log(newvcal);

  //for each vevents, filter the holiday events only
  json.data.forEach((show) => {
    const vevent = new ICAL.Component('vevent'),
      event = new ICAL.Event(vevent),
      valarm = new ICAL.Component('valarm');

    // Set standard properties
    event.summary = `${show.artist_name}`;
    event.location = `${show.venue} ${show.city}, ${show.state}`;
    event.url = show.permalink;
    event.uid = show.showid;
    event.startDate = ICAL.Time.fromData({
      isDate: true,
      year: +show.showyear,
      month: +show.showmonth,
      day: +show.showday,
    });

    vevent.addSubcomponent(valarm);

    // Add the new component
    newvcal.addSubcomponent(vevent);
  });

  //return the new vcalendar as a string
  return newvcal.toString();
}
