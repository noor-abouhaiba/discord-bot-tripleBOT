const Discord = require("discord.js");

//!updateName {user id} {new nickname}
module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("MANAGE_NICKNAMES"))
        return message.reply("`Invalid entry: you do not have the required permissions to update the nickname of users.`");

    if (message.mentions.users.size > 1)
        return message.channel.send("`Invalid entry: cannot update multiple users.`");

    else if (message.mentions.users.size === 0)
        return message.channel.send("`Invalid entry: invalid target user specified.`");

    let user_info = message.guild.member(message.mentions.users.first());
    console.log(user_info);

    args = args.slice(1).join(" ");

    console.log(args);
    let nickname = args;
    console.log(nickname);
    if (!nickname)
        return message.channel.send("`Invalid nickname, input cannot be empty`");

    user_info.setNickname(nickname);
};

module.exports.help = {
    name: "updateName"
};