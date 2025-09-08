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
          Row: SetFieldType<
            SetNonNullable<
              SupabaseDatabase["public"]["Views"]["community_post_list_view"]["Row"]
            >,
            "author_avatar",
            string | null
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
  // 클라이언트로 보낼 응답 헤더를 저장할 객체 (주로 Set-Cookie 헤더용)
  const headers = new Headers();
  
  // 서버사이드에서 사용할 Supabase 클라이언트 생성
  const serverSideClient = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        // 클라이언트가 보낸 쿠키에서 인증 정보 읽기
        getAll() {
          // HTTP 요청 헤더에서 Cookie 문자열 추출 ("token=abc; theme=dark" 형태)
          const cookieHeader = request.headers.get("Cookie") ?? "";
          // 쿠키 문자열을 파싱하여 객체 배열로 변환
          const cookies = parseCookieHeader(cookieHeader);
          // Supabase가 요구하는 형태로 쿠키 데이터 변환 (undefined 방어 처리)
          return cookies.map((cookie) => ({
            name: cookie.name,
            value: cookie.value ?? "",
          }));
        },
        // 새로운 쿠키를 클라이언트로 보내기 (로그인/로그아웃 시 토큰 설정)
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // 쿠키 객체를 "name=value; Path=/; HttpOnly" 형태 문자열로 변환
            // 응답 헤더에 Set-Cookie 추가하여 브라우저에 쿠키 설정 지시
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
    client: serverSideClient, // 데이터베이스 작업에 사용할 Supabase 클라이언트
    headers, // loader/action에서 응답에 포함할 헤더들 (쿠키 설정용)
  };
};
