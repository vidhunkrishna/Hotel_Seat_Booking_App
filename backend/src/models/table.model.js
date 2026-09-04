import mongoose from "mongoose";
import { tableSchema } from "../schemas/table.schema.js";

export const tableModel = mongoose.model("Table", tableSchema);
