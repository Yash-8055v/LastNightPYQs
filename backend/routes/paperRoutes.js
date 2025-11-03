import express from "express";
import { upload } from "../middlewares/multer.js";
import { uploadPaper } from "../controllers/paper.controller.js";

const router = express.Router();

router.post("/", upload.single("pdf"), uploadPaper);

export default router;
