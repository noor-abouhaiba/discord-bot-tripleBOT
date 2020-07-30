const Discord = require("discord.js");
const botconfig = require("./../config/botConfig.json");
const twitch_config =  require("./../config/twitchConfig.json");
const rp = require('request-promise');


async function obtainID(user) {
    const uri = 'https://api.twitch.tv/kraken/users?login=' + user;
    rp({
        uri: uri,
        headers: {
            'Client-ID': "36kyqe73a4ufbwi1e15jhorwvoamz5",
            'Accept': "application/vnd.twitchtv.v5+json"
        },
        json: true
    }).then( function (resp) {
        let userID = resp.users[0]._id;
        console.log(userID);
        getFollowInfo(userID);
    });
}

async function getFollowInfo(userID) {

    // GET DIFFERENCE BETWEEN 2 DATES (USED TO CHECK YEARS)
    // const date1 = new Date('7/13/2010');
    // const date2 = new Date('12/15/2010');
    // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // console.log(diffDays + " days");

    const uri = 'https://api.twitch.tv/kraken/users/' + userID + '/follows/channels/' + twitch_config.channel_id;

    rp({
        uri: uri,
        headers: {
            'Client-ID': "36kyqe73a4ufbwi1e15jhorwvoamz5",
            'Accept': "application/vnd.twitchtv.v5+json"
        },
        json: true
    }).then( function (resp) {
        // Add resp.created_at to map[userID].followDate
        try {
            console.log(resp);
        }
        catch (e) {
            console.log(e);
        }
    });
}

// Get user's follow date using their ID and Discord linked connections
module.exports.run = async (bot, guild, userInfo) => {
    await obtainID("enfrno");
};

module.exports.help = {
    name: "getFollowDate"
};