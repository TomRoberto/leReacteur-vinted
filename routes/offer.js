const express = require("express");
const cloudinary = require("cloudinary").v2;

const router = express.Router();
const User = require("../models/User");
const Offer = require("../models/Offer");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/offer/publish", isAuthenticated, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      condition,
      city,
      brand,
      size,
      color,
    } = req.fields;
    if (
      description.length <= 500 &&
      title.length <= 50 &&
      Number(price) <= 100000
    ) {
      const newOffer = new Offer({
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: [
          { MARQUE: brand },
          { TAILLE: size },
          { ÉTAT: condition },
          { COULEUR: color },
          { EMPLACEMENT: city },
        ],
        owner: req.user,
      });
      if (req.files.picture) {
        const imgUploaded = await cloudinary.uploader.upload(
          req.files.picture.path,
          { folder: `/vinted/offers/${newOffer.id}` }
        );
        newOffer.product_image = imgUploaded;
      }

      await newOffer.save();
      res.status(200).json(newOffer);
    } else {
      res.status(400).json({
        message:
          "Your description must contain less than 500 characters, your title must contain less than 50 characters and your price must be less than 100000",
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/offer/update", isAuthenticated, async (req, res) => {
  const {
    _id,
    title,
    description,
    price,
    condition,
    city,
    brand,
    size,
    color,
  } = req.fields;
  try {
    const offer = await Offer.findById(_id);
    await cloudinary.uploader.destroy(offer.product_image.public_id);
    offer.product_name = title;
    offer.product_description = description;
    offer.product_price = price;
    offer.product_details = [
      { MARQUE: brand },
      { TAILLE: size },
      { ÉTAT: condition },
      { COULEUR: color },
      { EMPLACEMENT: city },
    ];
    offer.owner = req.user;
    const imgUploaded = await cloudinary.uploader.upload(
      req.files.picture.path,
      {
        folder: `/vinted/offers/${offer.id}`,
      }
    );
    offer.product_image = imgUploaded;
    await offer.save();
    res.status(200).json({ message: "Offer updated." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/offer/delete", isAuthenticated, async (req, res) => {
  try {
    offer = await Offer.findById(req.fields.id);
    await cloudinary.uploader.destroy(offer.product_image.public_id);
    await cloudinary.api.delete_folder(`/vinted/offers/${offer.id}`);
    await offer.remove();
    res.status(200).json({ message: "Deletion successfull" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/offers", async (req, res) => {
  try {
    let result = [];
    let filter = {};
    if (req.query.title) {
      filter.product_name = new RegExp(req.query.title, "i");
    }
    if (req.query.priceMin && req.query.priceMax) {
      filter.product_price = {
        $gte: Number(req.query.priceMin),
        $lte: Number(req.query.priceMax),
      };
    } else if (req.query.priceMin) {
      filter.product_price = {
        $gte: Number(req.query.priceMin),
      };
    } else if (req.query.priceMax) {
      filter.product_price = {
        $lte: Number(req.query.priceMax),
      };
    }
    if (!req.query.page) {
      if (!req.query.sort) {
        result = await Offer.find(filter)
          .skip(0)
          .limit(3)
          .populate("owner", "account _id");
      } else if (req.query.sort === "price-asc") {
        result = await Offer.find(filter)
          .sort({ product_price: "asc" })
          .skip(0)
          .limit(3)
          .populate("owner", "account _id");
      } else if (req.query.sort === "price-desc") {
        result = await Offer.find(filter)
          .sort({ product_price: "desc" })
          .skip(0)
          .limit(3)
          .populate("owner", "account _id");
      }
    } else {
      if (!req.query.sort) {
        result = await Offer.find(filter)
          .skip(3 * (Number(req.query.page) - 1))
          .limit(3)
          .populate("owner", "account _id");
      } else if (req.query.sort === "price-asc") {
        result = await Offer.find(filter)
          .sort({ product_price: "asc" })
          .skip(3 * (Number(req.query.page) - 1))
          .limit(3)
          .populate("owner", "account _id");
      } else if (req.query.sort === "price desc") {
        result = await Offer.find(filter)
          .sort({ product_price: "desc" })
          .skip(3 * (Number(req.query.page) - 1))
          .limit(3)
          .populate("owner", "account _id");
      }
    }
    const count = await Offer.countDocuments(filter);

    res.status(200).json({ count: count, offers: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/offer/:id", async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    const user = await User.findById(offer.owner).select("account _id");
    offer.owner = user;
    res.status(200).json(offer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
