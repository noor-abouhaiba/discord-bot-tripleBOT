const db_config = require("./../../config/dynamo-db-config");
const AWS = require("aws-sdk");

AWS.config.update({
    region  : db_config.region,
    endpoint: db_config.endpoint
});

const docClient = new AWS.DynamoDB.DocumentClient();
const table = "USERS";

// Access DB and store all entries to a map, return map to caller
async function scanEntireTable() {

    let params = {
        TableName: table
    };

    let result = await docClient.scan(params).promise();
    let userInfo = new Map();

    console.log(result);
    result.Items.forEach(function(user) {
        userInfo.set(user.discordID, {discordID : user.discordID, username: user.username, discordHash: user.discordHash,
                                    twitch: user.twitch, twitchID: user.twitchID, followDate: user.followDate});
    });

    return userInfo;
}

module.exports.run = () => {

    return scanEntireTable();
};

module.exports.help = {
    name: "fetch-existing-entries"
};