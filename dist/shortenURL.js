import AWS from 'aws-sdk';
import { nanoid } from 'nanoid';
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = 'ShortenedURLsTable';
export const handler = async (event) => {
    const body = JSON.parse(event.body || '{}');
    const longURL = body.longURL;
    if (!longURL) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing longUrl' }) };
    }
    const shortCode = nanoid(6); // Generate a unique short code
    await dynamoDB.put({
        TableName: tableName,
        Item: { shortCode, longURL },
    }).promise();
    return {
        statusCode: 200,
        body: JSON.stringify({ shortURL: `http://uurl.duckdns.org/${shortCode}` })
    };
};
