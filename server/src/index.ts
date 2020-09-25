import express, { Application } from "express";
import bodyParser from "body-parser";
import { ApolloServer } from "apollo-server-express";
import compression from "compression";
import { typeDefs, resolvers } from "./graphql";
import { connectDB } from "./database";
import cookieParser from "cookie-parser";

const mount = async (app: Application) => {
  const db = await connectDB();

  app.use(bodyParser.json({ limit: "2mb" }));
  app.use(cookieParser(process.env.SECRET));
  app.use(compression());

  app.use(express.static(`${__dirname}/client`));
  app.get("/*", (_req, res) => res.sendFile(`${__dirname}/client/index.html`));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ db, req, res }),
  });
  server.applyMiddleware({ app, path: "/api" });

  app.listen(process.env.PORT);

  console.log(`[app]: 🚀 running on: http://localhost:${process.env.PORT}`);
};

mount(express());
