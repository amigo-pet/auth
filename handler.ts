import { Handler, APIGatewayEvent } from 'aws-lambda';
import { oauth } from "./src/api/oauth"
import { TAuthRequest, TCodeRequest } from "./src/types"

export const sendCodeAuth: Handler = async (event: APIGatewayEvent) => {

  if (!event.body) {
    return {
      statusCode: 400,
      body: {
        error: "No request body founded !"
      },
    }
  }
  try {

    const { phone_number, connection } = JSON.parse(event.body) as TAuthRequest

    const { data } = await oauth.post("/passwordless/start", {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      connection,
      phone_number,
      send: "code"
    })

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(data)
    }

  } catch (error) {
    return {
      error: error.response.data
    }
  }
}

export const validadeCode: Handler = async (event: APIGatewayEvent) => {

  if (!event.body) {
    return {
      statusCode: 400,
      body: {
        error: "No request body founded !"
      },
    }
  }

  const { code, connection, phone_number } = JSON.parse(event.body) as TCodeRequest

  try {
    const { data } = await oauth.post("/oauth/token", {
      grant_type: "http://auth0.com/oauth/grant-type/passwordless/otp",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      otp: code,
      realm: connection,
      username: phone_number
    })

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(data)
    }

  } catch (error) {
    return {
      error: error.response.data
    }
  }
}