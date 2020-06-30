const Discord = require("discord.js");
const botconfig = require("./../config/botConfig.json");
const apiapiUrl = "https://api.twitch.tv/kraken";
const rp = require('request-promise');
const _ = require('lodash');

// DynamoDB for database work
let channel_id = '';
let stream_info = '';
let live_info = '';
let embed_image = '';
let user = '';
let liveNotif = false;
let live_channel;


//TODO: Change to tripleWRECK from xqcOW
function obtainID(message) {
    rp({
        uri: 'https://api.twitch.tv/kraken/users?login=xqcOW',
        headers: {
            'Client-ID': botconfig.client_id,
            'Accept': botconfig.twitch_api
        },
        json: true
    }).then( function (resp) {
        console.log(resp);
        channel_id = resp.users[0]._id;
        embed_image = resp.users[0].logo;
        user = resp.users[0].display_name;
        console.log(channel_id);
        obtainStreamInfo(message);
    });
}

function buildLiveEmbed(message, title, game) {
    formatTime();

    let liveEmbed = new Discord.MessageEmbed()
        .setAuthor(user)
        .setDescription(`${user} just went live!`)
        .setColor("#ff0000")
        .setTitle(title)
        .addFields(
            {name: "Playing", value: game, inline:true},
            {name: "Started at", value: live_info, inline:true}
        )
        .setImage(embed_image)
        .setURL(`https://twitch.tv/${user}`)
        .setFooter(user, embed_image);

    live_channel.send(liveEmbed);
}

// TODO: Move live_channel.send to below method, add check to see if text channel has a previous message, if it does do not send a new one
// TODO: if it doesnt have one send it,
function sendLiveNotification() {
    if (!liveNotif) {

    }
}

function deleteLiveNotification() {

}

function obtainStreamInfo(message) {
    message.channel.send(`channel id: ${channel_id}`);
    const uri = 'https://api.twitch.tv/kraken/streams/' + channel_id;
    message.channel.send(uri);
    rp({
        uri: uri,
        // uri: 'https://api.twitch.tv/kraken/streams/71092938',
        headers: {
            'Client-ID': botconfig.client_id,
            'Accept': botconfig.twitch_api
        },
        json: true
    }).then( function (resp) {
        console.log(resp);
        stream_info = resp.stream;
        if (!stream_info) {
            console.log("stream offline");
            // deleteLiveNotification();
            // check if a message exists, if it does delete it
        } else {
            console.log("stream is online :)");
            live_info = resp.stream.created_at;

            console.log("game: " + resp.stream.game);
            console.log("status: " + resp.stream.channel.status);
            console.log("live info: " + live_info);

            buildLiveEmbed(message, resp.stream.channel.status, resp.stream.game);
            // sendLiveNotification();
            // Check if a message has been sent, if not then send one
        }
    });
}

function formatTime() {
    // Trim the date from the live info
    live_info = live_info.split("T");
    live_info = live_info.pop();

    // Trim the final irrelevant character from the result
    live_info = live_info.substr(0, live_info.length-1);

    let time = live_info.split(":");
    let hour = parseInt(time[0]);

    // 12 hour format the time
    if (hour > 12) {
        hour -= 12;
        time[2] =  `${time[2]}pm`;
    }else {
        time[2] = `${time[2]}am`;
    }

    // Create new string using the formatted time
    live_info = `${hour}:${time[1]}:${time[2]}`;
}
function getOauth() {
    rp({
        uri: 'https://api.twitch.tv/kraken/channels/' + channel_id + "/subscriptions",
        headers: {
            'Client-ID': botconfig.client_id,
            'Accept': botconfig.twitch_api,
            'Authorization': 'https://discordapp.com/api/oauth2/authorize?client_id=696885663714377758&permissions=8&scope=bot'
        },
        json: true
    }).then( function (resp) {
        console.log(resp);
    });
}

function obtainSubs() {
    rp({
        uri: 'https://api.twitch.tv/kraken/channels/' + channel_id + "/subscriptions",
        headers: {
            'Client-ID': botconfig.client_id,
            'Accept': botconfig.twitch_api,
            'Authorization': 'https://discordapp.com/api/oauth2/authorize?client_id=696885663714377758&permissions=8&scope=bot'
        },
        json: true
    }).then( function (resp) {
        console.log(resp);
    });
}

function checkLiveStatus() {
    obtainStreamInfo();
}

function leadingZero(num){
    return (num < 10) ? ("0" + num) : num;
}

function postLog(msg, err) {
    var date = new Date();
    var h = leadingZero(date.getHours());
    var m = leadingZero(date.getMinutes());
    var s = leadingZero(date.getSeconds());

    console.log("[" + h + ":" + m + ":" + s + "]", msg);
    if (err) {
        console.log(err);
    }
}

module.exports.run = (bot, message, args) => {
    live_channel = message.guild.channels.cache.find(channel => channel.name === "live-now");
    obtainID(message);
    // obtainID();
    // setInterval(function() { checkLiveStatus() }, 60000);
};

module.exports.help = {
    name: "getLiveInfo"
};