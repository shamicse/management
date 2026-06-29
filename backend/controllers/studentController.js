const Student = require('../models/Student');
const { isCloudinaryConfigured } = require('../config/cloudinary');

const getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).select('-password');
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, branch, cgpa } = req.body;
    const student = await Student.findById(req.user._id);

    if (name) student.name = name;
    if (phone) student.phone = phone;
    if (branch) student.branch = branch;
    if (cgpa !== undefined) student.cgpa = cgpa;

    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const student = await Student.findById(req.user._id);
    if (isCloudinaryConfigured() && req.file.path) {
      student.resume = req.file.path;
    } else {
      student.resume = `/uploads/resumes/${req.file.filename}`;
    }
    await student.save();

    res.json({ message: 'Resume uploaded successfully', resume: student.resume });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile, uploadResume };
