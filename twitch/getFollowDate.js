const Discord = require("discord.js");
const botconfig = require("./../config/botConfig.json");
const twitch_config =  require("./../config/twitchConfig.json");
const rp = require('request-promise');
const db_config = require("./../config/dynamo-db-config");
const AWS = require("aws-sdk");
const ONE_YEAR = (1000 * 60 * 60 * 24) * 365;

AWS.config.update({
    region  : db_config.region,
    endpoint: db_config.endpoint
});

const docClient = new AWS.DynamoDB.DocumentClient();
const table = "USERS";

async function updateFollowRole (discordID, followInfo) {
    const followDate = new Date(followInfo);
    const today = new Date();
    const diffTime = Math.abs(today - followDate);

    let diffYears =(Math.floor(diffTime / ONE_YEAR));
    console.log(parseInt(diffYears) + " YEARS");

    //TODO:
    //WRECKnation guild id: 107106811714220032
    //test-server guild id: 696909516976947201

    const guild = bot.guilds.cache.get("696909516976947201");

    let user = guild.members.cache.get(discordID);
    console.log("FOUND THIS USER IN GUILD FROM DISCORDID: " + user);

    if (diffYears > 0) {
        try {
            let role = message.guild.roles.cache.find(role => role.name[0] === new_role[0]);
            if (role) {
                user.roles.add(role);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}

async function getFollowInfo(discordID, twitchID) {

    const uri = 'https://api.twitch.tv/kraken/users/' + twitchID + '/follows/channels/' + '71092938';// + twitch_config.channel_id;

    rp({
        uri: uri,
        headers: {
            'Client-ID': "36kyqe73a4ufbwi1e15jhorwvoamz5",
            'Accept': "application/vnd.twitchtv.v5+json"
        },
        json: true
    }).then( async function (resp) {
        // Add resp.created_at to map[userID].followDate
        try {
            console.log("DISCORDID: " + discordID);
            console.log("RESP DATE: " + resp.created_at);

            let params = {
                TableName: table,
                Key: {
                    "discordID": discordID
                },
                Item: {

                }
            };

            let result = await docClient.get(params).promise();

            console.log("RESULT 1: " + JSON.stringify(result.Item, null, 2));
            if (result) {
                console.log("FOUND: " + result.Item.discordID);
                params = {
                    TableName: table,
                    Key: {
                        "discordID": discordID,
                    },
                    Item: {
                        "username": result.Item.username,
                        "discordID": result.Item.discordID,
                        "discordHash": result.Item.discordHash,
                        "followDate": resp.created_at,
                        "twitch": result.Item.twitch,
                        "twitchID": result.Item.twitchID
                    }
                };
            }
            await docClient.put(params).promise();

            console.log("RESULT 1-2: " + JSON.stringify(await docClient.get(params).promise(), null, 2));
            // await updateFollowRole.js(result.Item.discordID, resp.created_at);
        }
        catch (e) {
            console.log(e);
        }
    });
}

// Get user's follow date using their ID and Discord linked connections
module.exports.run = async (discordID, twitchID) => {
    console.log("PASSED IN twitchID: " + twitchID);
    await getFollowInfo(discordID, twitchID);
};

module.exports.help = {
    name: "getFollowDate"
};