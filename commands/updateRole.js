const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let user = args[0];
    let new_role = args[1];

    user = message.guild.members.get(args[0]);
};

module.exports.help = {
    name: "updateRole"
};