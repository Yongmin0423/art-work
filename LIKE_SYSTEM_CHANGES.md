# 좋아요 시스템 개별 사용자별 관리 변경사항

## 문제점
기존에는 클라이언트 state로만 좋아요를 관리해서 모든 사용자가 동일한 좋아요 상태를 보는 문제가 있었습니다. 또한 좋아요 카운트가 데이터베이스에 제대로 반영되지 않는 트리거 및 RLS 정책 문제도 있었습니다.

## 발견된 주요 문제들

### 1. 클라이언트 State 공유 문제
- 모든 사용자가 동일한 좋아요 상태를 봄
- 개별 사용자의 좋아요 기록이 반영되지 않음

### 2. 데이터베이스 트리거 오류
- 트리거가 `commission_like` (단수형) 테이블을 참조
- 실제 테이블은 `commission_likes` (복수형)
- 트리거가 작동하지 않아 `likes_count` 업데이트 실패

### 3. RLS 정책 충돌
- commission 테이블 업데이트 정책이 작성자만 허용
- 트리거가 다른 사용자의 좋아요로 인한 카운트 업데이트를 수행할 수 없음
- 커미션 작성자만 카운트 변경, 다른 사용자는 하트만 변경되는 현상

## 해결 방법
데이터베이스에서 각 사용자별 좋아요 상태를 가져와서 개별적으로 관리하도록 수정했습니다.

---

## 1. 쿼리 함수 개선 (`app/features/commissions/queries.ts`)

### 1.1 `getCommissionsByCategory` 함수 수정

**변경 전:**
```typescript
export const getCommissionsByCategory = async (
  client: SupabaseClient<Database>,
  category: CategoryType | string
) => {
  // 커미션 데이터만 가져오고 좋아요 상태는 확인하지 않음
  const { data, error } = await client
    .from("commission_with_artist")
    .select(/* 기본 필드들 */)
    .eq("category", category as CategoryType)
    .eq("status", "available");

  return data?.map((commission) => ({
    ...commission,
    // 좋아요 상태 없음
  })) || [];
};
```

**변경 후:**
```typescript
export const getCommissionsByCategory = async (
  client: SupabaseClient<Database>,
  category: CategoryType | string,
  userId?: string  // 👈 사용자 ID 매개변수 추가
) => {
  const { data, error } = await client
    .from("commission_with_artist")
    .select(/* 기본 필드들 */)
    .eq("category", category as CategoryType)
    .eq("status", "available");

  const commissions = data?.map(/* 기존 매핑 */) || [];

  // 👈 사용자가 로그인한 경우 각 커미션에 대한 좋아요 상태 확인
  if (userId && commissions.length > 0) {
    const commissionIds = commissions.map(c => c.commission_id);
    const { data: likedCommissions, error: likeError } = await client
      .from("commission_likes")
      .select("commission_id")
      .eq("liker_id", userId)
      .in("commission_id", commissionIds);

    const likedCommissionIds = new Set(likedCommissions?.map(like => like.commission_id) || []);

    return commissions.map(commission => ({
      ...commission,
      isLiked: likedCommissionIds.has(commission.commission_id)  // 👈 개별 좋아요 상태 추가
    }));
  }

  return commissions.map(commission => ({
    ...commission,
    isLiked: false  // 👈 비로그인 시 false
  }));
};
```

### 1.2 `getTopCommissionsByCategory` 함수 수정

동일한 패턴으로 `userId` 매개변수를 추가하고 사용자별 좋아요 상태를 확인하는 로직을 추가했습니다.

### 1.3 `getFeaturedWeeklyCommissions` 함수 수정

동일한 패턴으로 수정했습니다.

**핵심 개선점:**
- **효율성**: 각 커미션마다 개별 쿼리를 날리는 대신, `IN` 연산자로 한 번의 쿼리로 모든 좋아요 상태를 가져옴
- **확장성**: 사용자가 로그인하지 않은 경우에도 동작
- **타입 안정성**: `isLiked` 속성을 명시적으로 포함

---

## 2. ArtistCard 컴포넌트 수정 (`app/features/commissions/components/artist-card.tsx`)

### 2.1 Props 인터페이스 수정

**변경 전:**
```typescript
interface ArtistCardProps {
  // ... 다른 props
  isLiked?: boolean;  // 👈 optional, 기본값 false
  isLoggedIn?: boolean;
}
```

**변경 후:**
```typescript
interface ArtistCardProps {
  // ... 다른 props
  isLiked: boolean;   // 👈 required, 데이터베이스에서 확실한 값 전달
  isLoggedIn?: boolean;
}
```

### 2.2 컴포넌트 내부 로직 수정

**변경 전:**
```typescript
export default function ArtistCard({
  // ... 다른 props
  isLiked = false,  // 👈 기본값으로 모든 사용자에게 동일한 상태
  isLoggedIn = false,
}: ArtistCardProps) {
  const [isLikedState, setIsLikedState] = useState(isLiked);
```

