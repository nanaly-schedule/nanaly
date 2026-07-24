# Codex Collaboration Guide

이 문서는 여러 사람이 동시에 작업할 때 Git 충돌과 Codex의 덮어쓰기 위험을 줄이기 위한 프로젝트 컨벤션 정리입니다. 아래 내용은 현재 코드 구조를 기준으로 작성했습니다.

## 프로젝트 구조

이 앱은 Expo Router 기반 React Native 프로젝트입니다.

- `app/`: 파일 기반 라우팅 계층입니다. 라우트 파일은 가능한 얇게 유지하고, 실제 화면 구현은 `src/pages`에 둡니다.
- `src/pages/`: 페이지 단위 화면입니다. 라우트 파라미터 처리, 화면 상태, API 호출 흐름, 권한에 따른 화면 제어를 담당합니다.
- `src/widgets/`: 여러 페이지에서 재사용하거나 도메인 화면을 구성하는 UI 블록입니다. BottomSheet, 카드, 필터바, 캘린더 같은 화면 조각을 둡니다.
- `src/features/`: 비즈니스 기능 단위 코드입니다. API 함수, 상태 훅, 권한 계산, 인증/푸시 같은 기능 로직을 둡니다.
- `src/entities/`: 서버/도메인 데이터 타입입니다. API 요청/응답 또는 도메인 모델 타입을 정의합니다.
- `src/shared/`: 앱 전체 공통 코드입니다. `apiClient`, 공통 UI, 날짜 유틸, 공통 타입, asset을 둡니다.
- `src/init/`: 디자인 토큰과 초기 설정성 리소스를 둡니다.

현재 패턴상 `app/**` 파일은 대부분 `src/pages/**`의 페이지 컴포넌트를 import해서 반환합니다.

```tsx
import SchedulePage from '@/src/pages/store/schedule/SchedulePage';

export default function Schedule() {
  return <SchedulePage />;
}
```

새 화면을 만들 때도 이 구조를 우선 따릅니다.

## 레이어 역할

### app

`app`은 라우팅과 네비게이션 구조만 담당합니다.

- 파일명과 폴더명으로 URL/화면 경로를 정의합니다.
- `Stack`, `Tabs`, `Slot` 같은 Expo Router 설정은 layout 파일에서 처리합니다.
- 화면 로직은 `app`에 길게 작성하지 않고 `src/pages`로 분리합니다.

예외적으로 전역 초기화, Sentry, SplashScreen, 푸시 알림 핸들링처럼 앱 전체 생명주기와 연결된 코드는 `app/_layout.tsx`에 있습니다.

### pages

`pages`는 화면 orchestration 계층입니다.

- `useLocalSearchParams`, `router`, `useIsFocused` 등 라우팅 상태를 읽습니다.
- zustand store와 권한 hook을 조합합니다.
- API 호출 결과를 화면에서 쓰기 좋은 형태로 변환합니다.
- 여러 widget을 조립해 하나의 화면을 만듭니다.

`SchedulePage.tsx`처럼 API 응답 형태가 불안정한 구간은 페이지 안에 normalize/helper 함수가 있을 수 있습니다. 다만 새 기능에서는 가능하면 API 응답 타입과 mapper를 `features` 또는 `entities` 쪽으로 분리해 페이지가 과도하게 커지지 않게 합니다.

### widgets

`widgets`는 화면 조각입니다.

- props로 필요한 값과 callback을 받습니다.
- 직접 라우터를 조작하거나 전역 store를 읽는 일은 최소화합니다.
- UI 상태가 해당 widget 안에서만 닫히는 경우에는 내부 state를 가질 수 있습니다.
- 서버 호출이 폼 저장/삭제처럼 widget의 명확한 책임일 때는 허용하되, 페이지 전체 refresh나 navigation은 callback으로 위임합니다.

예: `ScheduleDateBottomSheet`는 `schedules`, `visible`, `onClose`, `onPressSchedule` 등을 받아 목록 표시와 클릭 이벤트 전달에 집중합니다.

### features

`features`는 기능별 비즈니스 로직 계층입니다.

- `features/{domain}/api`: 서버 API 함수
- `features/{domain}/model`: 요청/응답 또는 화면에 가까운 기능 타입
- `features/{domain}/lib`: hook, storage, 권한 계산, navigation helper 같은 로직
- `features/{domain}/ui`: 특정 기능에 종속된 재사용 UI

