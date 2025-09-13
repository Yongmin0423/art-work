# 개발 명령어 가이드

## 필수 개발 명령어

### 개발 서버
```bash
npm run dev          # 개발 서버 시작 (http://localhost:5173)
npm run build        # 프로덕션 빌드 생성
npm run start        # 프로덕션 서버 시작
```

### TypeScript 및 타입 체크
```bash  
npm run typecheck    # TypeScript 타입 체크 + 라우트 타입 생성
```

### 데이터베이스 관리
```bash
npm run db:generate  # Drizzle Kit으로 마이그레이션 생성
npm run db:migrate   # 데이터베이스 마이그레이션 적용
npm run db:typegen   # Supabase에서 TypeScript 타입 생성
```

## Windows 시스템 유틸리티 명령어
- `dir` - 파일 및 디렉토리 목록 표시 (unix의 ls 대응)
- `cd` - 디렉토리 변경  
- `findstr` - 파일 내용 검색 (unix의 grep 대응)
- `where` - 파일 찾기 (unix의 which 대응)

## 작업 완료 후 실행할 명령어 체크리스트
1. `npm run typecheck` - 타입 오류 확인
2. `npm run build` - 빌드 성공 확인
3. Git 커밋 전 코드 리뷰