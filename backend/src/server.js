import "dotenv/config";
import app from "./app.js";
import { connectDb } from "./config/db.js";
connectDb();
const port = process.env.PORT || 9090;
app.listen(port, () => {
  console.log(`Running in ${port}`);
});
