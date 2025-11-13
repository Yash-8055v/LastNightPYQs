import express from "express";
import { upload } from "../middlewares/multer.js";
import { uploadPaper } from "../controllers/paper.controller.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";
import { deletePaper } from "../controllers/paper.controller.js";
import { getPapers, getStats } from "../controllers/paper.controller.js";


const router = express.Router();

router.get("/", getPapers)


router.get("/stats", verifyAdmin, getStats); // only admin can see stats
router.post("/upload", verifyAdmin, upload.single("pdf"), uploadPaper);
router.delete("/:id", verifyAdmin, deletePaper);




export default router;
