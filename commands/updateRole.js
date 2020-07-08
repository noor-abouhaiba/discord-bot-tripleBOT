const Discord = require("discord.js");

//!updateRole {user id} {role}
module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("MANAGE_ROLES"))
        return message.reply("`Invalid entry: you do not have the required permissions to update the role of users.`");

    if (message.mentions.users.size > 1)
        return message.channel.send(`Invalid entry: cannot update multiple users.`);

    else if (message.mentions.users.size === 0)
        return message.channel.send(" `Invalid entry: invalid target user specified.` ");

    let new_role = args[1];

    let role = message.guild.roles.cache.find(role => role.name === new_role);
    if (!role)
        return message.channel.send(`Requested role **${new_role}** does not exist.`);

    let user_info = message.guild.member(message.mentions.users.first());
    await user_info.roles.add(role);
};

module.exports.help = {
    name: "updateRole"
};