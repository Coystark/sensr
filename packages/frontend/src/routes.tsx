import React from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";

interface IRouteProps {
  authenticate?: boolean;
  path: string;
  icon?: React.ReactNode;
  title?: string;
}

const availableRoutes = [
  "createCustomer",
  "createProduct",
  "createProposal",
  "signIn",
  "signUp",
] as const;

type IRouteMapping = {
  [key in typeof availableRoutes[number]]: IRouteProps;
};

export const appRoutes: IRouteMapping = {
  signIn: {
    path: "/sign-in",
  },
  signUp: {
    path: "/sign-up",
  },
  createCustomer: {
    authenticate: true,
    path: "/",
    title: "Criar cliente",
    icon: <PeopleIcon />,
  },
  createProduct: {
    authenticate: true,
    path: "/create-product",
    title: "Criar produto",
    icon: <ShoppingCartIcon />,
  },
  createProposal: {
    authenticate: true,
    path: "/create-proposal",
    title: "Criar proposta",
    icon: <BarChartIcon />,
  },
};
