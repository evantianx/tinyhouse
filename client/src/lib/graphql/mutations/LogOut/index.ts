import { gql } from "@apollo/client";

export const LOG_OUT = gql`
  mutation LogOut {
    logIn {
      id
      token
      avatar
      hasWallet
      didRequest
    }
  }
`;
