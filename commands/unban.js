const Discord = require("discord.js");
const idRegex = /^(?:<@!?)?(\d+)>?$/;

module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("BAN_MEMBERS"))
        return message.reply("**Invalid entry**: you do not have the required permissions to unban users.");


    //Where 18 is the length in characters of the user id, input must be at least as large in size
    let unban_user = args[0];

    if (unban_user === bot.user.id)
        return message.channel.send(`<:tripleHYPERJOY:662460620356190259>`);

    let unban_reason = args.slice(1).join(` `);

    if (unban_user) {
        message.channel.send("user: " + unban_user);
        message.channel.send("reason: " + unban_reason);
        if (!unban_reason) unban_reason = "*No given reason.*";

        // Check if it's a user ID
        if (idRegex.test(unban_user)) {
            try { message.guild.fetchBans()
                .then(bans => {
                    if (bans.some(u => u.user.username.includes(u.user.username))) {
                        unban_user = bans.find(user => user.user.id === unban_user);
                        console.log(unban_user);
                        message.guild.members.unban(unban_user.user.id, unban_reason);
                    }
                    else if (bans.some(u => unban_user.user.username.includes(u.user.id))) {
                        message.guild.members.unban(unban_user.user.id, unban_reason);
                    }
                    else {
                        return message.channel.send(`user **${args[0]}** is not banned.`);
                    }
                });
            }
            catch (err) { return message.channel.send(`Could not locate user **${args[0]}** from ID argument.`); }
        }
    } else {
        return message.channel.send(`No users found. Please specify a User ID.`);
    }
    //TODO: fix unban and ban "invalid command" error after ban is executed
    let unban_embed = new Discord.MessageEmbed()
        .setDescription("**Unban Instance Log**")
        .setColor("#ff0000")
        //TODO: Instance log holds ID in place of username(unban_user), and undefined in place of ID(unban_user.id)
        .addField("user:", `${unban_user} with ID **${unban_user.id}**`)
        .addField("unbanned by:", `<@${message.author.id}> with ID **${message.author.id}**`)
        .addField("unbanned in:", message.channel)
        .addField("at time:", message.createdAt)
        .addField("with reason:", unban_reason);

    let unban_channel = message.guild.channels.cache.find(channel => channel.name === "incidents");

    if (!unban_channel)
        return message.channel.send("Unable to find log channel.");

    unban_channel.send(unban_embed);
};

module.exports.help = {
    name: "unban"
};