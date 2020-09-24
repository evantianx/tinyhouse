import React from "react";
import { Button, Card, Divider, DatePicker, Typography } from "antd";
import { displayErrorMessage, formatListingPrice } from "../../../../lib/utils";
import moment, { Moment } from "moment";
import { Viewer } from "../../../../lib/types";
import { Listing } from "../../../../lib/graphql/queries/Listing/__generated__/Listing";
import { BookingsIndex } from "./types";

const { Paragraph, Text, Title } = Typography;

interface Props {
  viewer: Viewer;
  host: Listing["listing"]["host"];
  price: number;
  bookingsIndex: Listing["listing"]["bookingsIndex"];
  checkInDate: Moment | null;
  checkOutDate: Moment | null;
  setCheckInDate: (checkIndate: Moment | null) => void;
  setCheckOutDate: (checkOutdate: Moment | null) => void;
  setModalVisible: (modalVisible: boolean) => void;
}
export const ListingCreatingBooking = ({
  viewer,
  host,
  price,
  bookingsIndex,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
  setModalVisible,
}: Props) => {
  const bookingsIndexJSON: BookingsIndex = JSON.parse(bookingsIndex);
  const dateIsBooked = (date: Moment): boolean => {
    const year = moment(date).year();
    const month = moment(date).month();
    const day = moment(date).date();

    if (bookingsIndexJSON[year] && bookingsIndexJSON[year][month]) {
      return bookingsIndexJSON[year][month][day];
    }

    return false;
  };
  const isDateValid = ({ isCheckIn = true }) => (currentDate: Moment) => {
    const refDate = isCheckIn
      ? moment().endOf("day")
      : checkInDate?.endOf("day");
    return currentDate
      ? dateIsBooked(currentDate) || currentDate.isBefore(refDate)
      : false;
  };

  // 1.4 - 1.5 has been booked, we can't let 1.1 - 1.6 booked successfully
  const isBetweenDateValid = (selectedCheckOutDate: Moment | null) => {
    let dateCursor = checkInDate;

    while (moment(dateCursor).isBefore(selectedCheckOutDate, "days")) {
      dateCursor = moment(dateCursor).add(1, "days");

      const year = moment(dateCursor).year();
      const month = moment(dateCursor).month();
      const day = moment(dateCursor).day();

      if (bookingsIndexJSON?.[year]?.[month]?.[day]) {
        return displayErrorMessage(
          "You can't book a period of time that overlaps existing bookings. Please choose another date!"
        );
      }
    }

    setCheckOutDate(selectedCheckOutDate);
  };
  const isViewerSignedIn = !!viewer.id;
  const isHostHasWallet = !!host.hasWallet;
  const isViewerAlsoHost = viewer.id === host.id;

  const checkInInputDisabled =
    !isViewerSignedIn || isViewerAlsoHost || !isHostHasWallet;

  const checkOutInputDisabled = checkInInputDisabled || !checkInDate;

  const buttonMessage = !isViewerSignedIn
    ? "You have to be signed in to book a listing"
    : isViewerAlsoHost
    ? "You can't book your own listing"
    : isHostHasWallet
    ? "You won't be charged yet"
    : "The host has disconnected from Stripe and thus won't be able to receive payments!";

  return (
    <div className="listing-booking">
      <Card className="listing-booking__card">
        <div>
          <Paragraph>
            <Title level={2} className="listing-booking__card-title">
              {formatListingPrice(price)}
              <span>/day</span>
            </Title>
          </Paragraph>
          <Divider />
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check In</Paragraph>
            <DatePicker
              value={checkInDate}
              format={"YYYY/MM/DD"}
              showToday={false}
              disabled={checkInInputDisabled}
              disabledDate={isDateValid({ isCheckIn: true })}
              onChange={(val) => setCheckInDate(val)}
              onOpenChange={() => setCheckOutDate(null)}
            />
          </div>
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check Out</Paragraph>
            <DatePicker
              value={checkOutDate}
              format={"YYYY/MM/DD"}
              showToday={false}
              disabled={checkOutInputDisabled}
              disabledDate={isDateValid({ isCheckIn: false })}
              onChange={(val) => isBetweenDateValid(val)}
            />
          </div>
        </div>
        <Divider />
        <Button
          size="large"
          type="primary"
          className="listing-booking__card-cta"
          disabled={!checkInDate || !checkOutDate}
          onClick={() => setModalVisible(true)}
        >
          Request to book!
        </Button>
        <Text type="secondary" mark>
          {buttonMessage}
        </Text>
      </Card>
    </div>
  );
};
