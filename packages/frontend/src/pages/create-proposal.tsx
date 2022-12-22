import React, { ReactElement, useMemo, useRef, useState } from "react";
import { AuthenticatedLayout } from "components/Layouts/Authenticated";
import { appRoutes } from "routes";
import { useToast } from "use-toast-mui";
import {
  createProposalMutation,
  getCustomersQuery,
  getProductsQuery,
} from "services/api";
import { Formik, Form, Field, FormikProps } from "formik";
import * as Yup from "yup";
import { Autocomplete } from "formik-mui";
import {
  Button,
  TextField as MuiTextField,
  AutocompleteRenderInputParams,
  Typography,
} from "@mui/material";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { useDebounce } from "react-use";

const schemaValidation = Yup.object().shape({
  customer: Yup.object().nullable().required("Selecione um cliente"),
  products: Yup.array().min(2, "Selecione pelo menos dois produto"),
});

const initialValues = {
  customer: null,
  products: [],
};

const Page = () => {
  const toast = useToast();
  const formikRef = useRef<FormikProps<typeof initialValues>>(null);

  const [customerInput, setCustomerInput] = useState("");
  const [debouncedCustomerInput, setDebouncedCustomerInput] = useState("");

  const [productInput, setProductInput] = useState("");
  const [debouncedProductInput, setDebouncedProductInput] = useState("");

  useDebounce(
    () => {
      setDebouncedCustomerInput(customerInput);
    },
    500,
    [customerInput]
  );

  useDebounce(
    () => {
      setDebouncedProductInput(customerInput);
    },
    500,
    [productInput]
  );

  const q = useMemo(
    () => ({
      customer: RequestQueryBuilder.create({
        search: {
          $or: [
            { name: { $contL: debouncedCustomerInput } },
            { email: { $contL: debouncedCustomerInput } },
          ],
        },
        sort: [{ field: "name", order: "ASC" }],
        limit: 5,
      }).query(),
      products: RequestQueryBuilder.create({
        search: { name: { $contL: debouncedProductInput } },
        sort: [{ field: "name", order: "ASC" }],
        limit: 5,
      }).query(),
    }),
    [debouncedCustomerInput, debouncedProductInput]
  );

  const customersQuery = getCustomersQuery({
    appendToUrl: `?${q.customer}`,
    options: {
      staleTime: Number.POSITIVE_INFINITY,
    },
  });

  const productsQuery = getProductsQuery({
    appendToUrl: `?${q.products}`,
    options: {
      staleTime: Number.POSITIVE_INFINITY,
    },
  });

  const createProposal = createProposalMutation({
    options: {
      onSuccess() {
        formikRef.current?.resetForm();

        toast.success("Proposta criada com sucesso!");
      },
      onError() {
        toast.error("Error desconhecido, tente novamente.");
      },
    },
  });

  if (customersQuery.isError || productsQuery.isError) {
    return <Typography>Erro ao carregar os dados</Typography>;
  }

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      onSubmit={(values) => createProposal.mutateAsync({ data: values })}
      validationSchema={schemaValidation}
    >
      {({ isSubmitting, touched, errors }) => (
        <Form noValidate>
          <Field
            name="customer"
            component={Autocomplete}
            options={customersQuery?.data || []}
            getOptionLabel={(option: any) => `${option.name} (${option.email})`}
            onInputChange={(event: any, value: any, reason: any) => {
              if (reason === "input") {
                setCustomerInput(value);
              }
            }}
            loading={customersQuery.isLoading}
            loadingText="Carregando..."
            renderInput={(params: AutocompleteRenderInputParams) => (
              <MuiTextField
                {...params}
                name="customer"
                error={touched.customer && !!errors.customer}
                helperText={touched.customer && errors.customer}
                label="Cliente"
                margin="normal"
                fullWidth
              />
            )}
          />
          <Field
            name="products"
            multiple
            component={Autocomplete}
            options={productsQuery?.data || []}
            getOptionLabel={(option: any) => option.name}
            loading={productsQuery.isLoading}
            loadingText="Carregando..."
            onInputChange={(event: any, value: any, reason: any) => {
              if (reason === "input") {
                setProductInput(value);
              }
            }}
            renderInput={(params: AutocompleteRenderInputParams) => (
              <MuiTextField
                {...params}
                name="products"
                error={touched.products && !!errors.products}
                helperText={touched.products && errors.products}
                label="Produtos"
                margin="normal"
                fullWidth
              />
            )}
          />
          <Button
            disabled={isSubmitting}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Criar proposta
          </Button>
        </Form>
      )}
    </Formik>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthenticatedLayout title={appRoutes.createProposal.title as string}>
      {page}
    </AuthenticatedLayout>
  );
};

export async function getStaticProps() {
  return {
    props: {
      authenticate: appRoutes.createProposal.authenticate,
    },
  };
}

export default Page;
