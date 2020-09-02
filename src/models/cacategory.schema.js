import mongoose from "mongoose";
import usuarioSchema from "./user.schema";

export let categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  createdAt: Date,
  createdBy: usuarioSchema,
});

module.exports = mongoose.model("category", categorySchema);
