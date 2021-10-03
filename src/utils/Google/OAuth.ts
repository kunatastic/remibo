import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { TokenModel } from "../../models/TokenModel";

// Default calender scopes
const defaultScopes = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

// create google oauth config
export function createOAuthConfig() {
  return new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.OAUTH_REDIRECT_URL
  );
}

// get connection url
export const getConnectionUrl = (oauth2Client: OAuth2Client) => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: defaultScopes,
  });
};

// get the usersinfo from the token
export async function getUserInfo(
  oauth2Client: OAuth2Client,
  access_token: string | null | undefined
) {
  oauth2Client.setCredentials({ access_token });
  const oauth2 = google.oauth2({
    version: "v2",
    auth: oauth2Client,
  });
  const userInfo = await oauth2.userinfo.get();
  return userInfo;
}

// get the OAuth2Client from the DB
export async function createUserOAuth2Client(
  discordId: string
): Promise<OAuth2Client | null> {
  const UserExists = await TokenModel.findOne({ discordId });
  if (!UserExists) return null;
  const oauth2Client = createOAuthConfig();
  const { refresh_token } = UserExists;
  oauth2Client.setCredentials({ refresh_token });
  return oauth2Client;
}

// delete the users tokens from the db
export async function deleteUserOAuth2Token(
  discordId: string
): Promise<Boolean> {
  const deletedUser = await TokenModel.findOneAndDelete({ discordId });
  // console.log(deletedUser);

  if (deletedUser) return true;
  return false;
}
