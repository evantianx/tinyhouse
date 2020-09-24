import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Col, Row, Layout } from "antd";
import { Moment } from "moment";
import { RouteComponentProps } from "react-router-dom";
import { LISTING } from "../../lib/graphql/queries";
import {
  Listing as ListingData,
  ListingVariables,
} from "../../lib/graphql/queries/Listing/__generated__/Listing";
import { PageSkeleton, ErrorBanner } from "../../lib/components";
import {
  ListingBookings,
  ListingDetails,
  ListingCreatingBooking,
  ListingCreateBookingModal,
} from "./components";
import { Viewer } from "../../lib/types";

interface MatchParams {
  id: string;
}

interface Props {
  viewer: Viewer;
}

const { Content } = Layout;

const PAGE_LIMIT = 3;
export const Listing = ({
  match,
  viewer,
}: Props & RouteComponentProps<MatchParams>) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [bookingsPage, setBookingsPage] = useState(1);
  const [checkInDate, setCheckInDate] = useState<Moment | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null);
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

  const listingCreateBooking = listing ? (
    <ListingCreatingBooking
      viewer={viewer}
      host={listing.host}
      price={listing.price}
      bookingsIndex={listing.bookingsIndex}
      checkInDate={checkInDate}
      checkOutDate={checkOutDate}
      setCheckInDate={setCheckInDate}
      setCheckOutDate={setCheckOutDate}
      setModalVisible={setModalVisible}
    />
  ) : null;

  const listingCreateBookingModalElement =
    listing && checkInDate && checkOutDate ? (
      <ListingCreateBookingModal
        price={listing.price}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    ) : null;

  return (
    <Content className="listing">
      <Row gutter={24} justify="space-between">
        <Col xs={24} lg={14}>
          {listingDetailsElement}
          {listingBookinsElement}
        </Col>
        <Col xs={24} lg={10}>
          {listingCreateBooking}
        </Col>
      </Row>
      {listingCreateBookingModalElement}
    </Content>
  );
};
