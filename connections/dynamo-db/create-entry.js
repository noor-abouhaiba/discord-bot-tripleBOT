const db_config = require("./../../config/dynamo-db-config");
const AWS = require("aws-sdk");

AWS.config.update({
    region  : db_config.region,
    endpoint: db_config.endpoint
});

function getDate() {
    const date = new Date();

    return (`[` + `${leadingZero(date.getMonth()+1)}/${leadingZero(date.getDate())}/${date.getFullYear()} `
        + `${leadingZero(date.getHours())}:${leadingZero(date.getMinutes())}:${leadingZero(date.getSeconds())} PST] `);
}

function leadingZero(num){
    return (num < 10) ? ("0" + num) : num;
}

const docClient = new AWS.DynamoDB.DocumentClient();
const table = "USERS";

// check if user exists, if exists, stop, else add
module.exports.run = async (bot, member) => {
    const username = member.user.username;
    const user_id = member.user.id;

//  TODO: UPDATE FOLLOWDATE WITH OAUTH2 INFO
    const params = {
        TableName: table,
        Key: {
            "username": username,
            "userID": user_id
        },
        Item: {
            "username": username,
            "userID": user_id,
            "followDate": "07/23/15"
        }
    };

    let entryExists = await bot.utility.get("check-entry-status").run(params);

    if (entryExists === false) {
        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log(`\n${getDate()} \n(guildMemberAdd Signal) Added new singleton item entry to DB: 
                            ${JSON.stringify(params, null, 2)}`);
            }
        });
    }
};

module.exports.help = {
    name: "create-entry"
};