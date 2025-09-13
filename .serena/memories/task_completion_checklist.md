# 작업 완료 후 체크리스트

## 필수 확인 사항

### 1. 타입 체크
```bash
npm run typecheck
```
- TypeScript 컴파일 오류 없음
- React Router v7 라우트 타입 생성 확인
- 새로운 라우트 추가시 경로 타입 자동 생성 확인

### 2. 빌드 테스트  
```bash
npm run build
```
- 프로덕션 빌드 성공 확인
- 번들 크기 및 최적화 확인
- SSR 렌더링 오류 없음

### 3. 개발 서버 실행 테스트
```bash
npm run dev
```
- HMR(Hot Module Replacement) 정상 동작
- 새로운 기능 브라우저에서 테스트
- 콘솔 에러 없음

## 코드 품질 확인

### 데이터베이스 관련
- 새로운 스키마 추가시 마이그레이션 생성: `npm run db:generate`
- RLS 정책 올바르게 설정되었는지 확인
- 외래키 관계 및 CASCADE 설정 검토

### React Router v7 특화 체크
- 새 라우트는 `app/routes.ts`에 정의되어 있음
- 페이지 컴포넌트에서 `Route.ComponentProps` 타입 사용
- loader/action 함수에서 plain object 반환 (json() 래퍼 없음)

### UI/UX 체크
- Shadcn UI 컴포넌트 일관성 유지
- 반응형 디자인 동작 확인
- 접근성(a11y) 기본 요구사항 충족

## Git 커밋 전 최종 확인
1. 코드 변경사항 리뷰
2. 불필요한 파일 제거 (.env 파일 등 민감정보 제외)
3. 커밋 메시지 명확하게 작성
4. 기능 단위별로 커밋 분리