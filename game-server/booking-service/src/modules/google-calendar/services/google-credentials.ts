import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleCalendarAuthService {
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  private credentialFilePath: string;
  private tokenPath: string;
  private readonly READONLY_SCOPES = ['https://www.googleapis.com/auth/calendar'];

  constructor() {
    this.credentialFilePath = path.resolve(__dirname, 'mapapis-4e3c0d064710.json');
    this.tokenPath = path.resolve(__dirname, 'token.json');
  }

  public async readCredentials(): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log(this.credentialFilePath.toString());

      fs.readFile(this.credentialFilePath.toString(), 'utf-8', (err, data) => {
        if (err) {
          return reject(err);
        }

        return this.authorize(JSON.parse(data), this.listEvents);
      });
    })
  }

  private async authorize(credentials, callback) {
    const { private_key, client_id } = credentials;
    const oAuth2Client = new google.auth.OAuth2(client_id);

    const accessToken = await oAuth2Client.getAccessToken();
    console.log(accessToken);

    /* // Check if we have previously stored a token.
    fs.readFile(this.tokenPath.toString(), 'utf-8', (err, token) => {
      if (err) {
        return this.getAccessToken(oAuth2Client, callback)
      };

      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    }); */
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  private getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline', // [TODO]: What does it mean?
      scope: this.READONLY_SCOPES,
    });

    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) {
          return console.error('Error retrieving access token', err);
        }

        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(this.tokenPath, toString(), JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', this.tokenPath.toString());
        });

        callback(oAuth2Client);
      });
    });
  }

  /**
   * Lists the next 10 events on the user's primary calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  private listEvents(auth) {
    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) {
        return console.log('The API returned an error: ' + err);
      }

      const events = res.data.items;

      if (events.length) {
        console.log('Upcoming 10 events:');
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          console.log(`${start} - ${event.summary}`);
        });
      } else {
        console.log('No upcoming events found.');
      }
    });
  }
}
