# 🎨 아트워크 커미션 플랫폼

아티스트와 의뢰인을 연결하는 현대적인 커미션 마켓플레이스. React Router v7와 최신 웹 기술로 구축되었습니다.

## 🌟 주요 기능

### 핵심 플랫폼
- 🎨 **커미션 마켓플레이스**: 등록부터 완료까지 전체 생명주기 관리
- 👥 **아티스트 프로필**: 포트폴리오 전시 및 커미션 관리
- ⭐ **리뷰 시스템**: 완료된 작업에 대한 평점 및 후기
- 🏛️ **관리자 대시보드**: 종합적인 플랫폼 관리 도구

### 기술적 특징
- 🚀 **React Router v7 SSR**: 최신 데이터 로딩 패턴을 적용한 서버사이드 렌더링
- 🔒 **PostgreSQL + RLS**: 행 단위 보안으로 데이터 보호
- ⚡ **Optimistic UI**: 디바운싱된 API 호출로 즉시 피드백 제공
- 📊 **고급 데이터 테이블**: TanStack Table 기반 필터링 및 정렬
- 🎯 **TypeScript**: 자동 생성 라우트 타입으로 완전한 타입 안전성
- 🎨 **Shadcn UI**: 접근성을 고려한 일관된 디자인 시스템

## 🚀 시작하기

### 필요 조건
- Node.js 18+ 
- PostgreSQL 데이터베이스 (Supabase 권장)
- 환경변수 설정

### 설치

```bash
# 저장소 클론 및 의존성 설치
git clone <repository-url>
cd artwork
npm install

# 데이터베이스 설정
npm run db:migrate
npm run db:typegen
```

### 개발

```bash
# 개발 서버 시작
npm run dev

# 타입 체크 실행
npm run typecheck

# 데이터베이스 마이그레이션 생성
npm run db:generate
```

애플리케이션은 `http://localhost:5173`에서 실행됩니다.

## 🏗️ 아키텍처

### 기술 스택
- **프론트엔드**: React Router v7 + TypeScript
- **데이터베이스**: PostgreSQL (Supabase) + Drizzle ORM  
- **인증**: Supabase Auth + RLS 정책
- **UI**: Shadcn UI + Radix UI + TailwindCSS v4
- **이메일**: Resend 트랜잭션 이메일
- **배포**: Vercel

### 핵심 패턴
- **기능 기반 구조**: 비즈니스 도메인별 구성
- **타입 안전한 데이터 로딩**: 자동 타입 생성과 서버사이드 렌더링
- **Optimistic 업데이트**: 더 나은 UX를 위한 즉시 UI 피드백
- **행 단위 보안**: 데이터베이스 레벨 권한 제어
- **컴포넌트 조합**: Shadcn을 활용한 재사용 가능한 UI 패턴

## 📁 프로젝트 구조

```
app/
├── features/
│   ├── auth/          # 인증 및 권한 관리
│   ├── commissions/   # 커미션 마켓플레이스
│   ├── community/     # 커뮤니티 게시판
│   ├── users/         # 사용자 프로필 및 대시보드
│   └── reviews/       # 평점 및 리뷰 시스템
├── components/        # 공유 UI 컴포넌트
├── sql/              # 데이터베이스 마이그레이션 및 함수
└── routes.ts         # 애플리케이션 라우팅
```

## 🛠️ 프로덕션 빌드

```bash
npm run build
npm run start
```

## 🚀 배포

### Vercel (권장)
```bash
npm run build
vercel --prod
```

### 환경변수
```env
DATABASE_URL=your_supabase_connection_string
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
```

## 🔮 로드맵

### Phase 1 (현재 구현됨)
- ✅ 커미션 마켓플레이스 MVP
- ✅ 사용자 인증 및 프로필  
- ✅ 실시간 메시징 시스템
- ✅ 관리자 관리 도구

### Phase 2 (계획 중)
- 📸 고급 이미지 최적화 시스템
- 🔍 검색 및 필터링 개선
- 📊 분석 대시보드
- 💳 결제 시스템 연동
- 💬 실시간 메시징


## 📊 성능 특징

- **서버사이드 렌더링**: React Router v7로 SEO 최적화
- **Optimistic UI**: 디바운싱을 통한 즉시 사용자 피드백
- **데이터베이스 보안**: 행 단위 보안 정책 적용
- **타입 안전성**: 생성된 타입을 통한 완전한 TypeScript 커버리지
- **최신 스택**: React Router 최신 패턴 및 모범 사례 적용

---

성능과 사용자 경험을 핵심으로 하는 현대적인 웹 개발.

