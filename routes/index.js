import { Router } from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const router = Router();

router.get("/", (req, res) => {
  res.sendFile(join(__dirname, "../public/"));
});

export default router;