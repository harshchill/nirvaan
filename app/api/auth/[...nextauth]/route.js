import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import connectDB from "@/lib/connectdb";
import User from "@/models/user";

export const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === "google") {
          await connectDB();
          const gmail = user?.email;
          if (gmail) {
            const existing = await User.findOne({ gmail });
            if (!existing) {
              await User.create({ gmail, role: "user" });
            }
          }
        }
        return true;
      } catch (err) {
        console.error("signIn callback error:", err);
        return false;
      }
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


