import { Paper } from "../models/paper.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";

// GET /api/papers
export const getPapers = async (req, res) => {
  try {
    const filters = {};

    // build dynamic filters from query params
    if (req.query.university) filters.university = req.query.university;
    if (req.query.department) filters.department = req.query.department;
    if (req.query.semester) filters.semester = Number(req.query.semester);
    if (req.query.year) filters.year = Number(req.query.year);

    const papers = await Paper.find(filters).sort({ createdAt: -1 });

    res.status(200).json({
      count: papers.length,
      papers
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch papers", error: error.message });
  }
};

export const uploadPaper = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file);
    const { subject, department, semester, year } = req.body;

    if (!req.file) return res.status(400).json({ message: "No PDF uploaded" });

    // Upload to cloudinary
    const result = await uploadOnCloudinary(req.file.path);

    const newPaper = new Paper({
      subject,
      department,
      semester,
      year,
      pdfUrl: result.secure_url,
    });

    await newPaper.save();
    res.status(201).json({
      message: "Paper uploaded successfully",
      paper: newPaper,
    });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

export const deletePaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    // Extract Cloudinary public id
    const pdfUrlParts = paper.pdfUrl.split("/");
    const fileName = pdfUrlParts[pdfUrlParts.length - 1].split(".")[0];

    await deleteFromCloudinary(fileName);
    await paper.deleteOne();

    res.status(200).json({ message: "Paper deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};
