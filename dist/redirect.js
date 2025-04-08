import AWS from 'aws-sdk';
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = 'ShortenedURLsTable';
export const handler = async (event) => {
    const shortCode = event.pathParameters?.shortCode;
    if (!shortCode) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing shortCode' }) };
    }
    const result = await dynamoDB.get({
        TableName: tableName,
        Key: { shortCode },
    }).promise();
    if (!result.Item) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Short URL not found' }),
        };
    }
    return {
        statusCode: 301,
        headers: {
            Location: result.Item.longURL,
        },
        body: JSON.stringify({ message: 'Redirecting...' }),
    };
};
