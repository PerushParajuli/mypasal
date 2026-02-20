import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";

const ADMIN_EMAIL = "perushparajuli@gmail.com";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      await mongooseConnect();
      const nameParts = user.name?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Create user if doesn't exist, but don't overwrite existing name/phone edits
      await User.findOneAndUpdate(
        { email: user.email },
        { $setOnInsert: { email: user.email, firstName, lastName, phone: '' } },
        { upsert: true, new: true }
      );
      return true;
    },
    async session({ session }) {
      session.user.isAdmin = session.user.email === ADMIN_EMAIL;
      return session;
    },
  },
  pages: {
    signIn: "/account",
  },
};

export default NextAuth(authOptions);