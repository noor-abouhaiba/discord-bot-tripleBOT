const DiscordStrategy = require('passport-discord').Strategy;
const botConfig = require('./../../../config/botConfig');
const passport = require('passport');
const db_config = require("./../../../config/dynamo-db-config");
const AWS = require("aws-sdk");
const storeTwitchFollow = require('./../../../twitch/getFollowDate');

let user = require('./../routes/profiletest');

let params = "";
AWS.config.update({
    region  : db_config.region,
    endpoint: db_config.endpoint
});

const docClient = new AWS.DynamoDB.DocumentClient();
const table = "USERS";

passport.serializeUser((user, done) => {
    console.log("Serializing");
    console.log("CHECK " + JSON.stringify(user, null, 2));
    try {
        done(null, user.Item.discordID);
    }
    catch (err) {
        console.log(err);
        done(null, user.id);
    }
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
            "discordHash": profile.discriminator,
            "followDate": "",
            "twitch": "",
            "twitchID": ""
        }
    };

    try {
        user.userProfile = profile;
        // check if user exists in guild, if yes then update their entry with their twitch id
        console.log("PROFILE: " + profile + " " + profile.avatar);
        profile.guilds.forEach(guild => {
            // TODO: CHANGE GUILD ID TO MATCH CORRECT SERVER
           if (guild.id === '696909516976947201') {
               user.guildFound = "VALID";
               console.log(guild);
           }
        });

        let connectionToParse = "NOT SYNCED";
        profile.connections.forEach(connection => {
            if (connection.type === "twitch") {
                connectionToParse = connection;
            }
        });
        let result = null;

        if (connectionToParse !== "NOT SYNCED") {
            params.Item.twitch = connectionToParse.name;
            params.Item.twitchID = connectionToParse.id;

            await docClient.put(params).promise();

            let twitchID = params.Item.twitchID;
            console.log("BEFORE CALLING TWITCHID IS: " + twitchID);

            await storeTwitchFollow.run(profile.id, twitchID);

            result = await docClient.get(params).promise();

            console.log("RESULT 2: " + JSON.stringify(result.Item, null, 2));

            user.twitchConnection = connectionToParse;
            user.twitchFollowDate = result.Item.followDate;
        }
        else {
            params.Item.twitch = params.Item.twitchID = params.Item.followDate ="NOT SYNCED";
            user.twitchConnection = {
                name: "NOT SYNCED"
            };
        }

        await docClient.put(params).promise();

        result = await docClient.get(params).promise();

        if (result) {
            // console.log("RESULT AFTER UPDATING DB: " + result.Item.twitch, + " : " + result.Item.twitchID + " : " + result.Item.followDate);
            done(null, result);
        }
        else {
            done(null, profile);
            // done(null, profile);
        }
    }
    catch (err) {
        console.log(err);
        done(err, null);
    }
}));