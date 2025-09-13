# 코드 스타일 및 컨벤션

## React Router v7 특화 컨벤션

### 컴포넌트 타입 정의
```typescript
// 페이지 컴포넌트는 Route.ComponentProps 사용
export default function MyPage({ loaderData, actionData }: Route.ComponentProps) {
  // useLoaderData(), useActionData() 사용 안함 - props로 전달받음
}

// 라우트 타입 import
import type { Route } from "./+types/my-page";
```

### 데이터 로딩 패턴
```typescript
// loader에서 plain object 반환 (json() 래퍼 불필요)
export async function loader() {
  return { data: await fetchData() };
}

// 특정 상태코드 필요시에만 data() 헬퍼 사용
export async function action() {
  return data({ success: true }, { status: 201 });
}
```

## 데이터베이스 컨벤션

### 테이블 설계 패턴
- 모든 테이블에 UUID 기본키 사용 (`defaultRandom()`)
- 한국 시간대 기본 설정 (`Asia/Seoul`)
- RLS(Row Level Security) 정책을 테이블 정의와 함께 인라인으로 작성
- Supabase Auth와 profile 테이블 동기화

### 스키마 구조
- 기능별로 schema.ts 파일 분산 관리
- 공통 스키마는 `app/common/schema.ts`
- 마이그레이션은 `app/sql/migrations/` 디렉토리

## UI 컴포넌트 컨벤션

### Import 규칙
```typescript
// Shadcn UI 컴포넌트만 사용 (Radix 직접 import 금지)
import { Button } from "~/components/ui/button";
// import { Button } from "@radix-ui/react-button"; // ❌ 금지
```

### 컴포넌트 작성 패턴
- 함수형 컴포넌트 + TypeScript 인터페이스 사용
- enum 대신 map 객체로 상수 관리
- 불린 변수는 보조동사 사용 (`isLoading`, `hasError`)

## 파일 구조 패턴

### Feature 기반 구조
```
app/features/{feature}/
├── pages/          # 라우트 컴포넌트
├── components/     # 기능별 컴포넌트  
├── layouts/        # 중첩 라우팅용 레이아웃
├── queries.ts      # 데이터 조회 함수
├── mutations.ts    # 데이터 변경 함수
├── schema.ts       # DB 스키마 정의
└── constants.ts    # 기능별 상수
```

## TypeScript 설정
- Strict 모드 활성화
- Path alias: `~/` → `./app/`
- ES2022 타겟, ESM 모듈 시스템
- Vite 클라이언트 타입 지원