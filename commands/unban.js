const Discord = require("discord.js");
const idRegex = /^(?:<@!?)?(\d+)>?$/;

let unban_user = '';
let unban_reason = '';

function checkSenderPerms(message) {
    if(!message.member.hasPermission("BAN_MEMBERS"))
        return message.reply("`**Invalid entry**: you do not have the required permissions to unban users.`");
}

function parseMessage (bot, message, args) {
    //Where 18 is the length in characters of the user id, input must be at least as large in size
    unban_user = args[0];

    if (unban_user === bot.user.id) {
        let emote = message.guild.emojis.cache.find(emoji => emoji.name === "tripleHYPERJOY");
        return message.react(emote);
    }

    unban_reason = args.slice(1).join(` `);
}

function createDiscordEmbed(message) {
    let unban_embed = new Discord.MessageEmbed()
        .setDescription("**Unban Instance Log**")
        .setColor("#ff0000")
        .addField("user:", `${unban_user.user.username} with ID **${unban_user.user.id}**`)
        .addField("unbanned by:", `<@${message.author.id}> with ID **${message.author.id}**`)
        .addField("on:", message.createdAt)
        .addField("with reason:", unban_reason);

    let unban_channel = message.guild.channels.cache.find(channel => channel.name === "incidents");

    if (!unban_channel)
        return message.channel.send("`Unable to find log channel.`");

    unban_channel.send(unban_embed);
}

function unban(message, args) {
    // console.log("in unban and unban_user: " + unban_user);
    if (unban_user) {
        // message.channel.send("user: " + unban_user);
        // message.channel.send("reason: " + unban_reason);
        if (!unban_reason) unban_reason = "*No given reason.*";

        // Check if it's a user ID
        if (idRegex.test(unban_user)) {
            try { message.guild.fetchBans()
                .then(bans => {
                    if (bans.some(u => u.user.username.includes(u.user.username))) {
                        unban_user = bans.find(user => user.user.id === unban_user);
                        console.log("unbanning user: " + unban_user);
                        message.guild.members.unban(unban_user.user.id, unban_reason).then(r => console.log(r), createDiscordEmbed(message) );
                    }
                    else if (bans.some(u => unban_user.user.username.includes(u.user.id))) {
                        message.guild.members.unban(unban_user.user.id, unban_reason).then(r => createDiscordEmbed(message));
                    }
                    else {
                        return message.channel.send(`user **${args[0]}** is not banned.`);
                    }
                });
            }
            catch (err) { return message.channel.send(`Could not locate user **${args[0]}** from ID argument.`); }
        }
    } else {
        return message.channel.send("`No users found. Please specify a User ID.`");
    }
}
//!unban {user id} {OPT:reason}
module.exports.run = async (bot, message, args) => {
    checkSenderPerms(message);
    parseMessage(bot, message, args);
    unban(message, args);
};

module.exports.help = {
    name: "unban"
};