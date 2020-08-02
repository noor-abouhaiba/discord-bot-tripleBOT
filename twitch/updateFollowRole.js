const db_config = require("./../config/dynamo-db-config");
const AWS = require("aws-sdk");

AWS.config.update({
    region  : db_config.region,
    endpoint: db_config.endpoint
});
const ONE_DAY = 1000 * 60 * 60 * 24;
const ONE_YEAR = 1000 * 60 * 60 * 24 * 365;

const docClient = new AWS.DynamoDB.DocumentClient();
const table = "USERS";

async function updateUser(bot, discordID, followInfo) {
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
    if (!user) {
        return;
    }

    console.log("FOUND THIS USER IN GUILD FROM DISCORDID: " + user);

    if (diffYears >= 1) {
        try {
            let role = guild.roles.cache.find(role => role.name[0] === diffYears.toString());
            if (role) {
                await user.roles.add(role);
            }
        } catch (e) {
            console.log(e);
        }
    }
}

async function updateFollowRole (bot) {
    let params = {
        TableName: table
    };
    console.log("CHECKING USERS FOR EGO ");

    let result = await docClient.scan(params).promise();
    console.log("FOUND USERS TO CHECK " + result.Count);

    result.Items.forEach(function(user) {
       if (user.followDate !== "NOT SYNCED" && user.followDate !== "") {
           console.log("USER FOUND TO UPDATE: " + user.username + " : " + user.followDate);
           updateUser(bot, user.discordID, user.followDate);
       }
    });
}

module.exports.run = async (bot) => {
    console.log("RUNNING EGO ROLE");
    setInterval(function() { updateFollowRole(bot) }, ONE_DAY);
};

module.exports.help = {
    name: "updateFollowRole"
};