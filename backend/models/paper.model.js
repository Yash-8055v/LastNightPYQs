import mongoose, { Schema } from "mongoose";

const paperSchema = new mongoose.Schema({
  Subject: {
    type: String,
    required: true
  },
  University: {
    type: String,
    required: true
  },
  Department: {
    type: String,
    required: true
  },
  Semester: {
    type: Number,
    enum: [1,2,3,4,5,6,7,8],
    required: true
  },
  Year: {
    type: Number,
    required: true
  },
  PdfUrl: {
    type: String,
    required: true
  },
  UploadedBy: {
    type: String,
    default: "Admin"
  },

}, {timestamps: true})


export const Paper = mongoose.model("Paper", paperSchema);