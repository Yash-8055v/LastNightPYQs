import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp") //! Path where we want to store files temporary
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) //! what name use to save file
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

export const upload = multer({ storage, fileFilter });