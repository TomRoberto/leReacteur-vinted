const express = require("express");
const cloudinary = require("cloudinary").v2;

const router = express.Router();
const User = require("../models/User");
const Offer = require("../models/Offer");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/offer/publish", isAuthenticated, async (req, res) => {
  try {
    console.log("Coucou, je suis dans la route offer les petits fréros");
    const { title, description, price, condition, city, brand, size, color } =
      req.fields;
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
        product_pictures: [],
        owner: req.user,
      });
      if (req.files.picture) {
        const imgUploaded = await cloudinary.uploader.upload(
          req.files.picture.path,
          { folder: `/vinted/offers/${newOffer.id}` }
        );
        newOffer.product_image = imgUploaded;
        newOffer.product_pictures.push(imgUploaded);
      }

      if (req.files.picture2) {
        const imgUploaded2 = await cloudinary.uploader.upload(
          req.files.picture2.path,
          { folder: `/vinted/offers/${newOffer.id}` }
        );
        newOffer.product_pictures.push(imgUploaded2);
      }

      if (req.files.picture3) {
        const imgUploaded3 = await cloudinary.uploader.upload(
          req.files.picture3.path,
          { folder: `/vinted/offers/${newOffer.id}` }
        );
        newOffer.product_pictures.push(imgUploaded3);
      }
      if (req.files.picture4) {
        const imgUploaded4 = await cloudinary.uploader.upload(
          req.files.picture4.path,
          { folder: `/vinted/offers/${newOffer.id}` }
        );
        newOffer.product_pictures.push(imgUploaded4);
      }

      if (req.files.picture5) {
        const imgUploaded5 = await cloudinary.uploader.upload(
          req.files.picture5.path,
          { folder: `/vinted/offers/${newOffer.id}` }
        );
        newOffer.product_pictures.push(imgUploaded5);
      }

      if (req.files.picture6) {
        const imgUploaded6 = await cloudinary.uploader.upload(
          req.files.picture6.path,
          { folder: `/vinted/offers/${newOffer.id}` }
        );
        newOffer.product_pictures.push(imgUploaded6);
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
    if (req.files.picture) {
      await cloudinary.uploader.destroy(offer.product_image.public_id);
      const imgUploaded = await cloudinary.uploader.upload(
        req.files.picture.path,
        {
          folder: `/vinted/offers/${offer.id}`,
        }
      );
      offer.product_image = imgUploaded;
      offer.product_pictures[0] = imgUploaded;
      offer.markModified("product_pictures");
    }
    if (title) {
      offer.product_name = title;
    }
    if (description) {
      offer.product_description = description;
    }
    if (price) {
      offer.product_price = price;
    }

    const details = offer.product_details;
    for (let i = 0; i < details.length; i++) {
      if (details[i].MARQUE) {
        if (brand) {
          details[i].MARQUE = brand;
        }
      }
      if (details[i].TAILLE) {
        if (size) {
          details[i].TAILLE = size;
        }
      }
      if (details[i].ÉTAT) {
        if (condition) {
          details[i].ÉTAT = condition;
        }
      }
      if (details[i].COULEUR) {
        if (color) {
          details[i].COULEUR = color;
        }
      }
      if (details[i].EMPLACEMENT) {
        if (city) {
          details[i].EMPLACEMENT = city;
        }
      }
    }
    offer.markModified("product_details");

    if (req.files.picture2) {
      if (offer.product_pictures[1]) {
        await cloudinary.uploader.destroy(offer.product_pictures[1].public_id);
        const imgUploaded2 = await cloudinary.uploader.upload(
          req.files.picture2.path,
          { folder: `/vinted/offers/${offer.id}` }
        );
        offer.product_pictures[1] = imgUploaded2;
      } else {
        const imgUploaded2 = await cloudinary.uploader.upload(
          req.files.picture2.path,
          { folder: `/vinted/offers/${offer.id}` }
        );
        offer.product_pictures.push(imgUploaded2);
      }
    }

    if (req.files.picture3) {
      if (offer.product_pictures[2]) {
        await cloudinary.uploader.destroy(offer.product_pictures[2].public_id);
        const imgUploaded3 = await cloudinary.uploader.upload(
          req.files.picture3.path,
          { folder: `/vinted/offers/${offer.id}` }
        );
        offer.product_pictures[2] = imgUploaded3;
      } else {
        const imgUploaded3 = await cloudinary.uploader.upload(
          req.files.picture3.path,
          { folder: `/vinted/offers/${offer.id}` }
        );
        offer.product_pictures.push(imgUploaded3);
      }
    }

    if (req.files.picture4) {
      if (offer.product_pictures[3]) {
        await cloudinary.uploader.destroy(offer.product_pictures[3].public_id);
        const imgUploaded4 = await cloudinary.uploader.upload(
          req.files.picture4.path,
          { folder: `/vinted/offers/${offer.id}` }
        );
        offer.product_pictures[3] = imgUploaded4;
      } else {
        const imgUploaded4 = await cloudinary.uploader.upload(
          req.files.picture4.path,
          { folder: `/vinted/offers/${offer.id}` }
        );
        offer.product_pictures.push(imgUploaded4);
      }
    }

    if (req.files.picture5) {
      if (offer.product_pictures[4]) {
        await cloudinary.uploader.destroy(offer.product_pictures[4].public_id);
        const imgUploaded5 = await cloudinary.uploader.upload(
          req.files.picture5.path,
          { folder: `/vinted/offers/${offer.id}` }
        );
        offer.product_pictures[4] = imgUploaded5;
      } else {
        const imgUploaded5 = await cloudinary.uploader.upload(
          req.files.picture5.path,
          { folder: `/vinted/offers/${offer.id}` }
        );
        offer.product_pictures.push(imgUploaded5);
      }
    }

    if (req.files.picture6) {
      if (offer.product_pictures[5]) {
        await cloudinary.uploader.destroy(offer.product_pictures[5].public_id);
        const imgUploaded6 = await cloudinary.uploader.upload(
          req.files.picture6.path,
          { folder: `/vinted/offers/${offer.id}` }
        );
        offer.product_pictures[5] = imgUploaded6;
      } else {
        const imgUploaded6 = await cloudinary.uploader.upload(
          req.files.picture6.path,
          { folder: `/vinted/offers/${offer.id}` }
        );
        offer.product_pictures.push(imgUploaded6);
      }
    }

    offer.markModified("product_pictures");

    await offer.save();
    res.status(200).json({ message: "Offer updated." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/offer/delete", isAuthenticated, async (req, res) => {
  try {
    offer = await Offer.findById(req.fields.id);
    // await cloudinary.uploader.destroy(offer.product_image.public_id);
    const numberOfPictures = offer.product_pictures.length;
    for (let i = 0; i < numberOfPictures; i++) {
      await cloudinary.uploader.destroy(offer.product_pictures[i].public_id);
    }
    await cloudinary.api.delete_folder(`/vinted/offers/${offer.id}`);
    await offer.remove();
    res.status(200).json({ message: "Deletion successfull" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/offers", async (req, res) => {
  try {
    let limit = Number(req.query.limit);

    let filter = {};
    let sort = {};
    let page;
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

    if (req.query.sort === "price-desc") {
      sort = { product_price: -1 };
    } else if (req.query.sort === "price-asc") {
      sort = { product_price: 1 };
    }

    if (Number(req.query.page) < 1) {
      page = 1;
    } else {
      page = Number(req.query.page);
    }
    console.log((page - 1) * limit);
    const result = await Offer.find(filter)
      .populate("owner", "account _id")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

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
