import { useCallback } from "react";

export const useCurrencyFormat = () => {
  const formatCurrency = useCallback(
    (options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        ...options,
      }),
    []
  );

  return { unformatCurrency, formatCurrency };
};

function unformatCurrency(value = "") {
  return Number.parseInt(value.replace(/\D/g, ""), 10) / 100;
}
