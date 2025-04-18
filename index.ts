import ical from 'ical-generator';

// Read calendar URL from environment variable

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return await eventHandler(env);
  }
};

interface Env {
  URL: string;
}

async function eventHandler(env: Env) {
  const data = await fetch(env.URL);
  let response = await gatherResponse(data);

  const finalResponse = new Response(response);
  finalResponse.headers.set('cache-control', 's-maxage=86400'); // 1 day
  finalResponse.headers.set('content-type', 'text/calendar; charset=UTF-8');
  finalResponse.headers.set('content-disposition', 'inline');

  return finalResponse;
}

async function gatherResponse(data: Response) {
  // Reads the response as JSON
  const json = await data.json();

  // Create a new calendar
  const calendar = ical({
    prodId: '-//PhishNetIcal',
    name: 'Phish',
    description: 'Upcoming Phish & Side Project Shows',
    timezone: 'America/New_York'
  });

  // For each show, create an event
  json.data.forEach((show: any) => {
    // Create a new event
    calendar.createEvent({
      summary: show.artist_name,
      location: `${show.venue} ${show.city}, ${show.state}`,
      // url: show.permalink,
      id: show.showid,
      start: new Date(`${show.showyear}-${show.showmonth}-${show.showday}`),
      allDay: true,
    });
  });

  // Return the calendar as a string
  return calendar.toString();
}
