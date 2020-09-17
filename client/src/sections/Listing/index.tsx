import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Col, Row, Layout } from "antd";
import { RouteComponentProps } from "react-router-dom";
import { LISTING } from "../../lib/graphql/queries";
import {
  Listing as ListingData,
  ListingVariables,
} from "../../lib/graphql/queries/Listing/__generated__/Listing";
import { PageSkeleton, ErrorBanner } from "../../lib/components";
import { ListingBookings, ListingDetails } from "./components";

interface MatchParams {
  id: string;
}

const { Content } = Layout;

const PAGE_LIMIT = 3;
export const Listing = ({ match }: RouteComponentProps<MatchParams>) => {
  const [bookingsPage, setBookingsPage] = useState(1);
  const { loading, error, data } = useQuery<ListingData, ListingVariables>(
    LISTING,
    {
      variables: {
        id: match.params.id,
        bookingsPage,
        limit: PAGE_LIMIT,
      },
    }
  );

  if (loading) {
    return (
      <Content className="listings">
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="listings">
        <ErrorBanner description="This listing may not exist or we've encountered an error. Please try again later." />
        <PageSkeleton />
      </Content>
    );
  }

  const listing = data?.listing;
  const listingBookings = data?.listing?.bookings;

  const listingDetailsElement = listing ? (
    <ListingDetails listing={listing} />
  ) : null;

  const listingBookinsElement = listingBookings ? (
    <ListingBookings
      limit={PAGE_LIMIT}
      bookingsPage={bookingsPage}
      listingBookings={listingBookings}
      setBookingsPage={setBookingsPage}
    />
  ) : null;

  return (
    <Content className="listing">
      <Row gutter={24} justify="space-between">
        <Col xs={24} lg={14}>
          {listingDetailsElement}
          {listingBookinsElement}
        </Col>
      </Row>
    </Content>
  );
};
