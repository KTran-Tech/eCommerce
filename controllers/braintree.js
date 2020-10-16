const User = require('../models/user');
const braintree = require('braintree');
require('dotenv').config();

//we need to connect to braintree first
const gateway = new braintree.BraintreeGateway({
  //when you change this to the live server change the 'Sandbox' to 'Production'
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

//generate a token
exports.generateToken = (req, res) => {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(response);
    }
  });
};

//process the payment
exports.processPayment = (req, res) => {
  // 'nonce' is the payment method (card type, card number)
  let nonceFromTheClient = req.body.paymentMethodNonce;
  //the total amount sent back to user
  let amountFromTheClient = req.body.amount;
  //charge
  let newTransaction = gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    (error, result) => {
      if (error) {
        res.status(500).json(error);
      } else {
        res.json(result);
      }
    }
  );
};
