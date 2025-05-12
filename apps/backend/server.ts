import { createServer } from "http";
import app from "./app";

const PORT = process.env.PORT || 3000;

const server = createServer(app);

server.on("error", (error) => {
  console.error("Server error:", error);
  process.exit(1);
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
