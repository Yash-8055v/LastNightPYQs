import { Paper } from "../models/paper.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";

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