API 함수는 `apiClient`를 사용합니다. 새 axios instance를 만들지 않습니다.

```ts
import { apiClient } from '@/src/shared/api/api';
```

### entities

`entities`는 도메인 타입의 기준점입니다.

- 서버와 맞닿는 기본 모델 타입을 둡니다.
- 여러 feature/page/widget에서 공유되는 enum, interface를 둡니다.
- 화면 전용 임시 타입은 먼저 `widgets`나 `features/model`에 둘 수 있지만, 여러 곳에서 공유되기 시작하면 `entities`로 올립니다.

### shared

`shared`는 도메인에 독립적인 공통 계층입니다.

- `shared/api/api.ts`: 공통 axios client, 인증 토큰 주입, 401 refresh, Sentry error capture
- `shared/ui`: `PageLayout`, `Header`, `NText`, `BottomSheet`, `BaseModal` 등 공통 UI
- `shared/lib`: 날짜 등 순수 유틸
- `shared/assets`: 이미지와 아이콘

도메인 지식이 필요한 코드는 `shared`에 두지 않습니다.

## Import 규칙

- 절대 경로 alias는 `@/*`를 사용합니다.
- 다른 계층/먼 경로 import는 `@/src/...`를 우선 사용합니다.
- 같은 폴더 내부 파일은 상대 경로 import를 사용해도 됩니다.
- import 정렬은 `eslint-plugin-simple-import-sort` 규칙을 따릅니다.
- 중복 import, import 이전 코드 작성은 lint 에러입니다.

## 스타일 컨벤션

- 텍스트는 기본적으로 `src/shared/ui/NText.tsx`를 사용합니다.
- 색상, 간격, radius 등 디자인 값은 `src/init/styles/tokens.ts`에서 import합니다.
- `tokens.ts`는 자동 생성 파일이므로 직접 수정하지 않습니다.
- 토큰 원본은 `src/init/styles/tokens.json`이고, 변경 후 `npm run build:tokens`로 생성합니다.
- 컴포넌트 스타일은 파일 하단 `StyleSheet.create`로 정의하는 패턴을 유지합니다.
- 공통 레이아웃은 `PageLayout`, 공통 모달은 `BaseModal`, 하단 시트는 `BottomSheet`를 우선 사용합니다.

## API 컨벤션

- 모든 API 요청은 `src/shared/api/api.ts`의 `apiClient`를 사용합니다.
- 인증 헤더, access token refresh, 인증 실패 시 `/auth` 이동은 `apiClient` interceptor에서 처리합니다.
- 5xx 또는 네트워크성 오류는 Sentry로 capture됩니다.
- feature API 함수는 endpoint와 request params/body 조립까지만 담당합니다.
- 화면에서 필요한 데이터 형태 변환은 mapper 함수로 분리합니다.

예시:

```ts
export async function getMonthlySchedules(params: {
  storeId: string;
  year: number;
  month: number;
  positionId?: string | null;
  scope?: ScheduleScope;
}) {
  const { storeId, year, month, positionId, scope } = params;

  return apiClient.get(`/stores/${storeId}/schedules/monthly`, {
    params: {
      year,
      month,
      ...(positionId ? { positionId } : {}),
      ...(scope ? { scope } : {}),
    },
  });
}
```

## 상태 관리와 권한

- 사용자 전역 상태는 `src/features/user/lib/useUser.ts`의 zustand store를 사용합니다.
- 현재 매장 권한은 `useCurrentStoreAccess`를 통해 읽습니다.
- 권한 계산 자체는 `src/features/permission/lib/access.ts`에 모읍니다.
- 화면에서는 `access.loaded`를 확인한 뒤 권한 기반 API 호출이나 UI 제어를 수행합니다.
- 권한 조건을 페이지마다 새로 하드코딩하지 말고 access helper에 추가하는 방향을 우선 검토합니다.

## 라우팅 컨벤션

- 라우트 파라미터는 `useLocalSearchParams`로 읽습니다.
- `string | string[]` 형태의 파라미터는 normalize helper로 정리합니다.
- `"undefined"`, `"null"` 문자열이 들어올 수 있는 경우를 방어합니다.
- 라우트 파일은 페이지 연결만 담당하고, 복잡한 상태나 API 호출은 `src/pages`로 이동합니다.

