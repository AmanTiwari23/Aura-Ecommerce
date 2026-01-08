const Banner = require("../models/Banner");


const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addBanner = async (req, res) => {
  try {
    const { image, link } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const banner = await Banner.create({ image, link });
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBanners,
  addBanner,
};
