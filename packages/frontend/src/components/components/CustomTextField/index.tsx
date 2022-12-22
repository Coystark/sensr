/* eslint-disable func-names */
import * as React from "react";
import MuiTextField, {
  TextFieldProps as MuiTextFieldProps,
} from "@mui/material/TextField";
import { FieldProps, getIn } from "formik";
import { useCurrencyFormat } from "hooks/use-currency";

export interface TextFieldProps
  extends FieldProps,
    Omit<MuiTextFieldProps, "name" | "value" | "error"> {
  currency?: boolean;
}

export function fieldToTextField({
  disabled,
  field: { onBlur: fieldOnBlur, ...field },
  form: { isSubmitting, touched, errors },
  onBlur,
  helperText,
  ...props
}: TextFieldProps): MuiTextFieldProps {
  const fieldError = getIn(errors, field.name);
  const showError = getIn(touched, field.name) && !!fieldError;

  return {
    error: showError,
    helperText: showError ? fieldError : helperText,
    disabled: disabled ?? isSubmitting,
    onBlur:
      onBlur ??
      function (e) {
        fieldOnBlur(e ?? field.name);
      },
    ...field,
    ...props,
  };
}

export function CustomTextField({ children, ...props }: TextFieldProps) {
  const fieldToTextFieldProps = fieldToTextField(props);
  const { formatCurrency, unformatCurrency } = useCurrencyFormat();

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (props.currency) {
        e.target.value = String(unformatCurrency(e.target.value));
      }

      if (fieldToTextFieldProps.onChange) {
        fieldToTextFieldProps.onChange(e);
      }
    },
    [fieldToTextFieldProps, unformatCurrency, props.currency]
  );

  const formatValue = React.useMemo(() => {
    if (props.currency) {
      return formatCurrency().format(Number(fieldToTextFieldProps.value));
    }

    return fieldToTextFieldProps.value;
  }, [fieldToTextFieldProps, formatCurrency, props.currency]);

  return (
    <MuiTextField
      {...fieldToTextFieldProps}
      onChange={handleChange}
      value={formatValue}
    >
      {children}
    </MuiTextField>
  );
}

CustomTextField.displayName = "FormikMaterialUITextField";
