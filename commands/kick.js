const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("KICK_MEMBERS"))
        return message.reply("**Invalid entry**: you do not have the required permissions to kick users.");

    if (!message.mentions.users.size)
        return message.reply("**Invalid entry**: no target user specified.");

    let kick_user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

    if (kick_user.id === bot.user.id) {
        let emote = message.guild.emojis.cache.find(emoji => emoji.name === "tripleHYPERJOY");
        return message.react(emote);
    }

    // message.channel.send(`author: <@${message.author.id}>`);
    // message.channel.send(`kick_user: <@${kick_user.id}>`);
    if (!message.member.hasPermission("KICK_MEMBERS"))
        return message.channel.send("Unable to kick target user.");

    if (message.member.hasPermission("KICK_MEMBERS") && kick_user.hasPermission("KICK_MEMBERS" || "ADMINISTRATOR"))
        return message.channel.send(`**Command conflict**: Target user shares same role precedence as <@${message.author.id}>`);

    if (!kick_user)
        return message.channel.send("Target user not found.");

    let kick_reason = args.join(" ").slice(22);

    if (!kick_reason)
        kick_reason = "*No given reason.*";

    let kick_embed = new Discord.MessageEmbed()
        .setDescription("**Kick Instance Log**")
        .setColor("#ff0000")
        .addField("user:", `${kick_user} with ID **${kick_user.id}**`)
        .addField("kicked by:", `<@${message.author.id}> with ID **${message.author.id}**`)
        .addField("kicked in:", message.channel)
        .addField("at time:", message.createdAt)
        .addField("with reason:", kick_reason);

    let kick_channel = message.guild.channels.cache.find(channel => channel.name === "incidents");

    if (!kick_channel)
        return message.channel.send("Unable to find log channel.");

    message.guild.member(kick_user).kick(kick_reason);
    kick_channel.send(kick_embed);
};

module.exports.help = {
    name: "kick"
};