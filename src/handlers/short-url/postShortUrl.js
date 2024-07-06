'use strict'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { PutCommand, GetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { Ok, BadRequest, InternalServerError } from '../../shared/utils/responses.js'
import { TABLES } from '../../shared/const/resources.js'
import { getBody } from '../../shared/utils/events.js'
import { UrlID } from '../../shared/url-id/v1.js'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

export const handler = async (event) => {
  const { url } = getBody(event)
  if (!url) return new BadRequest(undefined, 'Missing url')

  const currentId = UrlID.fromNumber(await getCurrentId())
  if (!currentId) return new InternalServerError()

  const nextId = await getNextId(currentId)

  await docClient.send(
    new PutCommand({
      TableName: TABLES.SHORT_URLS,
      ConditionExpression: 'attribute_not_exists(urlId)',
      Item: {
        urlId: nextId.getString(),
        url,
      },
    })
  )
  await docClient.send(
    new PutCommand({
      TableName: TABLES.CURRENT_ID,
      Item: {
        version: 'v1',
        currentId: nextId.getNumber(),
      },
    })
  )

  return new Ok({ urlId: nextId.getString() })
}

async function getCurrentId() {
  const response = await docClient.send(
    new GetCommand({
      TableName: TABLES.CURRENT_ID,
      Key: {
        version: 'v1',
      },
      ProjectionExpression: 'currentId',
    })
  )

  return response.Item?.currentId || 1
}

/**
 * @param {UrlID} currentId
 */
async function getNextId(currentId) {
  for (let i = 0; i < 100; i++) {
    currentId = currentId.next()
    const alreadyExists = await idExists(currentId)

    if (!alreadyExists) return currentId
  }

  throw new InternalServerError('Could not find next ID')
}

/**
 * @param {UrlID} id
 */
async function idExists(id) {
  console.log('Checking if ID exists:', id.getNumber())
  const response = await docClient.send(
    new GetCommand({
      TableName: TABLES.SHORT_URLS,
      Key: {
        urlId: id.getString(),
      },
      ProjectionExpression: 'urlId',
    })
  )

  return !!response.Item
}
