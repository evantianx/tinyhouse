import React from "react";
import { Button, Card, Divider, DatePicker, Typography } from "antd";
import { formatListingPrice } from "../../utils";
import moment, { Moment } from "moment";

const { Paragraph, Title } = Typography;

interface Props {
  price: number;
  checkInDate: Moment | null;
  checkOutDate: Moment | null;
  setCheckInDate: (checkIndate: Moment | null) => void;
  setCheckOutDate: (checkOutdate: Moment | null) => void;
}
export const ListingCreatingBooking = ({
  price,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
}: Props) => {
  const disabledDate = ({ isCheckIn = true }) => (currentDate?: Moment) => {
    const refDate = isCheckIn
      ? moment().endOf("day")
      : checkInDate?.endOf("day");
    return currentDate ? currentDate.isBefore(refDate) : false;
  };
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
              disabledDate={disabledDate({ isCheckIn: true })}
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
              disabled={!checkInDate}
              disabledDate={disabledDate({ isCheckIn: false })}
              onChange={(val) => setCheckOutDate(val)}
            />
          </div>
        </div>
        <Divider />
        <Button
          size="large"
          type="primary"
          className="listing-booking__card-cta"
          disabled={!checkInDate || !checkOutDate}
        >
          Request to book!
        </Button>
      </Card>
    </div>
  );
};
