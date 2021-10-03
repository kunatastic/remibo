import { TokenModel } from "../../models/TokenModel";

// If a user exists, return the user
export async function userExists(discordId: string) {
  try {
    const user = await TokenModel.findOne({ discordId });
    console.log(user);
    return user;
  } catch (e) {
    console.log(e);
    return null;
  }
}
