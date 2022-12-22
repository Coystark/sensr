import { buildMutation, buildQuery } from "react-query-restful";

// Mutations
export const { createMutation: signInMutation } = buildMutation({
  path: "auth/sign-in",
});
export const { createMutation: signUpMutation } = buildMutation({
  path: "auth/sign-up",
});
export const { createMutation: createCustomerMutation } = buildMutation({
  path: "customers",
});

export const { createMutation: createProductMutation } = buildMutation({
  path: "products",
});

export const { createMutation: createProposalMutation } = buildMutation({
  path: "proposals",
});

// Queries
export const getCustomersQuery = buildQuery({ path: "customers" });
export const getProductsQuery = buildQuery({ path: "products" });
