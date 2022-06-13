const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const moment = require("moment");
const stripe = require("stripe")(
  "sk_test_51IbuHCL3SLhyon2BZHIq3t6skUe7CCj3lkPHXKf2WhYejy3b04uHVa8V7kUt63HyYT2JF1pBxwwJUvHWLtkZBMUD003P9BQ2hh"
);

const port = 4000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());

app.post("/pay", async (req, res) => {
  const { email } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 5000,
    currency: "usd",
    // Verify your integration in this guide by including this parameter
    metadata: { integration_check: "accept_a_payment" },
    receipt_email: email,
  });

  res.json({ client_secret: paymentIntent["client_secret"] });
});

app.get("/sub", async (req, res) => {
  let date = moment().add(30, "seconds").unix();
  console.log(date);
  // const { email, payment_method } = req.body;
  const result = await stripe.paymentMethods.create({
    type: "card",
    card: {
      number: "4242424242424242",
      exp_month: 5,
      exp_year: 2028,
      cvc: "304",
    },
    // billing_details: {
    //   email: "fatima.naseer@argonteq.com",
    // },
  });
  console.log("payment zaid", result);

  // if (result.error) {
  //   console.log(result.error.message);
  // } else {
  //   console.log("payment zaid", result);
  //   const customer = await stripe.customers.create({
  //     payment_method: result.id,
  //     email: "momin123a@argonteq.com",
  //     invoice_settings: {
  //       default_payment_method: result.id,
  //     },
  //   });
  //   console.log("customer zaid", customer);
  //   const subscription = await stripe.subscriptions.create({
  //     customer: customer.id,
  //     items: [{ price: "price_1KdX0WL3SLhyon2BPhw4NUCC" }],
  //     expand: ["latest_invoice.payment_intent"],
  //     // trial_period_days: 14,
  //     // trial_end: date,
  //   });
  //   console.log("subscription zaid", subscription);
  // }
  // const status = subscription["latest_invoice"]["payment_intent"]["status"];
  // const client_secret =
  //   subscription["latest_invoice"]["payment_intent"]["client_secret"];

  // res.json({ client_secret: client_secret, status: status });
  // const customer1 = await stripe.customers.retrieve("cus_LHVyiE8twGQCz9");
  res.json({ message: "trail started" });
});

app.get("/ret", async (req, res) => {
  // const subscription = await stripe.subscriptions.retrieve({
  //   customer: cus_LFhHegCXaRMxXe,
  // });
  // const customer = await stripe.customers.retrieve("cus_LHUTKTm5dy8WUW");

  const paymentMethods = await stripe.paymentMethods.list({
    customer: "cus_LKvIO9JwgNpInY",

    type: "card",
  });
  res.send(paymentMethods);
  // const { email, payment_method } = req.body;
});

app.get("/change", async (req, res) => {
  // const subscription = await stripe.subscriptions.retrieve({
  //   customer: cus_LFhHegCXaRMxXe,
  // });
  const subscription = await stripe.subscriptions.retrieve(
    "sub_1KavX7FL5gvYRAuDstWzT3fc"
  );
  const sub = await stripe.subscriptions.update(
    "sub_1KavX7FL5gvYRAuDstWzT3fc",
    {
      cancel_at_period_end: false,

      items: [
        {
          id: subscription.items.data[0].id,
          price: "price_1KaZO5FL5gvYRAuDZkTQbEks",
        },
      ],
      proration_behavior: "create_prorations",
    }
  );
  res.send(sub);
  // const { email, payment_method } = req.body;
});
app.get("/cancel", async (req, res) => {
  // const subscription = await stripe.subscriptions.retrieve({
  //   customer: cus_LFhHegCXaRMxXe,
  // });
  const subscription = await stripe.subscriptions.del(
    "sub_1KavX7FL5gvYRAuDstWzT3fc",
    // { invoice_now: true }
    { invoice_now: true, prorate: true }
  );
  console.log(subscription);
  res.send(subscription);
  // const { email, payment_method } = req.body;
});
app.get("/cardChange", async (req, res) => {
  // const result = await stripe.paymentMethods.create({
  //   type: "card",
  //   card: {
  //     number: "4242424242424242",
  //     exp_month: 5,
  //     exp_year: 2028,
  //     cvc: "304",
  //   },
  //   // billing_details: {
  //   //   email: "fun6@argonteq.com",
  //   // },
  // });
  // if (result.error) {
  //   console.log(result.error.message);
  // } else {

  const paymentMethods = await stripe.paymentMethods.list({
    customer: "cus_LHUHzibcKHx8dU",
    type: "card",
  });
  console.log(paymentMethods.data[0].id);

  const paymentMethod = await stripe.paymentMethods.detach(
    paymentMethods.data[0].id
  );
  const result = await stripe.paymentMethods.create({
    type: "card",
    card: {
      number: "4242424242424242",
      exp_month: 5,
      exp_year: 2028,
      cvc: "304",
    },
    // billing_details: {
    //   email: "fun6@argonteq.com",
    // },
  });
  const create = await stripe.paymentMethods.attach(result.id, {
    customer: "cus_LHUHzibcKHx8dU",
  });
  res.json(create);
  // }
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
