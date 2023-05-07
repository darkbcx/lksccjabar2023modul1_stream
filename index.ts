import * as AWS from 'aws-sdk'
import { Client } from '@opensearch-project/opensearch';
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';

export const handler = async function (event: any, context: any) {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const osDomain = '6foej5idtc2bpxbs4s8c.ap-southeast-1.aoss.amazonaws.com';
  const client = new Client({
    ...AwsSigv4Signer({
      region: process.env.AWS_REGION || 'us-east-1',
      service: 'aoss',
      getCredentials: () => {
        return new Promise((resolve, reject) => {
          AWS.config.getCredentials((err, credentials) => {
            if (err) {
              reject(err);
            } else {
              resolve(credentials!);
            }
          });
        })
      }
      ,
    }),
    node: `https://${osDomain}`, // OpenSearch domain URL
  });

  for (const record of event.Records) {
    console.log(record.eventID);
    console.log(record.eventName);
    const body = {
      id: record.dynamodb.NewImage.id.S,
      message: record.dynamodb.NewImage.message.S,
      title: record.dynamodb.NewImage.title.S,
    };
    console.log('DOCUMENT : ', body);
    const id = record.dynamodb.NewImage.id.S;
    const resp = await client.index({
      index: 'message',
      id,
      body
    })
  }
  return `Successfully processed ${event.Records.length} records.`;
}