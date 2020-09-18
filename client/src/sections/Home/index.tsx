import React from "react";
import { Layout } from "antd";
import { HomeHero } from "./components";

import mapBackGround from "./assets/map-background.jpg";
import { RouteComponentProps } from "react-router-dom";
import { displayErrorMessage } from "../../lib/utils";

const { Content } = Layout;
export const Home = ({ history }: RouteComponentProps) => {
  const onSearch = (value: string) => {
    value.trim()
      ? history.push(`listings/${value.trim()}`)
      : displayErrorMessage("Please enter a valid search!");
  };
  return (
    <Content
      className="home"
      style={{ backgroundImage: `url(${mapBackGround})` }}
    >
      <HomeHero onSearch={onSearch} />
    </Content>
  );
};
