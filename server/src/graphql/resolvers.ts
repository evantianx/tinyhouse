import { IResolvers } from "apollo-server-express";
import { listings, Listing } from "../listings";

export const resolvers: IResolvers = {
  Query: {
    listings: (): Listing[] => listings,
  },
  Mutation: {
    deleteListing: (_root: undefined, { id }: { id: string }): Listing => {
      const idx = listings.findIndex((l) => l.id === id);
      if (idx !== -1) return listings.splice(idx, 1)[0];
      throw new Error("failed to delete listing");
    },
  },
};
