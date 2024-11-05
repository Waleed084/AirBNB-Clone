"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";

import Container from "@/components/Container";
import Heading from "@/components/Heading";
import ListingCard from "@/components/listing/ListingCard";

function ReservationsClient({ reservations, currentUser }) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState("");
    const [activeTab, setActiveTab] = useState("upcoming"); // Track active tab

    const onCancel = useCallback(
        (id) => {
            setDeletingId(id);

            axios
                .delete(`/api/reservations/${id}`)
                .then(() => {
                    toast.info("Reservation cancelled");
                    router.refresh();
                })
                .catch((error) => {
                    toast.error(error?.response?.data?.error);
                })
                .finally(() => {
                    setDeletingId("");
                });
        },
        [router]
    );

    // Determine the filtered reservations based on active tab
    const now = new Date();
    const filteredReservations = reservations.filter((reservation) => {
        const reservationDate = new Date(reservation.startDate);
        return activeTab === "upcoming"
            ? reservationDate >= now
            : reservationDate < now;
    });

    return (
        <Container>
            <Heading title="Reservations" subtitle="Bookings on your properties" />

            {/* Tabs for Upcoming and Past reservations */}
            <div className="mt-4 flex justify-center">
    <button
        onClick={() => setActiveTab("upcoming")}
        className={`px-4 py-2 mr-2 font-semibold rounded-lg ${
            activeTab === "upcoming"
                ? "bg-[#FF5A5F] text-white"
                : "bg-gray-200 text-gray-700"
        }`}
    >
        Upcoming
    </button>
    <button
        onClick={() => setActiveTab("past")}
        className={`px-4 py-2 font-semibold rounded-lg ${
            activeTab === "past"
                ? "bg-[#FF5A5F] text-white"
                : "bg-gray-200 text-gray-700"
        }`}
    >
        Past
    </button>
</div>

            {/* Grid of filtered reservations */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                {filteredReservations.map((reservation) => (
                    <ListingCard
                        key={reservation._id.toString()}
                        data={reservation.listing}
                        reservation={reservation}
                        actionId={reservation._id.toString()}
                        onAction={onCancel}
                        disabled={deletingId === reservation._id.toString()}
                        actionLabel="Cancel reservation"
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </Container>
    );
}

export default ReservationsClient;