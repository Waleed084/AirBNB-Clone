import { ObjectId } from "mongodb";
import dbConnect from "@/lib/mongooseClient"; // Adjust the import path to your MongoDB client connection

async function getReservation(params) {
  try {
    const { listingId, userId, authorId } = params;

    const query = {};

    if (listingId) {
      query.listingId = new ObjectId(listingId);
    }

    if (userId) {
      query.userId = new ObjectId(userId);
    }

    if (authorId) {
      query.listing = { userId: new ObjectId(authorId) }; // Adjust based on your schema
    }

    console.log("Query:", query);

    // Connect to the database
    const db = await dbConnect();

    // Fetch reservations based on the query
    const reservations = await db.collection("reservations").find(query).toArray();

    // Log the raw reservation data
    console.log("Reservations from DB:", reservations);

    const safeReservations = reservations.map((reservation) => ({
      ...reservation,
      createdAt: reservation.createdAt.toISOString(),
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      listing: {
        ...(reservation.listing || {}), // Ensure listing is defined
        createdAt: reservation.listing?.createdAt.toISOString(),
      },
    }));

    return safeReservations;
  } catch (error) {
    throw new Error(error.message);
  }
}

export default getReservation;
