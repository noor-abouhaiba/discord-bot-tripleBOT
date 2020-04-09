const Discord = require("discord.js");
const botconfig = require("./../config/botConfig.json");

module.exports.run = async (bot, message, args) => {
    if (!botconfig.log_channel)
        message.send(args);
};

module.exports.help = {
    name: "setup"
};