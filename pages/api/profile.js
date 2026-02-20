import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  await mongooseConnect();
  const email = session.user.email;

  if (req.method === "GET") {
    const user = await User.findOne({ email });
    return res.json(user || {});
  }

  if (req.method === "PUT") {
    const { firstName, lastName, phone } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { firstName, lastName, phone },
      { upsert: true, new: true }
    );
    return res.json(user);
  }

  res.status(405).end();
}