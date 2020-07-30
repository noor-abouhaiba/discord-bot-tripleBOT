const DiscordStrategy = require('passport-discord').Strategy;
const botConfig = require('./../../../config/botConfig');
const passport = require('passport');
const db_config = require("./../../../config/dynamo-db-config");
const AWS = require("aws-sdk");

// TODO?????
const dbAPI = require("./../../dynamo-db/create-entry");

let params = "";
AWS.config.update({
    region  : db_config.region,
    endpoint: db_config.endpoint
});

const docClient = new AWS.DynamoDB.DocumentClient();
const table = "USERS";

passport.serializeUser((user, done) => {
    console.log("Serializing");
    done(null, user.Item.discordID);
});

passport.deserializeUser(async (id, done) => {
    console.log("Deserializing");
    let result = await docClient.get(params).promise();
    if (result) {
        done(null, result);
    }

});

passport.use(new DiscordStrategy({

    // TODO SWAP TO .ENV FILE (process.env.CLIENT_ID), move botCONFIG TO ENV FILE
    clientID: botConfig.bot_client_id,
    clientSecret: botConfig.client_secret,
    callbackURL: process.env.CLIENT_REDIRECT,
    scope: ['identify', 'connections', 'guilds']
}, async (accessToken, refreshToken, profile, done) => {
    params = {
        TableName: table,
        Key: {
            "discordID": profile.id
        },
        Item: {
            "username": profile.username,
            "discordID": profile.id,
            "followDate": "",
            "twitch": "",
            "twitchID": ""
        }
    };

    try {
        // check if user exists in guild, if yes then update their entry with their twitch id
        globalUserProfile = profile;
        console.log("PROFILE: " + profile + " " + profile.avatar);
        profile.guilds.forEach(guild => {
            // TODO: CHANGE GUILD ID TO MATCH CORRECT SERVER
           if (guild.id === '696909516976947201') {
               globalGuildFound = "VERIFIED";
               console.log(guild);
           }
        });

        profile.connections.forEach(connection => {
            if (connection.type === "twitch") {
                globalTwitchConnection = connection;
                console.log(connection);
            }
        });
        // TODO: TO UPDATE ENTRY DO THIS
            //await docClient.put(params).promise();

        let result = await docClient.get(params).promise();

        if (result) {
            // console.log(result.Item.username + " " + result.Item.userID + " " + result.Item.followDate);
            // console.log(profile.connections);
            done(null, result);
        }
        else {
            done(null, profile);
        }
    }
    catch (err) {
        console.log(err);
        done(err, null);
    }
}));