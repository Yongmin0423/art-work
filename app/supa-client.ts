import { createClient } from "@supabase/supabase-js";
import type { MergeDeep, SetFieldType, SetNonNullable } from "type-fest";
import type { Database as SupabaseDatabase } from "database.types";

type Database = MergeDeep<
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

const client = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);
export default client;
