import axios from "axios";

/**
 * Extracts a human-readable error message from any caught error.
 * Handles Axios errors (server response messages), generic Error objects,
 * and unknown values gracefully.
 */
export function extractErrorMessage(err, fallback) {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message ?? err.message ?? fallback;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return fallback;
}
