import axios from "axios";

export const handleRequestError = (
  error: any,
  knownErrorCb: (error: string) => void,
  unknownErrorCb: () => void
): void => {
  if (
    axios.isAxiosError(error) &&
    error.response &&
    (error.response.status > 400 || error.response.status < 500)
  ) {
    knownErrorCb(error.response.data.message);
    return;
  }

  unknownErrorCb();
};
