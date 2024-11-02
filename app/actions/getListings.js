import connectToDatabase from "@/lib/mongodb"; // Adjust the import path as necessary

export default async function getListings(params) {
  try {
    const {
      userId,
      roomCount,
      guestCount,
      bathroomCount,
      locationValue,
      startDate,
      endDate,
      category,
    } = params;

    let query = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    if (roomCount) {
      query.roomCount = {
        $gte: +roomCount,
      };
    }

    if (guestCount) {
      query.guestCount = {
        $gte: +guestCount,
      };
    }

    if (bathroomCount) {
      query.bathroomCount = {
        $gte: +bathroomCount,
      };
    }

    if (locationValue) {
      query.locationValue = locationValue;
    }

    if (startDate && endDate) {
      query.$expr = {
        $not: {
          $elemMatch: {
            reservations: {
              $or: [
                {
                  endDate: { $gte: new Date(startDate) },
                  startDate: { $lte: new Date(startDate) },
                },
                {
                  startDate: { $lte: new Date(endDate) },
                  endDate: { $gte: new Date(endDate) },
                },
              ],
            },
          },
        },
      };
    }

    const db = await connectToDatabase();
    const listingsCollection = db.collection("listings"); // Replace with your actual collection name

    const listings = await listingsCollection.find(query).sort({ createdAt: -1 }).toArray();

    const safeListings = listings.map((list) => ({
      ...list,
      createdAt: list.createdAt.toISOString(),
    }));

    return safeListings;
  } catch (error) {
    throw new Error(error.message);
  }
}
