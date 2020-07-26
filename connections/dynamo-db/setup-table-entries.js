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

// Check if the current user exists in the DB, if not add them, else stop
async function checkAndAddEntry(bot, key, value) {

//  TODO: UPDATE FOLLOWDATE WITH OAUTH2 INFO
    const params = {
        TableName: table,
        Key: {
            "username": value,
            "userID": key
        },
        Item:{
            "username": value,
            "userID": key,
            "followDate" : "07/23/15"
        }
    };
    let entryExists = await bot.utility.get("check-entry-status").run(params);

    if (entryExists === false) {
        docClient.put(params, function (err, data) {
            if (err) {
                console.error(`\n${getDate()} \nUnable to add item. Error JSON:`, JSON.stringify(err, null, 2));
            } else {
                console.log(`\n${getDate()} \nAdded item entry for user (${value}) : ${JSON.stringify(params, null, 2)}`);
            }
        });
    }
}

module.exports.run = async (bot, user_map) => {
    let userInfo = await bot.utility.get("fetch-existing-entries").run();

    console.log(`\n${getDate()}  \nRunning DB table setup on application startup...`);

    console.log(`\n${getDate()} \n(SETUP) INITIAL TABLE (${userInfo.size}) :`);
    userInfo.forEach((function(user) {
        console.log(user);
    }));
    user_map.forEach(function(value, key) {
        checkAndAddEntry(bot, key, value);
    });
};

module.exports.help = {
    name: "setup-table-entries"
};