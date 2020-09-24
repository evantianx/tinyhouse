import { KeyOutlined } from "@ant-design/icons";
import { Modal, Button, Divider, Typography } from "antd";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import moment from "moment";
import { Moment } from "moment";
import React from "react";
import { formatListingPrice } from "../../../../lib/utils";
import { StripeCardElement } from "@stripe/stripe-js";

interface Props {
  price: number;
  checkInDate: Moment;
  checkOutDate: Moment;
  modalVisible: boolean;
  setModalVisible: (modleVisible: boolean) => void;
}

const { Paragraph, Text, Title } = Typography;

export const ListingCreateBookingModal = ({
  modalVisible,
  setModalVisible,
  price,
  checkInDate,
  checkOutDate,
}: Props) => {
  const daysBooked = checkOutDate.diff(checkInDate, "days") + 2;
  const listingPrice = price * daysBooked;
  const stripe = useStripe();
  const elements = useElements();
  const handleCreateBooking = async () => {
    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);

    let { token: stripeToken } = await stripe.createToken(
      cardElement as StripeCardElement
    );

    console.log(stripeToken);
  };

  return (
    <Modal
      visible={modalVisible}
      centered
      footer={null}
      onCancel={() => setModalVisible(false)}
    >
      <div className="listing-booking-modal">
        <div className="listing-booking-modal__intro">
          <Title className="listing-booking-modal__intro-title">
            <KeyOutlined />
          </Title>
          <Title level={3} className="listing-booking-modal__intro-title">
            Book your trip
          </Title>
          <Paragraph>
            Enter your payment information to book the listing from the dates
            between{" "}
            <Text mark strong>
              {moment(checkInDate).format("MMMM Do YYYY")}
            </Text>{" "}
            and{" "}
            <Text mark strong>
              {moment(checkOutDate).format("MMMM Do YYYY")}
            </Text>
            , inclusive.
          </Paragraph>
        </div>
        <Divider />
        <div className="listing-booking-modal__charge-summary">
          <Paragraph>
            {formatListingPrice(price, false)} * {daysBooked} days ={" "}
            <Text strong>{formatListingPrice(listingPrice, false)}</Text>
          </Paragraph>
          <Paragraph className="listing-booking-modal__charge-summary-total">
            Total = <Text mark>{formatListingPrice(listingPrice, false)}</Text>
          </Paragraph>
        </div>
        <Divider />

        <div className="listing-booking-modal__stripe-card-section">
          <CardElement
            options={{ hidePostalCode: true }}
            className="listing-booking-modal__stripe-card"
          />
          <Button
            size="large"
            type="primary"
            className="listing-booking-modal__cta"
            onClick={handleCreateBooking}
          >
            Book
          </Button>
        </div>
      </div>
    </Modal>
  );
};
