const superagent = require("superagent");
require("dotenv").config();

module.exports = class TwitchAPI {
  // Public Functions
  static async makeRequest(token, username) {
    try {
      return await superagent
        .get(`https://api.twitch.tv/helix/users?login=${username}`)
        .set("client-id", `${process.env.TWITCH_CLIENT_ID}`)
        .set("Authorization", `Bearer ${token}`);
    } catch (err) {
      console.error(err);
      throw new Error("There was a problem fetching data from the Twitch API");
    }
  }

  // Twicht API Functions
  static async getToken() {
    try {
      const clientId = process.env.TWITCH_CLIENT_ID;
      const clientSecret = process.env.TWITCH_CLIENT_SECRET;
      const url = `https://id.twitch.tv/oauth2/token`;
      const params = {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
        scope: "user:read:email",
      };
      const res = await superagent.post(url).send(params);
      return res.body.access_token;
    } catch (err) {
      console.error(err);
      throw new Error(
        "There was a problem fetching a token from the Twitch API"
      );
    }
  }
  static async getUserInfo(token, username) {
    try {
      const res = await this.makeRequest(token, username);
      return res.body.data[0].id;
    } catch (err) {
      console.error(err);
    }
  }
  static async getUserPicture(token, username) {
    try {
      const res = await this.makeRequest(token, username);
      return res.body.data[0].profile_image_url;
    } catch (err) {
      console.error(err);
    }
  }

  static async getStream(token, userID) {
    try {
      const res = await superagent
        .get(`https://api.twitch.tv/helix/streams?user_id=${userID}`)
        .set("client-id", `${process.env.TWITCH_CLIENT_ID}`)
        .set("Authorization", `Bearer ${token}`);
      return res.body.data;
    } catch (err) {
      console.error(err);
    }
  }
};
