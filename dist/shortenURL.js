import AWS from 'aws-sdk';
import { nanoid } from 'nanoid';
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = 'ShortenedURLsTable';
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
    'Access-Control-Allow-Methods': 'OPTIONS,POST'
};
export const handler = async (event) => {
    // Handle OPTIONS requests for CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: ''
        };
    }
    const body = JSON.parse(event.body || '{}');
    const longURL = body.longURL;
    if (!longURL) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Missing longUrl' })
        };
    }
    const shortCode = nanoid(6); // Generate a unique short code
    await dynamoDB.put({
        TableName: tableName,
        Item: { shortCode, longURL },
    }).promise();
    return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ shortURL: `http://uurl.duckdns.org/${shortCode}` })
    };
};
