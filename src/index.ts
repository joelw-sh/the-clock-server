import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import itemsRoutes from "./routes/items";
import { authMiddleware } from "./middleware/auth";
import dotenv from "dotenv";

import notesRoutes from "./routes/notes";
import tasksRoutes from "./routes/tasks";
import pomodorosRoutes from "./routes/pomodoros";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api/items", authMiddleware, itemsRoutes);



// Ruta de prueba sin autenticación
app.get("/health", (req, res) => {
    res.json({ status: "OK", message: "Servidor funcionando" });
});

const PORT = process.env.PORT || 3002; // Cambié a 3002
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));