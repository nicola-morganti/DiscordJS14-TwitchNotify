const {EmbedBuilder, ButtonBuilder, ButtonStyle} = require('discord.js')

module.exports = class Config {
    static getButton (StreamURL) {
        const button = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL(StreamURL)
            .setLabel("Watch Stream")
        return button
    }
    static getEmbed (StreamURL, StreamTitle ,GameName, ThumbnailURL, ViewerCount, UserName, ProfilePicture) {
        const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setTitle(`${StreamTitle}`)
            .setDescription(`**Game**\n${GameName}\n\n**Viewers**\n${ViewerCount}`)
            .setImage(ThumbnailURL)
            .setAuthor({name: `${UserName}`})
            .setThumbnail(ProfilePicture)
        return embed
    }
}