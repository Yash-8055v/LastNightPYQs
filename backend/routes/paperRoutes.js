import express from "express";
import { upload } from "../middlewares/multer.js";
import { uploadPaper } from "../controllers/paper.controller.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";
import { deletePaper } from "../controllers/paper.controller.js";

const router = express.Router();


router.post("/upload", verifyAdmin, upload.single("pdf"), uploadPaper);
router.delete("/:id", verifyAdmin, deletePaper);




export default router;
