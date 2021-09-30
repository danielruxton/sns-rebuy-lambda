require("dotenv").config();
const nodeFetch = require("node-fetch");
// const url = 'http://checkip.amazonaws.com/';
let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
console.log("Spinning up...");

  let authHeaders = {
    Authorization: "",
    Accept: "*/*",
    "Content-Type": "application/json",
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
  };

  const authBody = {
    username: process.env.PIM_USERNAME,
    password: process.env.PIM_PASSWORD,
    grant_type: "password",
  };

  async function akeneoLogin(fetch = nodeFetch) {
    const url = `${process.env.PIM_URL}/api/oauth/v1/token`;
    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.PIM_base64ClientIdSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authBody),
    })
      .then((res) => {
        if (res.status === 200) return res.json();
      })
      .then((json) => {
        {
          console.log("Successfully authenticated for PIM.");
          const auth = "Bearer " + json.access_token;
          authHeaders.Authorization = auth;
        }
      })
      .catch((err) => {
        console.log(
          `Error: unable to authenticate with PIM, 
          ${err}`
        );
      });
  }

  const updateEnableOnAkeneo = async (styleCodes) => {
    if (!styleCodes || styleCodes.length < 1)
      return console.log("No Styles found. Aborting updates.");
    // get akeneo token

    styleCodes.forEach((style) => {
      // run an update to enable on every product
      const url = `${process.env.PIM_URL}/products/${style}`
      fetch(url, {
          method: "PATCH",
          headers: authHeaders,
          body: JSON.stringify({ enabled: true }),
      });
    });
    
    exports.lambdaHandler = async (event, context, callback) => {
        if (event.Records[0].Sns.Message)
    };
  };
