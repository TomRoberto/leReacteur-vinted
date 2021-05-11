const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

router.post("/payment", isAuthenticated, async (req, res) => {
  try {
    const response = await stripe.charges.create({
      amount: Number(req.fields.price) * 100,
      currency: "eur",
      description: req.fields.name,
      source: req.fields.stripeToken,
    });
    if (response.status === "succeeded") {
      res.status(200).json({ message: "Paiement validé" });
    } else {
      res.status(400).json({ message: "An error occured" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
