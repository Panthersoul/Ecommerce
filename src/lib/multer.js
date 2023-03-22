import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destination = "./public/upload";
        cb(null, destination);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

export default upload;