**변경 후:**
```typescript
export default function ArtistCard({
  // ... 다른 props
  isLiked,  // 👈 데이터베이스에서 가져온 실제 사용자별 상태
  isLoggedIn = false,
}: ArtistCardProps) {
  // 👈 데이터베이스 상태를 초기값으로 사용 (낙관적 업데이트를 위해 state는 유지)
  const [isLikedState, setIsLikedState] = useState(isLiked);
```

---

## 3. 페이지 컴포넌트들 수정

### 3.1 Category 페이지 (`app/features/commissions/pages/category.tsx`)

**변경 전:**
```typescript
export const loader = async ({ params, request }: Route.LoaderArgs) => {
  // 사용자 정보 가져오기
  let user = null;
  try {
    user = await getLoggedInUser(client);
  } catch (error) {
    console.log("User not logged in");
  }

  // 👈 기본 커미션 데이터만 가져옴
  const commissionsRaw = await getCommissionsByCategory(client, category);
  const commissions = commissionsRaw as unknown as CommissionWithLikeStatus[];

  // 👈 복잡한 후처리로 각 커미션마다 개별적으로 좋아요 상태 확인
  if (user) {
    const likesPromises = commissions.map(async (commission) => {
      const isLiked = await getUserLikeStatus(client, {
        commissionId: commission.commission_id,
        userId: user.profile_id,
      });
      return { commissionId: commission.commission_id, isLiked };
    });

    const likesResults = await Promise.all(likesPromises);
    const likesMap = new Map(/*...*/);
    // 각 커미션에 좋아요 상태 수동 할당
  }

  return { commissions, category, isLoggedIn: !!user };
};
```

**변경 후:**
```typescript
export const loader = async ({ params, request }: Route.LoaderArgs) => {
  // 사용자 정보 가져오기 (동일)
  let user = null;
  try {
    user = await getLoggedInUser(client);
  } catch (error) {
    console.log("User not logged in");
  }

  // 👈 개선된 쿼리 함수 사용 - 사용자별 좋아요 상태가 이미 포함됨
  const commissions = await getCommissionsByCategory(
    client, 
    category, 
    user?.profile_id  // 👈 사용자 ID 전달
  );

  return { commissions, category, isLoggedIn: !!user };
};
```

**렌더링 부분 수정:**
```typescript
// 변경 전
<ArtistCard
  // ... 다른 props
  isLiked={commission.is_liked}  // 👈 후처리로 추가된 속성
  isLoggedIn={loaderData.isLoggedIn}
/>

// 변경 후
<ArtistCard
  // ... 다른 props
  isLiked={commission.isLiked || false}  // 👈 쿼리에서 직접 가져온 속성
  isLoggedIn={loaderData.isLoggedIn}
/>
```

### 3.2 Commissions 페이지 (`app/features/commissions/pages/commissions.tsx`)

**변경 전:**
```typescript
const [
  characterCommissionsRaw,
  virtual3dCommissionsRaw,
  designCommissionsRaw,
  live2dCommissionsRaw,
] = await Promise.all([
  getTopCommissionsByCategory(client, "character", 3),  // 👈 사용자 ID 없음
  getTopCommissionsByCategory(client, "virtual-3d", 3),
  getTopCommissionsByCategory(client, "design", 3),
  getTopCommissionsByCategory(client, "live2d", 3),
]);

// 👈 복잡한 후처리 로직 (약 50줄의 코드)
const allCommissions = [...characterCommissions, ...virtual3dCommissions, /*...*/];
const likesPromises = allCommissions.map(async (commission) => {/*...*/});
// 각 배열에 대해 수동으로 좋아요 상태 할당
```

**변경 후:**
```typescript
const [
  characterCommissions,
  virtual3dCommissions,
  designCommissions,
  live2dCommissions,
] = await Promise.all([
  getTopCommissionsByCategory(client, "character", 3, user?.profile_id),  // 👈 사용자 ID 전달
  getTopCommissionsByCategory(client, "virtual-3d", 3, user?.profile_id),
  getTopCommissionsByCategory(client, "design", 3, user?.profile_id),
  getTopCommissionsByCategory(client, "live2d", 3, user?.profile_id),
]);

// 👈 후처리 로직 완전 제거 - 이미 좋아요 상태가 포함되어 있음
```

---

## 4. 동작 원리

### 4.1 데이터 흐름

1. **페이지 로더에서**:
   ```
   사용자 로그인 확인 → 사용자 ID와 함께 쿼리 호출
   ```

2. **쿼리 함수에서**:
   ```
   커미션 데이터 조회 → 사용자별 좋아요 상태 배치 조회 → 결합하여 반환
   ```

3. **컴포넌트에서**:
   ```
   데이터베이스 상태를 초기값으로 사용 → 낙관적 업데이트 적용
   ```

### 4.2 성능 최적화

**변경 전**: N+1 쿼리 문제
```sql
-- 커미션 10개가 있다면
SELECT * FROM commission_likes WHERE commission_id = 1 AND liker_id = 'user1';
SELECT * FROM commission_likes WHERE commission_id = 2 AND liker_id = 'user1';
-- ... 총 10번의 개별 쿼리
```

**변경 후**: 배치 쿼리
```sql
-- 한 번의 쿼리로 모든 좋아요 상태 확인
SELECT commission_id FROM commission_likes 
WHERE liker_id = 'user1' 
AND commission_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
```

