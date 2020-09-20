import { IResolvers } from "apollo-server-express";
import { Request } from "express";
import { ObjectId } from "mongodb";
import { Google } from "../../../lib/api";
import { Database, Listing, User } from "../../../lib/types";
import { authorize } from "../../../lib/utils";
import {
  ListingArgs,
  ListingBookingsArgs,
  ListingBookingsData,
  ListingsFilter,
  ListingsArgs,
  ListingsData,
  ListingsQuery,
} from "./types";

export const listingResolvers: IResolvers = {
  Query: {
    listing: async (
      _root: undefined,
      { id }: ListingArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<Listing> => {
      try {
        const listing = await db.listings.findOne({ _id: new ObjectId(id) });
        if (!listing) {
          throw new Error("listing can't be found");
        }

        const viewer = await authorize(db, req);
        if (viewer?._id === listing.host) {
          listing.authorized = true;
        }

        return listing;
      } catch (err) {
        throw new Error(`Failed to query listing: ${err}`);
      }
    },
    listings: async (
      _root: undefined,
      { location, filter, limit, page }: ListingsArgs,
      { db }: { db: Database }
    ): Promise<ListingsData> => {
      try {
        const query: ListingsQuery = {};
        const data: ListingsData = {
          region: null,
          total: 0,
          result: [],
        };

        if (location) {
          // const { country, admin, city } = await Google.geocode(location);

          // if (city) query.city = city;
          // if (admin) query.admin = admin;
          // if (country) {
          //   query.country = country;
          // } else {
          //   throw new Error("no country found");
          // }
          // const cityText = city ? `${city},` : '';
          // const adminText = admin ? `${admin}` : ''
          // data.region = `${cityText}${adminText}${country}`
          query.country = "Canada";
          data.region = "Toronto, Ontario, Canada";

          if (location.toLowerCase() === "us") {
            data.region = "United States";
            return data;
          }
        }

        let cursor = await db.listings.find(query);

        if (filter) {
          cursor = cursor.sort({
            price: filter === ListingsFilter.PRICE_LOW_TO_HIGH ? 1 : -1,
          });
        }
        // skip what we already fetched
        cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
        cursor = cursor.limit(limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      } catch (err) {
        throw new Error(`Failed to query user listings: ${err}`);
      }
    },
  },
  Listing: {
    id: (listing: Listing): string => {
      return listing._id.toString();
    },
    host: async (
      listing: Listing,
      _args: unknown,
      { db }: { db: Database }
    ): Promise<User> => {
      const host = await db.users.findOne({ _id: listing.host });
      if (!host) {
        throw new Error("host can't be found");
      }

      return host;
    },
    bookingsIndex: (listing: Listing): string => {
      return JSON.stringify(listing.bookingsIndex);
    },
    bookings: async (
      listing: Listing,
      { limit, page }: ListingBookingsArgs,
      { db }: { db: Database }
    ): Promise<ListingBookingsData | null> => {
      try {
        if (!listing.authorized) {
          return null;
        }

        const data: ListingBookingsData = {
          total: 0,
          result: [],
        };

        let cursor = await db.bookings.find({
          _id: { $in: listing.bookings },
        });

        // skip what we already fetched
        cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
        cursor = cursor.limit(limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      } catch (err) {
        throw new Error(`Failed to query listing bookings: ${err}`);
      }
    },
  },
};
