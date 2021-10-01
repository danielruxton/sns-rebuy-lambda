require("dotenv").config();
const fetch = require("node-fetch");
const { exit } = require("process");

const { PIM_URL } = process.env;
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

async function akeneoLogin() {
  const url = `${PIM_URL}/api/oauth/v1/token`;
  console.log(`URL is: ${url}`);
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
        console.log("Successfully authenticated for Akeneo.");
        const auth = "Bearer " + json.access_token;
        authHeaders.Authorization = auth;
      }
    })
    .catch((err) => {
      console.log(
        `Error: unable to authenticate with Akeneo, 
          ${err}`
      );
      exit(1);
    });
}

const patchProductOnAkeneo = async (style) => {
  console.log(`Running update on: ${style}`);
  const url = `${process.env.PIM_URL}/products/${style}`;
  // check it exists

  // run the update on the product
  const test = await fetch(url, {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify({ enabled: true }),
  })
    .then((res) => {
      if (res.status !== 204) {
        console.log(`Could not update ${style}. Code: ${result.code}`);
        return;
      }
      console.log(`Succesfully updated ${style}`);
    })
    .catch((error) => console.log(error));
  console.log(test);
};

const updateEnableOnAkeneo = async (styleCodes) => {
  if (!styleCodes || styleCodes.length < 1)
    return console.log("No Styles found. Aborting updates.");
  // get akeneo token

  styleCodes.forEach(async (style) => {
    await patchProductOnAkeneo(style);
    console.log(test);
  });
};

exports.handler = async (event, context, callback) => {
  console.log("Getting token from akeneo...");
  await akeneoLogin();
  console.log("Handling PO Message from SNS - ");
  const listOfSkus = event.Records[0].Sns.Message.purchaseOrderLines.map(
    (line) => {
      return line.sku.split("-")[0];
    }
  );
  console.log("Sku's found: ");
  console.log(listOfSkus);
  await updateEnableOnAkeneo(listOfSkus);
  console.log("Finished.");
  context.succeed(event);
};
