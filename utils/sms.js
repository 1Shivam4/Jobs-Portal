const twilio = require('twilio');

const account_sid = process.env.TWILLIO_SID;
const authToken = process.env.TWILLIO_AUTH;
const client = twilio(account_sid, authToken);

const createMessage = async function (msg, number) {
  const message = await client.messages.create({
    body: msg,
    from: process.env.TWILLIO_NUMBER,
    to: number,
  });

  console.log(message.body);
};

module.exports = createMessage;
