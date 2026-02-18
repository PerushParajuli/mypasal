import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const ADMIN_EMAIL = "perushparajuli@gmail.com";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
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