## 파일 작성 규칙

- 컴포넌트 파일명은 PascalCase를 사용합니다. 예: `ScheduleDateBottomSheet.tsx`
- API 파일명은 domain 단수 또는 기능명을 사용합니다. 예: `schedule.ts`, `member.ts`
- hook은 `use` prefix를 사용합니다.
- 타입은 가까운 계층에 먼저 두고, 공유 범위가 넓어지면 `entities`로 이동합니다.
- 자동 생성 파일에는 직접 수정하지 않습니다.

## Codex 작업 규칙

Codex에게 요청할 때는 변경 범위를 좁게 지정합니다.

좋은 요청:

- `src/widgets/schedule/ScheduleDateBottomSheet.tsx에서 근무불가 삭제 버튼만 수정해줘`
- `features/schedule/api/schedule.ts에 월별 근무불가 삭제 API만 추가해줘`
- `SchedulePage의 API 응답 매핑 함수를 별도 mapper 파일로 분리해줘`

피해야 할 요청:

- `스케줄 전체 리팩토링해줘`
- `충돌 안 나게 알아서 정리해줘`
- `전체 구조 깔끔하게 바꿔줘`

Codex는 작업 전 다음을 확인해야 합니다.

- `git status --short`로 기존 변경 파일 확인
- 요청 범위와 관련된 파일만 읽고 수정
- 사용자가 수정 중인 파일이 있으면 되돌리지 않기
- 자동 생성 파일, lockfile, 설정 파일은 요청에 필요할 때만 수정
- 큰 파일을 통째로 재작성하지 않고 필요한 부분만 patch

## 충돌을 줄이는 작업 단위

- 라우트 추가와 화면 구현을 한 커밋에 섞을 수는 있지만, unrelated feature와는 분리합니다.
- API 함수 추가, 타입 추가, UI 연결은 가능하면 순서대로 작은 단위로 작업합니다.
- 공통 컴포넌트 수정은 영향 범위가 넓으므로 별도 작업으로 분리합니다.
- `src/init/styles/tokens.ts`처럼 생성 결과가 큰 파일은 디자인 토큰 변경 작업에서만 수정합니다.
- 여러 사람이 같은 page 파일을 만질 가능성이 높으면 widget/helper로 먼저 분리한 뒤 각자 다른 파일을 작업합니다.

## 스케줄 도메인 현재 패턴

스케줄 화면은 다음 파일들이 주요 경계입니다.

- `app/[storeId]/schedule/index.tsx`: 라우트 엔트리
- `src/pages/store/schedule/SchedulePage.tsx`: 월/일 조회, 필터, 권한, 선택 상태, BottomSheet 조립
- `src/features/schedule/api/schedule.ts`: 근무/근무불가 API
- `src/features/schedule/api/position.ts`: 포지션 API
- `src/widgets/schedule/*`: 캘린더, 필터바, 폼, 날짜 상세 BottomSheet
- `src/entities/schedule/*`: 스케줄 관련 도메인 타입

현재 `SchedulePage.tsx`는 API 응답 normalize, 권한별 viewType 제어, 월별/일별 조회, 알림에서 진입한 스케줄 열기까지 담당합니다. 추가 변경 시 한 파일에 계속 로직을 늘리기보다 아래 순서로 분리하는 것이 좋습니다.

1. 서버 응답 타입 확정: `entities/schedule` 또는 `features/schedule/model`
2. 응답 변환 함수 분리: `features/schedule/lib` 또는 `widgets/schedule/*Mapper`
3. API 함수 추가: `features/schedule/api`
4. 화면 연결: `pages/store/schedule`
5. UI 조각 변경: `widgets/schedule`

## 작업 전 체크리스트

- 내가 수정할 파일이 요청 범위에 직접 관련되는가?
- 같은 기능을 처리하는 기존 helper나 공통 UI가 있는가?
- API 호출은 `apiClient`를 쓰고 있는가?
- 색상/간격/텍스트 스타일은 토큰과 `NText`를 우선 사용했는가?
- 권한 분기는 `useCurrentStoreAccess` 또는 access helper를 통했는가?
- 라우트 파일에 화면 로직을 넣지 않았는가?
- 자동 생성 파일이나 lockfile이 불필요하게 바뀌지 않았는가?
- `npm run lint` 또는 관련 검증을 실행했는가?
