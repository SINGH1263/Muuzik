// route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/app/lib/db"; // this is your default export from db.ts

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
secret: process.env.NEXTAUTH_SECRET ?? "secret",
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false;
      }

      try {
        await prisma.user.upsert({
          where: { email: user.email },
          update: {},
          create: {
            email: user.email,
            provider: "Google", // Ensure your schema has a "provider" field
          },
        });
      } catch (e) {
        console.error("Error creating user :", e);
        return false;
      }

      return true;
    },
  },
});

export { handler as GET, handler as POST };
