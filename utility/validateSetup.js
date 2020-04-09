const Discord = require("discord.js");
const botconfig = require("./../config/botConfig.json");
//TODO: replace instances of "incidents" channel with given log channel from botConfig.json
module.exports.run = async (bot, message, args) => {
    try {
        if (!botconfig.log_channel)
            return message.channel.send("Bot not properly configured, use command `!setup [log_channel]` before issuing commands");
        else
            return message.reply("Bot already configured.");
    } catch(e) {
        console.log(e);
    }
};

module.exports.help = {
    name: "validateSetup"
};