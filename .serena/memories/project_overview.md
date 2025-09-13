# 아트워크 커미션 플랫폼 - 프로젝트 개요

## 프로젝트 목적
아티스트와 고객을 연결하는 커미션 마켓플레이스 플랫폼으로, 아트 작업 의뢰부터 거래 완료까지의 전체 프로세스를 관리하는 웹 애플리케이션입니다.

## 주요 기능
- **아티스트 커미션 등록 및 관리**: 아티스트가 자신의 작업 스타일과 가격을 등록
- **커미션 주문 시스템**: 고객이 원하는 아티스트에게 작업 의뢰 
- **커뮤니티 기능**: 아티스트와 고객 간의 소통 공간
- **리뷰 시스템**: 작업 완료 후 상호 평가
- **관리자 패널**: 전체 플랫폼 관리 및 모니터링
- **실시간 메시징**: 아티스트와 고객 간의 실시간 소통
- **포트폴리오 관리**: 아티스트의 작품 전시

## 기술 스택
- **Frontend/SSR**: React Router v7 with Server-Side Rendering
- **Database**: PostgreSQL (Supabase) with Drizzle ORM
- **Authentication**: Supabase Auth
- **UI Framework**: Shadcn UI + Radix UI + TailwindCSS v4
- **Email Service**: Resend
- **State Management**: React Router v7 native data loading
- **Deployment**: Vercel

## 아키텍처 특징
- Feature-based 코드 구조로 확장성 확보
- SSR을 통한 SEO 최적화 및 초기 로딩 성능 향상  
- Row Level Security(RLS)를 통한 데이터 보안
- TypeScript 전체 적용으로 타입 안정성 확보