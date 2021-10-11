import { calendar_v3, google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Create a calendar google api client
export function createCalendarClient(
  OAuth2Client: OAuth2Client,
  refreshToken: string | null | undefined
): calendar_v3.Calendar {
  OAuth2Client.setCredentials({
    refresh_token: refreshToken
  });

  const calendar = google.calendar({
    version: 'v3',
    auth: OAuth2Client
  });

  return calendar;
}

// Get all the events from the calender
export async function getEvents(calendar: calendar_v3.Calendar) {
  const events = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  });
  console.log(events.data.items);
  return events.data.items;
}

var eventStartTime = new Date();
eventStartTime.setDate(eventStartTime.getDate() + 1);
// eventStartTime.setHours(eventStartTime.getHours() + 2);

var eventEndTime = new Date();
eventEndTime.setDate(eventEndTime.getDate() + 1);
eventEndTime.setMinutes(eventEndTime.getMinutes() + 45);

const event = {
  summary: 'message',
  description: 'ADDED by google bot',
  start: {
    dateTime: eventStartTime.toISOString(),
    timeZone: 'Asia/Kolkata'
  },
  end: {
    dateTime: eventEndTime.toISOString(),
    timeZone: 'Asia/Kolkata'
  },
  reminders: {
    useDefault: false,
    overrides: [
      { method: 'email', minutes: 2 * 24 * 60 },
      { method: 'popup', minutes: 60 }
    ]
  },
  colorId: '2'
};

// insertEvent(initalSetup(), event);

// insert a new event to the calender
async function insertEvent(
  calendar: {
    events: {
      insert: (arg0: {
        calendarId: string | undefined;
        resource: {
          summary: any; // returns the calender object
          description: any;
          location: any;
          start: { dateTime: any };
          end: { dateTime: any };
        };
      }) => any;
    };
  },
  event: {
    summary: any;
    description: any;
    start: any;
    end: any;
    reminders?: {
      useDefault: boolean;
      overrides: { method: string; minutes: number }[];
    };
    colorId?: string;
    location?: any;
  }
) {
  const { summary, description, location, start, end } = event;

  const eventData = {
    summary,
    description,
    location,
    start: {
      dateTime: start
    },
    end: {
      dateTime: end
    }
  };

  const res = await calendar.events.insert({
    calendarId: process.env.CALENDAR_ID,
    resource: eventData
  });

  return res.data;
}

// insert a new event to the calender
export async function insertEventCalender(calender: calendar_v3.Calendar) {
  const eventData = {
    summary: 'message',
    description: 'ADDED by google bot',
    start: {
      dateTime: eventStartTime.toISOString(),
      timeZone: 'Asia/Kolkata'
    },
    end: {
      dateTime: eventEndTime.toISOString(),
      timeZone: 'Asia/Kolkata'
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 2 * 24 * 60 },
        { method: 'popup', minutes: 60 }
      ]
    },
    colorId: '2'
  };

  const res = await calender.events.insert({
    calendarId: 'primary',
    requestBody: eventData
  });

  return res.data;
}
