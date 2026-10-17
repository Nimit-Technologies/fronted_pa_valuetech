/**
 * The one place a caught error becomes something a user can read.
 *
 * Duck-typed rather than gated on `axios.isAxiosError`: the same shape reaches
 * here from a rethrow, from a hook that already handled and re-raised it, and
 * from a test double that is not a real AxiosError — and all of them carry
 * exactly the fields worth reading. Checking the class instead meant those
 * cases silently fell through to the fallback.
 *
 * Order matters:
 *   data.message            the API's own sentence, written for a user
 *   data.errors[0].message  a failed zod parse answers with issues and no
 *                           top-level message, so the first issue is the only
 *                           readable thing in the payload
 *   err.message             axios's own text: "Network Error", "timeout of
 *                           30000ms exceeded"
 *   fallback                nothing usable, so the caller's wording wins
 */
export function extractErrorMessage(err, fallback) {
  const data = err?.response?.data;

  if (data) {
    const apiMessage = data.message ?? data.errors?.[0]?.message;
    if (typeof apiMessage === "string" && apiMessage.trim()) return apiMessage;
  }

  if (typeof err?.message === "string" && err.message.trim()) {
    return err.message;
  }

  return fallback;
}
