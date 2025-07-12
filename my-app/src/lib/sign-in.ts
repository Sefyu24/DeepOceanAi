import { authClient } from "@/lib/auth-client"; //import the auth client

await authClient.signIn.social({
  provider: "github",
  /**
   * A URL to redirect after the user authenticates with the provider
   * @default "/"
   */
  callbackURL: "/dashboard",
  /**
   * A URL to redirect if an error occurs during the sign in process
   */
  errorCallbackURL: "/error",
  /**
   * A URL to redirect if the user is newly registered
   */
  newUserCallbackURL: "/welcome",
  /**
   * disable the automatic redirect to the provider.
   * @default false
   */
  disableRedirect: true,
});
