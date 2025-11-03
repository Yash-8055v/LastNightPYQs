import { Paper } from "../models/paper.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
