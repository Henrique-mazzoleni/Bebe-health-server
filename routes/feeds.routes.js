const express = require("express");
const router = express.Router();

const Child = require("../models/Child.model");
const Feeds = require("../models/Feeds.model");

router.post("/", async (req, res, next) => {
  const {
    childId,
    dateAndTime,
    kind,
    rightBreastDuration,
    leftBreastDuration,
    bottleVolume,
    throwUp,
  } = req.body;

  if (dateAndTime === "" || kind === "") {
    res.status(400).json({ message: "date and kind fields must be provided" });
    return;
  }

  const createObject = {
    dateAndTime,
    kind,
    throwUp,
  };

  if (bottleVolume) {
    createObject.bottleVolume = bottleVolume;
  } else {
    createObject.rightBreastDuration = rightBreastDuration;
    createObject.leftBreastDuration = leftBreastDuration;
  }

  try {
    const feed = await Feeds.create(createObject);

    await Child.findByIdAndUpdate(childId, { $push: { feeds: feed._id } });

    res.status(200).json(feed);
  } catch (error) {
    next(error);
  }
});

router.patch("/:feedId", async (req, res, next) => {
  const { feedId } = req.params;
  const feedUpdate = { ...req.body };

  try {
    await Feeds.findByIdAndUpdate(feedId, feedUpdate, {
      new: true,
    });

    if (feedUpdate.kind === "breast")
      await Feeds.findByIdAndUpdate(feedId, { $unset: { bottleVolume: "" } });
    else
      await Feeds.findByIdAndUpdate(feedId, {
        $unset: { rightBreastDuration: "", leftBreastDuration: "" },
      });
    const updatedFeed = await Feeds.findById(feedId);
    res.status(200).json(updatedFeed);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
