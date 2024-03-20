//Requires
const { Client, GatewayIntentBits, ActionRowBuilder } = require('discord.js');
const TwitchAPI = require('./classes/twitch-api');
const Config = require('./config/config');
require('dotenv').config();

//Variables
let twitchtoken = ""
let twitchuserid = ""
let online = false
let pic = ""


//Bot
const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ],
});


client.login(process.env.TOKEN);
(async function() {
    twitchtoken = await TwitchAPI.getToken();
    twitchuserid = await TwitchAPI.getUserInfo(twitchtoken, process.env.TWITCH_USERNAME);
    pic = await TwitchAPI.getUserPicture(twitchtoken, process.env.TWITCH_USERNAME);
})();

setInterval(async function () {
    twitchtoken = await TwitchAPI.getToken();
    twitchuserid = await TwitchAPI.getUserInfo(twitchtoken, process.env.TWITCH_USERNAME);
    pic = await TwitchAPI.getUserPicture(twitchtoken, process.env.TWITCH_USERNAME);
}, 86400000);

setInterval(async function () {
    const data = await TwitchAPI.getStream(twitchtoken, twitchuserid);
    if (data.length > 0) {
        if(!online) {
            online = true
            const btn = await Config.getButton("https://www.twitch.tv/" + process.env.TWITCH_USERNAME);
            const embed = await Config.getEmbed(`https://www.twitch.tv/${process.env.TWITCH_USERNAME}`, data[0].title, data[0].game_name, data[0].thumbnail_url.replace('{width}', '1920').replace('{height}', '1080'), data[0].viewer_count, data[0].user_name, pic)
            const row = await new ActionRowBuilder().addComponents(btn);
            const channel = client.channels.cache.get(process.env.STREAM_ANNOUNCE_ID);
            if (!channel) {
                console.error('Kanal nicht gefunden.');
                return;
            }

            await channel.send({embeds: [embed], components: [row], content: `@everyone`});
        }
    }else {
        online = false;
    }
}, 1000 * 10);
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
})