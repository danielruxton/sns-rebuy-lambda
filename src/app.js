require("dotenv").config();
const axios = require("axios");
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
exports.lambdaHandler = async (event, context, callback) => {
  console.log("Checking recieved message is valid:");
  try {
    var message = event.Records[0].Sns.Message;
    console.log("Message received from SNS:", message);
    console.log(event.Records[0].Sns);
    callback(null, "Success");
  } catch (err) {
    console.log(err);
    return err;
  }

  return response;

  const akeneoLogin = async (username, password) => {};

  const updateEnableOnAkeneo = async (styleCodes) => {
    if (!styleCodes || styleCodes.length < 1)
      return console.log("No Styles found. Aborting updates.");
    // get akeneo token

    styleCodes.forEach((style) => {
      // run an update to enable on every product
      axios.post(process.env.PIMURL, {});
    });
  };
};
