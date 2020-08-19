import React from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Listings as ListingsData } from "./__generated__/Listings";
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables,
} from "./__generated__/DeleteListing";

const LISTING = gql`
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

const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;

export const Listings = () => {
  const { data, loading, error, refetch } = useQuery<ListingsData>(LISTING);

  const [
    deleteListings,
    { loading: deleteLoading, error: deleteError },
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

  const handleDeleteListing = async (id: string) => {
    await deleteListings({ variables: { id } });
    refetch();
  };

  const listingsList = data?.listings?.map(({ id, title }) => {
    return (
      <li key={id}>
        {title} <button onClick={() => handleDeleteListing(id)}>delete</button>
      </li>
    );
  });

  if (error) return <h2>error</h2>;

  if (loading) return <h2>loading</h2>;

  const deleteListingLoadingMessage = deleteLoading ? (
    <h4>deleting...</h4>
  ) : null;

  const deleteListingErrorMessage = deleteError ? <h4>delete error</h4> : null;

  return (
    <>
      <h2>TinyHouse Listings</h2>
      {listingsList}
      {deleteListingLoadingMessage}
      {deleteListingErrorMessage}
    </>
  );
};
