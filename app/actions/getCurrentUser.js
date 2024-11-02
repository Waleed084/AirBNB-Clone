import { MongoClient } from "mongodb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/mongooseClient"; // Adjust the path as necessary

const uri = process.env.MONGODB_URI; // Use process.env for environment variables
const client = new MongoClient(uri);

export async function getSession() {
  return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    await dbConnect(); // Connect to the database using the dbConnect function

    const database = client.db("your_database_name"); // replace with your database name
    const usersCollection = database.collection("users"); // replace with your collection name

    const currentUser = await usersCollection.findOne({
      email: session.user.email,
    });

    if (!currentUser) {
      return null;
    }

    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified ? currentUser.emailVerified.toISOString() : null,
    };
  } catch (error) {
    console.log("Error in getCurrentUser:", error);
  } finally {
    // Do not close the client here, manage connections in dbConnect instead
  }
}
