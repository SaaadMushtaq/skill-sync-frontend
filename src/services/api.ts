import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";
import type { AppDispatch } from "../store/store";
import { logout } from "../store/slices/authSlice";

// Step 1 — raw baseQuery with baseUrl and auth header
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Step 2 — wrap with interceptor for 401/403 auto logout
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;
    const url = typeof args === "string" ? args : args.url;
    const isAuthEndpoint =
      url.includes("/auth/login") || url.includes("/auth/register");

    if ((status === 401 || status === 403) && !isAuthEndpoint) {
      // dispatch logout to clear Redux state and localStorage
      (api.dispatch as AppDispatch)(logout());

      // redirect to login page
      window.location.href = "/login";
    }
  }

  return result;
};
