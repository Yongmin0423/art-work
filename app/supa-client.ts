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
      };
    };
  }
>;

export const browserclient = createBrowserClient<Database>(
  "https://utlsbgksqrdprpugvplk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0bHNiZ2tzcXJkcHJwdWd2cGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMjg1NDYsImV4cCI6MjA2MzkwNDU0Nn0.Dwy66aQSjekMnDFiSCN25U_odUg9hi92bkg9oD02wKI"
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
