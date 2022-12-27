import { client } from "@/lib/client";
import NextAuth, { NextAuthOptions } from "next-auth";
import { SanityAdapter } from "next-auth-sanity";
import GoogleProvider from "next-auth/providers/google";

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: SanityAdapter(client as any),
};

export default NextAuth(options);
