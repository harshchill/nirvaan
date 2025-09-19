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
    async jwt({ token, user, account }) {
      try {
        // On initial sign in, merge DB role into token
        if (account || user) {
          await connectDB();
          const gmail = user?.email || token?.email;
          if (gmail) {
            const existing = await User.findOne({ gmail }).lean();
            token.role = existing?.role || "user";
          }
        }
        // Fallback to default if somehow missing
        if (!token.role) token.role = "user";
      } catch (err) {
        console.error("jwt callback error:", err);
        if (!token.role) token.role = "user";
      }
      return token;
    },
    async session({ session, token }) {
      // Expose role on session for client usage
      if (session?.user) {
        session.user.role = token?.role || "user";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


