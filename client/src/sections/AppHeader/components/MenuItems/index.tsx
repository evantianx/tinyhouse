import React from "react";
import { Button, Menu } from "antd";
import { Link } from "react-router-dom";
import { HomeOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Viewer } from "../../../../lib/types";
import Avatar from "antd/lib/avatar/avatar";
import { useMutation } from "@apollo/client";
import { LOG_OUT } from "../../../../lib/graphql/mutations";
import { LogOut as LogOutData } from "../../../../lib/graphql/mutations/LogOut/__generated__/LogOut";
import {
  displaySuccessNotification,
  displayErrorMessage,
} from "../../../../lib/utils";

const { Item, SubMenu } = Menu;
interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const MenuItems = ({ viewer, setViewer }: Props) => {
  const [logOut] = useMutation<LogOutData>(LOG_OUT, {
    onCompleted: (data) => {
      if (data && data.logOut) {
        setViewer(data.logOut);
        sessionStorage.removeItem("token");
        displaySuccessNotification("You've successfully logged out!");
      }
    },
    onError: (_data) => {
      displayErrorMessage(
        "Sorry! We weren't able to log you out. Please try again later."
      );
    },
  });

  const handleLogOut = () => {
    logOut();
  };
  const subMenuLogin =
    viewer.avatar && viewer.id ? (
      <SubMenu title={<Avatar src={viewer.avatar} />}>
        <Item key="/user">
          <Link to={`/user/${viewer.id}`}>
            <UserOutlined />
            Profile
          </Link>
        </Item>
        <Item key="/logout">
          <div onClick={handleLogOut}>
            <LogoutOutlined />
            Logout
          </div>
        </Item>
      </SubMenu>
    ) : (
      <Item key="/login">
        <Link to="/login">
          <Button type="primary">Sign In</Button>
        </Link>
      </Item>
    );

  return (
    <Menu mode="horizontal" selectable={false} className="menu">
      <Item key="/host">
        <Link to="/host">
          <HomeOutlined />
          Host
        </Link>
      </Item>
      {subMenuLogin}
    </Menu>
  );
};
