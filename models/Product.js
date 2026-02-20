import { model, models, Schema } from "mongoose";

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [{ type: String }],
  category: { type: String },
  properties: { type: Object },
  quantity: { type: Number, default: 0 }, 
});

const Product = models?.Product || model("Product", ProductSchema);

export default Product;
