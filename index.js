const botconfig = require("./config/botConfig.json");
const tokenconfig = require("./config/token.json");
const Discord = require("discord.js");

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.utility = new Discord.Collection();
bot.aliases = new Discord.Collection();
const fs = require("fs");
const path = require("path");

const commands_path = path.join(__dirname, "commands");
const utility_path = path.join(__dirname, "utility");
const twitch_path = path.join(__dirname, "twitch");
const connections_path = path.join(__dirname, "connections");
const dynamodb_path = path.join(__dirname, "connections/dynamo-db");

let user_map = new Map();

console.log("Commands filepath: \t" + commands_path);
console.log("Utility filepath: \t" + utility_path);
console.log("Twitch filepath: \t" + twitch_path);
console.log("Connections filepath: \t" + connections_path);
console.log("DynamoDB filepath: \t" + dynamodb_path);

// Load commands directory .js files
fs.readdir(commands_path, (err, files) => {
    if (err)
        console.log(err);

    let js_file = files.filter(f => f.split(".").pop() === "js");
    console.log(js_file);
    if (js_file.length <= 0) {
        console.log("Could not locate commands directory.");
        return;
    }
    let props;
    js_file.forEach((f, i) => {
        props = require(`./commands/${f}`);
        console.log(`${f} loaded.`);
        bot.commands.set(props.help.name, props);
    });
});

// Load utility directory .js files
fs.readdir(utility_path, (err, files) => {
    if (err)
        console.log(err);

    let js_file = files.filter(f => f.split(".").pop() === "js");
    console.log(js_file);
    if (js_file.length <= 0) {
        console.log("Could not locate utility directory.");
        return;
    }
    let props;
    js_file.forEach((f, i) => {
        props = require(`./utility/${f}`);
        console.log(`${f} loaded.`);
        bot.commands.set(props.help.name, props);
    });
});

// Load twitch directory .js files
fs.readdir(twitch_path, (err, files) => {
    if (err)
        console.log(err);

    let js_file = files.filter(f => f.split(".").pop() === "js");
    console.log(js_file);
    if (js_file.length <= 0) {
        console.log("Could not locate twitch directory.");
        return;
    }
    let props;
    js_file.forEach((f, i) => {
        props = require(`./twitch/${f}`);
        console.log(`${f} loaded.`);
        bot.commands.set(props.help.name, props);
    });
});

// Load connections directory .js files
fs.readdir(connections_path, (err, files) => {
    if (err)
        console.log(err);

    let js_file = files.filter(f => f.split(".").pop() === "js");
    console.log(js_file);
    if (js_file.length <= 0) {
        console.log("Could not locate connections directory.");
        return;
    }
    let props;
    js_file.forEach((f, i) => {
        props = require(`./connections/${f}`);
        console.log(`${f} loaded.`);
        bot.commands.set(props.help.name, props);
    });
});

// Load connections/dynamo-db directory .js files
fs.readdir(dynamodb_path, (err, files) => {
    if (err)
        console.log(err);

    let js_file = files.filter(f => f.split(".").pop() === "js");
    console.log(js_file);
    if (js_file.length <= 0) {
        console.log("Could not locate connections/dynamo-db directory.");
        return;
    }
    let props;
    js_file.forEach((f, i) => {
        props = require(`./connections/dynamo-db/${f}`);
        console.log(`${f} loaded.`);
        bot.utility.set(props.help.name, props);
    });
});

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online`);
    bot.user.setActivity("with WRECKnation");

    //TODO:
    //WRECKnation guild id: 107106811714220032
    //test-server guild id: 696909516976947201
    // const guild = bot.guilds.cache.first();
    const guild = bot.guilds.cache.get("696909516976947201");
    // const role = guild.roles.cache.find(role => role.name === "tripleBOT");
    // gets all members in the server
    // guild.members.fetch().then( function (resp) {
    //     console.log(resp);
    // });
    (await guild.members.fetch()).forEach(member => {
        user_map.set(member.user.id, {username: member.user.username, discriminator: member.user.discriminator});
    });

    bot.utility.get("setup-table-entries").run(bot, user_map);
    bot.commands.get("getLiveInfo").run(bot, guild);
    bot.commands.get("updateFollowRole").run(bot);
});

bot.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let prefix = botconfig.prefix;
    let messageBuffer = message.content.split(/ +/);

    let command = messageBuffer[0];
    let args = messageBuffer.slice(1);

    let command_file = bot.commands.get(command.slice(prefix.length));

    if (command_file) {
        command_file.run(bot, message, args);
    }
});

bot.on("guildMemberAdd", async member => {
    bot.utility.get("create-entry").run(bot, member);
});

bot.on("guildMemberRemove", async member => {
    bot.utility.get("delete-entry").run(bot, member);
});

bot.login(tokenconfig.token);