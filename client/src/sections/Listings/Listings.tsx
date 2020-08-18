import React from "react";
import { server } from "../../lib/api";
import {
  ListingsData,
  DeleteListingData,
  DeleteListingVariables,
} from "./types";

const LISTING = `
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`;

const DELETE_LISTING = `
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;

export const Listings = () => {
  const fetchListings = async () => {
    const { data } = await server.fetch<ListingsData>({ query: LISTING });
    console.log(data.listings);
  };
  const deleteListings = async () => {
    const { data } = await server.fetch<
      DeleteListingData,
      DeleteListingVariables
    >({ query: DELETE_LISTING, variables: { id: "5f3a5530487bb6584854a8fc" } });
    console.log(data.deleteListing);
  };
  return (
    <>
      <h2>TinyHouse Listings</h2>
      <button onClick={fetchListings}>Query Listing!</button>
      <button onClick={deleteListings}>Deleting Listing!</button>
    </>
  );
};
