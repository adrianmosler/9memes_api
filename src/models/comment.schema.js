import mongoose from "mongoose";
//import usuarioSchema from "./user.schema";
import userSchema from "./user.schema";
import { publicationSchema } from "./publication.schema";

export let commentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  publication: { type: publicationSchema, required: true },
  user: { type: userSchema, required: true },
  createdAt: Date,
  updateAt: Date,
});

module.exports = mongoose.model("category", categorySchema);
