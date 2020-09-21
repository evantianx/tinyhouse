import React, { useEffect, useState } from "react";
import { Layout, Input } from "antd";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";

import logo from "./assets/tinyhouse-logo.png";
import { MenuItems } from "./components";
import { Viewer } from "../../lib/types";
import { displayErrorMessage } from "../../lib/utils";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Header } = Layout;
const { Search } = Input;

export const AppHeader = withRouter(
  ({ viewer, setViewer, location, history }: Props & RouteComponentProps) => {
    const [search, setSearch] = useState("");

    useEffect(() => {
      const { pathname } = location;

      if (!pathname.includes("/listings")) {
        setSearch("");
      } else {
        const pathnameArr = pathname.split("/");
        if (pathnameArr.length === 3) {
          setSearch(pathnameArr[2]);
        }
      }
    }, [location]);

    const onSearch = (value: string) => {
      value.trim()
        ? history.push(`/listings/${value.trim()}`)
        : displayErrorMessage("Please enter a valid search!");
    };

    return (
      <Header className="app-header">
        <div className="app-header__logo-search-section">
          <div className="app-header__logo">
            <Link to="/">
              <img src={logo} alt="App logo" />
            </Link>
          </div>
          <div className="app-header__search-input">
            <Search
              placeholder="Search 'Toronto'"
              enterButton
              value={search}
              onChange={(evt) => setSearch(evt.target.value)}
              onSearch={onSearch}
            />
          </div>
        </div>
        <div className="app-header__menu-section">
          <MenuItems viewer={viewer} setViewer={setViewer} />
        </div>
      </Header>
    );
  }
);
