const Discord = require("discord.js");
const botconfig = require("./../config/botConfig.json");
const rp = require('request-promise');
const _ = require('lodash');

// DynamoDB for database work
let channel_id = '';
let stream_info = '';
let live_info = '';
let embed_image = '';
let user = '';
let live_channel;
let live_embed;


//TODO: Change to tripleWRECK from xqcOW
function obtainID() {
    rp({
        uri: 'https://api.twitch.tv/kraken/users?login=xqcOW',
        headers: {
            'Client-ID': botconfig.client_id,
            'Accept': botconfig.twitch_api
        },
        json: true
    }).then( function (resp) {
        channel_id = resp.users[0]._id;
        embed_image = resp.users[0].logo;
        user = resp.users[0].display_name;
        obtainStreamInfo();
    });
}

function buildLiveEmbed(title, game) {
    const date = new Date(live_info);
    let liveTime = `${leadingZero(date.getHours())}:${leadingZero(date.getMinutes())}:${leadingZero(date.getSeconds())} PST`;

    live_embed = new Discord.MessageEmbed()
        .setAuthor(user)
        .setDescription(`${user} just went live!`)
        .setColor("#ff0000")
        .setTitle(title)
        .addFields(
            {name: "Playing", value: game, inline:true},
            {name: "Started at", value:liveTime, inline:true}
        )
        .setImage(embed_image)
        .setURL(`https://twitch.tv/${user}`)
        .setFooter(user, embed_image);
}

function getDate() {
    const date = new Date();

    return (`[` + `${leadingZero(date.getMonth()+1)}/${leadingZero(date.getDate())}/${date.getFullYear()} `
        + `${leadingZero(date.getHours())}:${leadingZero(date.getMinutes())}:${leadingZero(date.getSeconds())} PST] `);
}

function sendLiveNotification(resp) {
    if (!live_channel.lastMessage) {
        console.log(getDate() + `${user} is online`);

        live_info = resp.stream.created_at;
        buildLiveEmbed(resp.stream.channel.status, resp.stream.game);
        live_channel.send(live_embed);
    }
}

function deleteLiveNotification() {
    if (live_channel.lastMessage) {
        console.log(getDate() + `${user} is offline`);

        live_channel.lastMessage.delete();
    }}

function obtainStreamInfo() {
    const uri = 'https://api.twitch.tv/kraken/streams/' + channel_id;
    rp({
        uri: uri,
        headers: {
            'Client-ID': botconfig.client_id,
            'Accept': botconfig.twitch_api
        },
        json: true
    }).then( function (resp) {
        stream_info = resp.stream;
        if (!stream_info) {
            deleteLiveNotification();
        } else {
            sendLiveNotification(resp);
        }
    });
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

module.exports.run = (bot, guild) => {
    live_channel = guild.channels.cache.find(channel => channel.name === "live-now");
    obtainID();
    setInterval(function() { checkLiveStatus() }, 60000);
};

module.exports.help = {
    name: "getLiveInfo"
};