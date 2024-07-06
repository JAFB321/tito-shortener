/** Retornable/Throwable response for api gateway */
export class Response {
  constructor({ statusCode, data, message }) {
    this.statusCode = statusCode
    this.body = JSON.stringify({ message: message, data })
    this.headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  }
}

export class Ok extends Response {
  constructor(data, message = 'Success') {
    super({ statusCode: 200, data, message: message })
  }
}

export class NotFound extends Response {
  constructor(data, message = 'Not Found') {
    super({ statusCode: 404, data, message })
  }
}

export class BadRequest extends Response {
  constructor(data, message = 'Error has ocurred') {
    super({ statusCode: 400, data, message })
  }
}

export class InternalServerError extends Response {
  constructor(data, message = 'Error has ocurred') {
    super({ statusCode: 500, data, message })
  }
}
