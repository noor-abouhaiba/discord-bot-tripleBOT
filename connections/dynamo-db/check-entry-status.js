const db_config = require("./../../config/dynamo-db-config");
const AWS = require("aws-sdk");

AWS.config.update({
    region  : db_config.region,
    endpoint: db_config.endpoint
});

const docClient = new AWS.DynamoDB.DocumentClient();

// Return whether or not given user info is in the DB
module.exports.run = async (params) => {
    let exists = false;

    let result = await docClient.get(params).promise();
    if (result !== null && result.Item !== null && result.Item !== undefined) {
        exists = true;
    }

    return exists;
};

module.exports.help = {
    name: "check-entry-status"
};