import { Resource } from "sst";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient();
const tableName = Resource["new-table"].name;

const putItem = async (data) => {
  const putParams = {
    TableName: tableName,
    Item: data,
    ConditionExpression: "attribute_not_exists(id)",
  };

  const response = await client.send(new PutCommand(putParams));
  return response;
};

const getItem = async (id) => {
  const params = {
    TableName: tableName,
    Key: { id },
  };
  const response = await client.send(new GetCommand(params));
  return response.Item;
};

export const handler = async (event) => {
  const method = event.requestContext.http.method;
  const path = event.rawPath;
  const body = event.body ? JSON.parse(event.body) : {};
  const queryParam = event.queryStringParameters;

  let output: any = "filtered";
  if (path === "/item" && method === "POST") {
    output = await putItem(body);
  }

  if (path === "/item" && method === "GET") {
    const { id } = queryParam;
    output = await getItem(id);
  }

  return output;
};
