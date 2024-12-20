"use client";
import { useEffect, useState } from "react";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import ListingCard from "@/components/listing/ListingCard";

function FavoritesClient({ currentUser }) {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch("/api/favorites");
        if (response.ok) {
          const data = await response.json();
          setListings(data);
        } else {
          console.error("Failed to fetch favorites.");
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [currentUser]);

  return (
    <Container>
      <Heading title="Favorites" subtitle="List of places you favorites!" />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        {listings.map((listing) => (
          <ListingCard
            currentUser={currentUser}
            key={listing.id}
            data={listing}
          />
        ))}
      </div>
    </Container>
  );
}

export default FavoritesClient;
