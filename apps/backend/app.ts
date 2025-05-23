import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import problemRouter from "./router/problem.js";
import authRouter from "./router/auth.js";
import userRouter from "./router/user.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send({ message: "ok" });
});

app.use("/api/problem", problemRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

export default app;
