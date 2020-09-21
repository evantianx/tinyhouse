import React, { useEffect, useRef, useState } from "react";
import { Layout, List, Typography, Affix } from "antd";
import { useQuery } from "@apollo/client";
import {
  Listings as ListingsData,
  ListingsVariables,
} from "../../lib/graphql/queries/Listings/__generated__/Listings";
import { LISTINGS } from "../../lib/graphql/queries";
import { ListingsFilter } from "../../lib/graphql/globalTypes";
import { ErrorBanner, ListingCard } from "../../lib/components";
import { Link, RouteComponentProps } from "react-router-dom";
import {
  ListingPagination,
  ListingsFilterSection,
  ListingsSkeleton,
} from "./components";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const PAGE_LIMIT = 8;

interface MatchParams {
  location: string;
}

export const Listings = ({ match }: RouteComponentProps<MatchParams>) => {
  const [filter, setFilter] = useState(ListingsFilter.PRICE_LOW_TO_HIGH);
  const [page, setPage] = useState(1);
  const locationRef = useRef(match.params.location);
  const { data, loading, error } = useQuery<ListingsData, ListingsVariables>(
    LISTINGS,
    {
      skip: locationRef.current !== match.params.location && page !== 1,
      variables: {
        location: match.params.location,
        limit: PAGE_LIMIT,
        filter,
        page,
      },
    }
  );

  useEffect(() => {
    setPage(1);
  }, [match.params.location]);

  if (loading || error) {
    return (
      <Content className="listings">
        {error && (
          <ErrorBanner description="We either couldn't find anything matching your search or have encountered an error. If you're searching for a unique location, try searching again with more common keywords" />
        )}
        <ListingsSkeleton />
      </Content>
    );
  }

  const listings = data?.listings;
  const listingsRegion = listings?.region;

  const listingsSectionElement =
    listings && listings.result.length ? (
      <>
        <Affix offsetTop={64}>
          <ListingPagination
            total={listings.total}
            page={page}
            limit={PAGE_LIMIT}
            setPage={setPage}
          />
          <ListingsFilterSection filter={filter} setFilter={setFilter} />
        </Affix>
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
