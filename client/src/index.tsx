import React, { useState } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import {
  Home,
  Host,
  Listing,
  Listings,
  User,
  Login,
  NotFound,
} from "./sections";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Layout } from "antd";
import "./styles/index.css";
import { Viewer } from "./lib/types";

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache(),
});

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  console.log(viewer);
  return (
    <Router>
      <Layout id="app">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/host" component={Host} />
          <Route exact path="/listing/:id" component={Listing} />
          <Route exact path="/listings/:location?" component={Listings} />
          <Route
            exact
            path="/login"
            render={(props) => <Login {...props} setViewer={setViewer} />}
          />
          <Route exact path="/user/:id" component={User} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  );
};

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
