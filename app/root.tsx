import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigation,
} from "react-router";
import { Settings } from "luxon";

import type { Route } from "./+types/root";
import "./app.css";
import Navigation from "./components/navigation";
import { makeSSRClient } from "./supa-client";
import { getUserById } from "./features/users/queries";

export const links: Route.LinksFunction = () => [
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  Settings.defaultLocale = "ko";
  Settings.defaultZone = "Asia/Seoul";
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Links />
        <Meta />
      </head>
      <body>
        <main>{children}</main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  console.log("=== ROOT LOADER START ===");
  console.log("Request URL:", request.url);
  console.log("Request headers - Cookie:", request.headers.get("Cookie"));
  
  const { client } = makeSSRClient(request);
  console.log("Client created successfully");
  
  const {
    data: { user },
    error: authError
  } = await client.auth.getUser();
  
  console.log("Auth result:", {
    user_id: user?.id,
    user_email: user?.email,
    user_exists: !!user,
    auth_error: authError?.message
  });
  
  if (user) {
    console.log("User found, getting profile...");
    try {
      const profile = await getUserById(client, { id: user.id });
      console.log("Profile result:", {
        profile_id: profile?.profile_id,
        username: profile?.username,
        name: profile?.name,
        profile_exists: !!profile
      });
      return { user, profile };
    } catch (error) {
      console.error("Profile fetch error:", error);
      return { user, profile: null };
    }
  }
  
  console.log("No user found, returning null");
  return { user: null, profile: null };
};

export default function App({ loaderData }: Route.ComponentProps) {
  const { pathname } = useLocation();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const isLoggedIn = loaderData.user !== null;

  return (
    <>
      <div className={pathname.includes("/auth/") ? "" : "lg:p-28"}>
        {pathname.includes("/auth") ? null : (
          <Navigation
            isLoggedIn={isLoggedIn}
            avatarUrl={loaderData.profile?.avatar_url}
            username={loaderData.profile?.username}
            name={loaderData.profile?.name}
            hasNotifications={false}
            hasMessages={false}
            isAdmin={loaderData.profile?.role === "admin"}
          />
        )}
        <Outlet
          context={{
            isLoggedIn,
            name: loaderData.profile?.name,
            userId: loaderData.user?.id,
            username: loaderData.profile?.username,
            avatar: loaderData.profile?.avatar_url,
            email: loaderData.user?.email,
            isAdmin: loaderData.profile?.role === "admin",
          }}
        />
      </div>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
