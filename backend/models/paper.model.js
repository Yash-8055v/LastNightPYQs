import mongoose, { Schema } from "mongoose";

const paperSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  university: {
    type: String,
    default: "MU"
  },
  department: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    enum: [1,2,3,4,5,6,7,8],
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  pdfUrl: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: String,
    default: "Admin"
  },
  downloadCount: {
    type: Number,
    default: 0
  },

}, {timestamps: true})


export const Paper = mongoose.model("Paper", paperSchema);