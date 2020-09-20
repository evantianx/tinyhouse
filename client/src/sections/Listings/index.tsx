import React, { useState } from "react";
import { Layout, List, Typography } from "antd";
import { useQuery } from "@apollo/client";
import {
  Listings as ListingsData,
  ListingsVariables,
} from "../../lib/graphql/queries/Listings/__generated__/Listings";
import { LISTINGS } from "../../lib/graphql/queries";
import { ListingFilter } from "../../lib/graphql/globalTypes";
import { ListingCard } from "../../lib/components";
import { Link, RouteComponentProps } from "react-router-dom";
import { ListingsFilterSection } from "./components";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const PAGE_LIMIT = 8;

interface MatchParams {
  location: string;
}

export const Listings = ({ match }: RouteComponentProps<MatchParams>) => {
  const [filter, setFilter] = useState(ListingFilter.PRICE_LOW_TO_HIGH);
  const { data, loading } = useQuery<ListingsData, ListingsVariables>(
    LISTINGS,
    {
      variables: {
        location: match.params.location,
        limit: PAGE_LIMIT,
        filter,
        page: 1,
      },
    }
  );

  const listings = data?.listings;
  const listingsRegion = listings?.region;

  const listingsSectionElement =
    listings && listings.result.length ? (
      <>
        <ListingsFilterSection filter={filter} setFilter={setFilter} />
        <List
          grid={{
            gutter: 8,
            xs: 1,
            sm: 2,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          dataSource={listings.result}
          renderItem={(listing) => (
            <List.Item>
              <ListingCard listing={listing} />
            </List.Item>
          )}
        />
      </>
    ) : (
      !loading && (
        <div>
          <Paragraph>
            It appears that no listings have been created for{""}
            <Text mark>{listingsRegion}</Text>
            <Paragraph>
              Be the first person to create a{" "}
              <Link to="/host">listing in this area</Link>
            </Paragraph>
          </Paragraph>
        </div>
      )
    );

  const listingsRegionElement = listingsRegion ? (
    <Title level={3} className="listings__title">
      Results for {listingsRegion}
    </Title>
  ) : null;

  return (
    <Content className="listings">
      {listingsRegionElement}
      {listingsSectionElement}
    </Content>
  );
};
