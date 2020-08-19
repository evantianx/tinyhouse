import React from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Alert, Avatar, List, Button, Spin } from "antd";
import { Listings as ListingsData } from "./__generated__/Listings";
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables,
} from "./__generated__/DeleteListing";
import { ListingsSkeleton } from "./components";
import "./styles/Listings.css";

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

interface Props {
  title: string;
}

export const Listings = ({ title }: Props) => {
  const { data, loading, error, refetch } = useQuery<ListingsData>(LISTING);

  const [
    deleteListings,
    { loading: deleteLoading, error: deleteError },
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

  const handleDeleteListing = async (id: string) => {
    await deleteListings({ variables: { id } });
    refetch();
  };

  const listingsList = data?.listings ? (
    <List
      itemLayout="horizontal"
      dataSource={data.listings}
      renderItem={(listing) => (
        <List.Item
          actions={[
            <Button
              type="primary"
              onClick={() => handleDeleteListing(listing.id)}
            >
              Delete
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={listing.title}
            description={listing.address}
            avatar={<Avatar src={listing.image} shape="square" size={48} />}
          />
        </List.Item>
      )}
    />
  ) : null;

  if (error)
    return (
      <div className="listings">
        <ListingsSkeleton title={title} error />
      </div>
    );

  if (loading)
    return (
      <div className="listings">
        <ListingsSkeleton title={title} />
      </div>
    );

  const deleteListingErrorAlert = deleteError ? (
    <Alert
      type="error"
      message="Ooooops, something is wrong :-( "
      className="listings__alert"
    />
  ) : null;

  return (
    <div className="listings">
      <Spin spinning={deleteLoading}>
        {deleteListingErrorAlert}
        <h2>{title}</h2>
        {listingsList}
      </Spin>
    </div>
  );
};
