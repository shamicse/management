const Recruiter = require('../models/Recruiter');

const getProfile = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.user._id).select('-password');
    res.json(recruiter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { hrName, phone, website, description } = req.body;
    const recruiter = await Recruiter.findById(req.user._id);

    if (hrName) recruiter.hrName = hrName;
    if (phone) recruiter.phone = phone;
    if (website) recruiter.website = website;
    if (description) recruiter.description = description;

    await recruiter.save();
    res.json(recruiter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile };
