import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const ADMIN_EMAIL = "perushparajuli@gmail.com";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.email !== ADMIN_EMAIL) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await mongooseConnect();

  if (req.method === "POST") {
    const { title, description, price, images, category, quantity } = req.body;
    const product = await Product.create({
      title, description,
      price: Number(price),
      images, category,
      quantity: Number(quantity) || 0,
    });
    return res.json(product);
  }

  if (req.method === "GET") {
    const products = await Product.find({}, null, { sort: { _id: -1 } });
    return res.json(products);
  }

  if (req.method === "PUT") {
    const { id } = req.query;
    const { title, description, price, images, category, quantity } = req.body;
    await Product.findByIdAndUpdate(id, {
      title, description,
      price: Number(price),
      images, category,
      quantity: Number(quantity) || 0,
    });
    return res.json({ success: true });
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    await Product.findByIdAndDelete(id);
    return res.json({ success: true });
  }

  res.status(405).json({ error: "Method not allowed" });
}
