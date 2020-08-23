// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./graphql";
import { connectDB } from "./database";
import cookieParser from "cookie-parser";

const mount = async (app: Application) => {
  const db = await connectDB();

  app.use(cookieParser(process.env.SECRET));
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ db, req, res }),
  });
  server.applyMiddleware({ app, path: "/api" });

  app.listen(process.env.PORT);

  console.log(`[app]: running on: http://localhost:${process.env.PORT}`);
};

mount(express());
