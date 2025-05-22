# external-sso-lambda

## Steps:

- Run `npm install` to generate node_modules folder.
- Run `npm trigger-apigateway-event` to test API gateway lambda locally With a mocked JSON.
- Run `npm run zip` to zip build into .zip
- After generate the folder with the libs, create a zip file with all content of repository including libraries.
- Rename the file with the value `lambda_function_payload.zip`