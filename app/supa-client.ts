import {
  createBrowserClient,
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
  type CookieOptions,
} from "@supabase/ssr";
import type { MergeDeep, SetFieldType, SetNonNullable } from "type-fest";
import type { Database as SupabaseDatabase } from "database.types";

export type Database = MergeDeep<
  SupabaseDatabase,
  {
    public: {
      Views: {
        commission_with_artist: {
          Row: SetFieldType<
            SetFieldType<
              SetFieldType<
                SetNonNullable<
                  SupabaseDatabase["public"]["Views"]["commission_with_artist"]["Row"]
                >,
                "artist_avatar_url",
                string | null
              >,
              "images",
              string[]
            >,
            "tags",
            string[]
          >;
        };
        community_post_list_view: {
          Row: SetNonNullable<
            SupabaseDatabase["public"]["Views"]["community_post_list_view"]["Row"]
          >;
        };
      };
    };
  }
>;

export const browserclient = createBrowserClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const makeSSRClient = (request: Request) => {
  const headers = new Headers();
  const serverSideClient = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookieHeader = request.headers.get("Cookie") ?? "";
          const cookies = parseCookieHeader(cookieHeader);
          // value가 undefined일 수 있으므로 빈 문자열로 대체
          return cookies.map((cookie) => ({
            name: cookie.name,
            value: cookie.value ?? "",
          }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            headers.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, options)
            );
          });
        },
      },
    }
  );

  return {
    client: serverSideClient,
    headers,
  };
};
