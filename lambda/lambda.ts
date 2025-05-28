export default async (event, context) => {
    const BASE_URL: string | undefined = process.env.KC_BASE_URL
    const REALM: string | undefined = process.env.KC_REALM
    const HOST: string | undefined = `${BASE_URL}/realms/${REALM}/protocol/openid-connect/token`

    try {

        if (!event.body) {
            throw new Error("Request body is null or undefined")
        }

        // Decodificar base64 si es necesario
        let rawBody = event.body
        if (event.isBase64Encoded) {
            rawBody = Buffer.from(event.body, 'base64').toString('utf-8')
        }

        // Parsear JSON
        const parsedBody = JSON.parse(rawBody)
        const { client_id, client_secret } = parsedBody

        if (!client_id || !client_secret) {
            throw new Error("Missing client_id or client_secret in request body")
        }

        // Enviar request a Keycloak
        const response = await fetch(HOST, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
                client_id,
                client_secret
            }).toString()
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Error response from Keycloak:', errorText)
            throw new Error(`Unable to fetch access token: ${response.status} - ${errorText}`)
        }

        const keycloakResponse = await response.json()
        return {
            statusCode: 200,
            body: JSON.stringify(keycloakResponse)
        }

    } catch (error: any) {
        console.error('Error processing request:', error)
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error processing request',
                details: error.message,
                stack: error.stack
            })
        }
    }
}