import bcrypt from "bcryptjs"; // Update to bcryptjs
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "@/lib/mongodb"; // Import your MongoDB connection function
import User from "@/schema/User"; // Adjust the path according to your user model

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await connectToDatabase(); // Ensure a connection is made

        const user = await User.findOne({
          email: credentials.email,
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }
        return user; // Return user object
      },
    }),
  ],
  pages: {
    signIn: "/", // Customize the sign-in page
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
