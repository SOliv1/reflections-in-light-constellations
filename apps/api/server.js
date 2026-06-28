import app from "./app.js";
import { connectToDb } from "./db.js";

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  console.log(`Server running on port ${port}`);

  try {
    await connectToDb();
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
});
