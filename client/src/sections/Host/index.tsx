import React, { useState } from "react";
import {
  Layout,
  Typography,
  Form,
  Input,
  InputNumber,
  Radio,
  Upload,
  Button,
} from "antd";
import { Viewer } from "../../lib/types";
import { Link, Redirect } from "react-router-dom";
import { ListingType } from "../../lib/graphql/globalTypes";
import {
  BankOutlined,
  HomeOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  displayErrorMessage,
  displaySuccessNotification,
  iconColor,
} from "../../lib/utils";
import { UploadChangeParam } from "antd/lib/upload";
import { useMutation } from "@apollo/client";
import {
  HostListing as HostListingData,
  HostListingVariables,
} from "../../lib/graphql/mutations/HostListing/__generated__/HostListing";
import { HOST_LISTING } from "../../lib/graphql/mutations";

const { Content } = Layout;
const { Text, Title } = Typography;
const { Item } = Form;

interface Props {
  viewer: Viewer;
}

interface UserInput {
  address: string;
  city?: string;
  state?: string;
  zip?: string;
  type: string;
  title: string;
  description: string;
  price: number;
  numOfGuests: number;
  image: File;
}

export const Host = ({ viewer }: Props) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [hostListing, { loading, data }] = useMutation<
    HostListingData,
    HostListingVariables
  >(HOST_LISTING, {
    onError: () => {
      displayErrorMessage(
        "Sorry! We weren't able to create your listing. Please try again later."
      );
    },
    onCompleted: () => {
      displaySuccessNotification("You've successfully created your listing!");
    },
  });
  const handleImageUpload = (info: UploadChangeParam) => {
    const { file } = info;

    if (file.status === "uploading") {
      setImageLoading(true);
      return true;
    }

    if (file.status === "done" && file.originFileObj) {
      getBase64Value(file.originFileObj, (imageBase64) => {
        setImageBase64(imageBase64);
        setImageLoading(false);
      });
    }
  };

  const handleHostListing = (values: any) => {
    const { address, city, state, postalCode } = values;

    const fullAddress = `${address}, ${city}, ${state}, ${postalCode}`;

    const input = {
      ...values,
      address: fullAddress,
      image: imageBase64,
      price: values.price * 100,
    };

    delete input.city;
    delete input.state;
    delete input.zip;

    hostListing({
      variables: { input },
    });
  };

  if (!viewer.id || !viewer.hasWallet) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            You'll have to be signed in and connected with Stripe to host a
            listing!
          </Title>
          <Text type="secondary">
            We only allow users who're signed in to our application and have
            connected with Stripe to host new listings. You can sign in at the{" "}
            <Link to="/login">/login</Link> page and connect with Stripe shortly
            after.
          </Text>
        </div>
      </Content>
    );
  }

  if (loading) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            Please wait!
          </Title>
          <Text type="secondary">We're creating your listing now!</Text>
        </div>
      </Content>
    );
  }

  if (data && data.hostListing) {
    return <Redirect to={`/listing/${data.hostListing.id}`} />;
  }

  return (
    <Content className="host-content">
      <Form layout="vertical" onFinish={handleHostListing}>
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            Hi! Let's get started listing your place.
          </Title>
          <Text type="secondary">
            In this form, we'll collect some basic and additional information
            about your listing.
          </Text>
        </div>

        <Item
          label="Home Type"
          name="type"
          rules={[{ required: true, message: "Please select a home type!" }]}
        >
          <Radio.Group>
            <Radio.Button value={ListingType.APARTMENT}>
              <BankOutlined style={{ color: iconColor, paddingRight: "4px" }} />
              <span>Apartment</span>
            </Radio.Button>
            <Radio.Button value={ListingType.HOUSE}>
              <HomeOutlined style={{ color: iconColor, paddingRight: "4px" }} />
              <span>House</span>
            </Radio.Button>
          </Radio.Group>
        </Item>

        <Item
          label="Max # of Guests"
          name="numOfGuests"
          rules={[
            { required: true, message: "Please enter a max number of guests!" },
          ]}
        >
          <InputNumber min={1} placeholder="4" />
        </Item>

        <Item
          label="Title"
          extra="Max character count of 45"
          name="title"
          rules={[
            {
              required: true,
              message: "please enter a title of your listing!",
            },
          ]}
        >
          <Input
            maxLength={45}
            placeholder="The iconic and luxurious Bel-Ail mansion"
          />
        </Item>

        <Item
          label="Description"
          extra="Max character count of 400"
          name="description"
          rules={[
            {
              required: true,
              message: "please enter a description of your listing!",
            },
          ]}
        >
          <Input.TextArea
            maxLength={400}
            rows={3}
            placeholder="Modern, clean and ionic home of the Fresh prince. Situated in the heart of Bel-Air Los Angeles."
          />
        </Item>

        <Item
          label="Address"
          name="address"
          rules={[
            {
              required: true,
              message: "please enter a address of your listing!",
            },
          ]}
        >
          <Input placeholder="251 North Bristol Avenue" />
        </Item>

        <Item
          label="City/Town"
          name="city"
          rules={[
            {
              required: true,
              message: "please enter a city(or region) of your listing!",
            },
          ]}
        >
          <Input placeholder="Los Angeles" />
        </Item>

        <Item
          label="State/Province"
          name="state"
          rules={[
            {
              required: true,
              message: "please enter a state(or province) of your listing!",
            },
          ]}
        >
          <Input placeholder="California" />
        </Item>

        <Item
          label="Zip/Postal Code"
          name="zip"
          rules={[
            {
              required: true,
              message: "please enter a zip(or postal) code of your listing!",
            },
          ]}
        >
          <Input placeholder="Please enter a zip code for your listing!" />
        </Item>

        <Item
          label="Price"
          extra="All prices in $USD/day"
          name="price"
          rules={[
            {
              required: true,
              message: "please enter a price of your listing!",
            },
          ]}
        >
          <InputNumber min={0} placeholder="120" />
        </Item>

        <Item
          label="Images"
          extra="Images have to be under 1MB in size and of type JPG or PNG"
          name="image"
          rules={[
            {
              required: true,
              message: "please enter a image of your listing!",
            },
          ]}
        >
          <div className="host__form-image-upload">
            <Upload
              name="image"
              listType="picture-card"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeImageUpload}
              onChange={handleImageUpload}
            >
              {imageBase64 ? (
                <img src={imageBase64} alt="listing" />
              ) : (
                <div>
                  {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div className="ant-upload-text">Upload</div>
                </div>
              )}
            </Upload>
          </div>
        </Item>

        <Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Item>
      </Form>
    </Content>
  );
};

const beforeImageUpload = (file: File) => {
  const isTypeValid = file.type === "image/jpeg" || file.type === "image/png";
  const isSizeValid = file.size / 1024 / 1024 < 1;

  if (!isTypeValid) {
    displayErrorMessage("You're only able to upload valid JPG or PNG files!");
  }

  if (!isSizeValid) {
    displayErrorMessage(
      "You're only able to upload valid image files of under 1MB in size!"
    );
  }

  return isTypeValid && isSizeValid;
};

const getBase64Value = (
  img: File | Blob,
  cb: (imageBase64: string) => void
) => {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  reader.onload = () => {
    cb(reader.result as string);
  };
};
