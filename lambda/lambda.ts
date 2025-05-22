import { APIGatewayProxyEvent, Context } from "aws-lambda"

export default async (event: APIGatewayProxyEvent, context: Context) => {

    try {
        // log the received event
        console.log('Received event:', JSON.stringify(event, null, 2))

        const maybeRequestBody: string | null = event.body

        // Check if the body is null
        if (maybeRequestBody === null) {
            throw new Error("Request body is null")
        }

        let parsedBody: any
        if (typeof maybeRequestBody === "string") {
            parsedBody = JSON.parse(maybeRequestBody)
        } else {
            parsedBody = maybeRequestBody
        }
        const { client_id, client_secret } = parsedBody

        console.log('client_id:', client_id)
        console.log('client_secret:', client_secret)

        const BASE_URL: string | undefined = process.env.KC_BASE_URL
        const PORT: string | undefined = process.env.KC_PORT
        const REALM: string | undefined = process.env.KC_REALM
        const HOST = `http://${BASE_URL}:${PORT}/realms/${REALM}/protocol/openid-connect/token`

        // use the correct Keycloak endpoint accessible from Lambda
        const response = await fetch(HOST, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
                client_id: client_id,
                client_secret: client_secret
            }).toString()
        })

        // Check if the response is ok
        if (!response.ok) {
            console.error('Error response from Keycloak:', response.statusText)
            throw new Error('Unable to fetch access token')
        }

        const keycloakResponse = await response.json()

        return {
            statusCode: 200,
            body: JSON.stringify(keycloakResponse)
        }

    } catch (error) {
        console.error('Error processing request:', error)
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error processing request' })
        }
    }
}