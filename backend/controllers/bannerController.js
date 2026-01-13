const Banner = require("../models/Banner");


const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find({}).sort({ createdAt: -1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const addBanner = async (req, res) => {
  try {
    const { image, link } = req.body;
    if (!image) return res.status(400).json({ message: "Image URL is required" });
    const banner = await Banner.create({ image, link });
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const toggleBannerStatus = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    banner.isActive = !banner.isActive;
    await banner.save();
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Banner deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBanners, getAllBanners, addBanner, toggleBannerStatus, deleteBanner };