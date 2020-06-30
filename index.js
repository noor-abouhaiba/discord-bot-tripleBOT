const botconfig = require("./config/botConfig.json");
const tokenconfig = require("./config/token.json");
const Discord = require("discord.js");

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
const fs = require("fs");
const path = require("path");

const commands_path = path.join(__dirname, "commands");
const utility_path = path.join(__dirname, "utility");
const twitch_path = path.join(__dirname, "twitch");

const modules = ["commands", "utility", "twitch"];

console.log("Commands filepath: " + commands_path);
console.log("Utility filepath: " + utility_path);
console.log("Utility filepath: " + twitch_path);

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

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online`);
    bot.user.setActivity("with WRECKnation");

    //TODO:
    //WRECKnation guild id: 107106811714220032
    //test-server guild id: 696909516976947201
    const guild = bot.guilds.cache.get("696909516976947201");
    const role = guild.roles.cache.find(role => role.name === "tripleBOT");
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
    } else if (command.charAt(0) === prefix) {
        message.channel.send("`Invalid command: command does not exist.`");
    }
});

bot.login(tokenconfig.token);