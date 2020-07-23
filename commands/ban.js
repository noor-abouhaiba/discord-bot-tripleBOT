const Discord = require("discord.js");

// !ban {@username} {OPT:reason}
module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("BAN_MEMBERS"))
        return message.reply("`Invalid entry: you do not have the required permissions to ban users.`");

    if (!message.mentions.users.size)
        return message.reply("`Invalid entry: no target user specified.`");

    let ban_user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

    if (ban_user.id === bot.user.id) {
        let emote = message.guild.emojis.cache.find(emoji => emoji.name === "tripleHYPERJOY");
        return message.react(emote);
    }

    if (!message.member.hasPermission("BAN_MEMBERS"))
        return message.channel.send("`Unable to ban target user.`");

    if (message.member.hasPermission("BAN_MEMBERS") && ban_user.hasPermission("BAN_MEMBERS" || "ADMINISTRATOR"))
        return message.channel.send(`Command conflict: Target user shares same role precedence as **<@${message.author.id}>**`);

    if (!ban_user)
        return message.channel.send("`Target user not found.`");

    let ban_reason = args.join(" ").slice(22);

    if (!ban_reason)
        ban_reason = "*No given reason.*";

    let ban_embed = new Discord.MessageEmbed()
        .setDescription("**Ban Instance Log**")
        .setColor("#ff0000")
        .addField("user:", `${ban_user} with ID **${ban_user.id}**`)
        .addField("banned by:", `<@${message.author.id}> with ID **${message.author.id}**`)
        .addField("on:", message.createdAt)
        .addField("with reason:", ban_reason);

    let ban_channel = message.guild.channels.cache.find(channel => channel.name === "incidents");

    if (!ban_channel)
        return message.channel.send("`Unable to find log channel.`");

    message.guild.member(ban_user).ban();
    return ban_channel.send(ban_embed);
};

module.exports.help = {
    name: "ban"
};