### 4.3 사용자별 상태 관리

**로그인한 사용자 A**:
```typescript
{
  commission_id: 1,
  title: "캐릭터 일러스트",
  likes_count: 15,
  isLiked: true,  // 👈 A가 좋아요를 눌렀음
}
```

**로그인한 사용자 B**:
```typescript
{
  commission_id: 1,
  title: "캐릭터 일러스트", 
  likes_count: 15,
  isLiked: false, // 👈 B는 좋아요를 누르지 않았음
}
```

**비로그인 사용자**:
```typescript
{
  commission_id: 1,
  title: "캐릭터 일러스트",
  likes_count: 15,
  isLiked: false, // 👈 항상 false
}
```

---

## 5. 트러블슈팅 과정

### 5.1 초기 문제 진단
**증상**: 좋아요 취소 시 낙관적 업데이트는 동작하지만 새로고침하면 원상복구
**원인 파악**: 서버에서는 완벽하게 동작하지만 `likes_count`가 업데이트되지 않음

### 5.2 트리거 문제 발견
**디버깅 과정**:
```javascript
console.log("좋아요 토글 시작:", { commissionId, userId });
console.log("기존 좋아요 상태:", existingLike);
console.log("좋아요 삭제/추가 성공");
```

**문제점**: 서버 로그는 정상이지만 데이터베이스 카운트 변화 없음

**해결 과정**:
1. 트리거 존재 확인:
   ```sql
   SELECT * FROM information_schema.triggers 
   WHERE trigger_name = 'commission_likes_count_trigger';
   ```

2. 테이블 이름 불일치 발견:
   - 트리거: `commission_like` (단수형)
   - 실제 테이블: `commission_likes` (복수형)

3. 트리거 수정:
   ```sql
   DROP TRIGGER IF EXISTS commission_likes_count_trigger ON commission_like;
   CREATE TRIGGER commission_likes_count_trigger
       AFTER INSERT OR DELETE ON commission_likes
       FOR EACH ROW EXECUTE FUNCTION update_commission_likes_count();
   ```

### 5.3 RLS 정책 문제 발견
**증상**: 커미션 작성자는 카운트 증가, 다른 사용자는 하트만 변경
**원인**: commission 테이블 업데이트 정책이 작성자에게만 권한 부여

**해결**:
```typescript
// RLS 정책 추가
pgPolicy("commission-counter-update-policy", {
  for: "update",
  to: authenticatedRole,
  using: sql`true`,
  withCheck: sql`true`,
}),
```

### 5.4 Form 제출 문제 해결
**증상**: 좋아요 클릭 시 action이 호출되지 않음
**원인**: Form 제출이 차단됨

**해결**: `useSubmit` hook 사용으로 프로그래밍적 제출
```typescript
const submit = useSubmit();

// 기존 Form 방식 대신
submit({
  action: "like",
  commissionId: id.toString(),
}, { method: "post" });
```

---

## 6. 최종 해결 결과

1. **정확성**: 각 사용자가 자신만의 정확한 좋아요 상태를 볼 수 있음
2. **성능**: N+1 쿼리 문제 해결로 로딩 속도 개선
3. **확장성**: 새로운 페이지에서 동일한 패턴 재사용 가능
4. **유지보수**: 복잡한 후처리 로직 제거로 코드 단순화
5. **데이터 일관성**: 트리거를 통한 자동 카운트 관리
6. **권한 관리**: RLS 정책을 통한 적절한 권한 분리

## 7. 기존 기능 유지

- **낙관적 업데이트**: 여전히 클릭 시 즉시 UI 변경
- **디바운싱**: 연속 클릭 방지 기능 유지  
- **서버 동기화**: useSubmit을 통한 서버 상태 업데이트
- **데이터 재검증**: useRevalidator를 통한 자동 데이터 새로고침

## 8. 주요 파일 변경사항 요약

### 쿼리 함수 (`queries.ts`)
- 사용자별 좋아요 상태를 배치로 조회하는 로직 추가
- N+1 쿼리 문제 해결

### 컴포넌트 (`artist-card.tsx`) 
- Form 기반에서 useSubmit 기반으로 변경
- useRevalidator를 통한 데이터 재검증 추가
- Props 변경 감지 및 로컬 state 동기화

### 데이터베이스 설정
- 트리거 테이블 이름 수정 (`commission_like` → `commission_likes`)
- RLS 정책 추가로 카운트 업데이트 권한 부여
- 트리거 함수는 기존 것 유지

### 페이지 컴포넌트들
- 복잡한 후처리 로직 제거
- 개선된 쿼리 함수 직접 사용

## 9. 향후 개선 사항

1. **유틸리티 함수 분리**: 중복된 좋아요 처리 로직을 공통 함수로 추출
2. **React Hook 분리**: useRelativeTime 등의 커스텀 훅 생성
3. **실시간 업데이트**: WebSocket을 통한 실시간 좋아요 수 동기화
4. **에러 처리 개선**: 네트워크 오류 시 롤백 메커니즘 강화