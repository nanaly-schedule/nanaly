# 문서 통합 규칙 // 삭제 금지

- 레이어 계층에 대한 내용은 예지님 문서가 좀 더 자세하게 되어 있어 해당 내용을 채용
- AI 작업 규칙에 대해서는 서로 통합해서 사용
- 예지님 문서는 좀 더 예지님의 작업에 대해 구체적으로 작성되어 있는 느낌
- 예지님 문서의 문서 목적 부분을 채용
- 문서 통합할 때 충돌하는 부분은 기록하고, 어떤 내용을 채택했는지도 기록으로 남길 것.
- 지현 문서는 추상적인 부분 위주로 가져오기

---

# 통합 기록

## 채택 기준

- 문서 목적은 `codex_예지.md`의 서술 방식을 채택했다.
- 레이어 계층과 파일 배치 설명은 `codex_예지.md`를 기본으로 채택했다.
- 추상 원칙, 권한 처리 원칙, DTO 배치 원칙, AI 협업 규칙은 `codex_지현.md`의 내용을 통합했다.
- 충돌 시에는 "현재 checkout에서 실제로 확인되는 구조"에 더 가까운 설명을 우선 채택했다.

## 충돌 및 결정

- `entities` 역할:
  - 예지 문서: 서버/도메인 데이터 타입을 `entities`에 두는 설명이 상대적으로 넓다.
  - 지현 문서: feature 전용 서버 응답 DTO는 `features/.../model`에 두는 방향이 더 강하다.
  - 채택: 기본 도메인 타입과 여러 곳에서 공유되는 enum/interface만 `entities`에 두고, feature 전용 응답 DTO는 `features/.../model`에 둔다.
- 권한 처리:
  - 예지 문서: `useCurrentStoreAccess`와 access helper 사용을 강조한다.
  - 지현 문서: 이미 진입 가능한 흐름이라면 도착 페이지에서 중복 view gate를 두지 않는 원칙을 강조한다.
  - 채택: 둘 다 채택한다. 권한 계산은 helper로 모으고, 화면 차단보다 실제 행위 제한을 우선한다.
- AI 작업 규칙:
  - 예지 문서: 변경 범위를 좁히고 Git 충돌을 줄이는 실행 규칙이 구체적이다.
  - 지현 문서: 추측 금지, 생성 파일 직접 수정 금지, choke point 우선 확인 같은 원칙이 명확하다.
  - 채택: 두 문서를 통합해 작업 전/중/후 규칙으로 정리한다.

# Codex Collaboration Guide

이 문서는 여러 사람이 동시에 작업할 때 Git 충돌과 Codex의 덮어쓰기 위험을 줄이기 위한 프로젝트 컨벤션 정리입니다. 아래 내용은 현재 코드 구조를 기준으로 작성했습니다.

## 기본 원칙

- 추상적인 베스트 프랙티스보다 현재 checkout에 이미 존재하는 구조와 패턴을 우선한다.
- 작은 수정은 작은 범위에서 끝낸다. 관련 없는 구조 개선을 끼워 넣지 않는다.
- 기존 파일이 이미 보여주는 패턴을 먼저 따른다.
- 새 라이브러리 도입보다 기존 `expo`, `axios`, `zustand`, `shared/ui` 조합을 우선 사용한다.
- 임시 데이터, fallback, 화면 편의 로직은 재사용 컴포넌트보다 page/container 쪽에 둔다.
- 서버 응답 DTO는 재사용 가능한 순수 도메인 엔티티가 아닌 한 `src/features/.../model`에 둔다.

## 프로젝트 구조

이 앱은 Expo Router 기반 React Native 프로젝트입니다.

- `app/`: 파일 기반 라우팅 계층이다. 라우트 파일은 가능한 얇게 유지하고 실제 화면 구현은 `src/pages`에 둔다.
- `src/pages/`: 페이지 단위 화면이다. 라우트 파라미터 처리, 화면 상태, API 호출 흐름, 권한에 따른 화면 제어를 담당한다.
- `src/widgets/`: 여러 페이지에서 재사용하거나 도메인 화면을 구성하는 UI 블록이다. BottomSheet, 카드, 필터바, 캘린더 같은 화면 조각을 둔다.
- `src/features/`: 비즈니스 기능 단위 코드다. API 함수, 상태 훅, 권한 계산, 인증/푸시 같은 기능 로직을 둔다.
- `src/entities/`: 여러 곳에서 공유되는 기본 도메인 타입과 enum/interface를 둔다.
- `src/shared/`: 앱 전체 공통 코드다. `apiClient`, 공통 UI, 날짜 유틸, 공통 타입, asset을 둔다.
- `src/init/`: 디자인 토큰과 초기 설정성 리소스를 둔다.

현재 패턴상 `app/**` 파일은 대부분 `src/pages/**`의 페이지 컴포넌트를 import해서 반환한다.

```tsx
import SchedulePage from '@/src/pages/store/schedule/SchedulePage';

export default function Schedule() {
  return <SchedulePage />;
}
```

새 화면을 만들 때도 이 구조를 우선 따른다.

## 레이어 역할

### app

`app`은 라우팅과 네비게이션 구조만 담당한다.

- 파일명과 폴더명으로 URL/화면 경로를 정의한다.
- `Stack`, `Tabs`, `Slot` 같은 Expo Router 설정은 layout 파일에서 처리한다.
- 화면 로직은 `app`에 길게 작성하지 않고 `src/pages`로 분리한다.

예외적으로 전역 초기화, Sentry, SplashScreen, 푸시 알림 핸들링처럼 앱 전체 생명주기와 연결된 코드는 `app/_layout.tsx`에 있다.

### pages

`pages`는 화면 orchestration 계층이다.

- `useLocalSearchParams`, `router` 등 라우팅 상태를 읽는다.
- zustand store와 권한 hook을 조합한다.
- API 호출 결과를 화면에서 쓰기 좋은 형태로 변환한다.
- 여러 widget을 조립해 하나의 화면을 만든다.

가능하면 페이지는 "화면 흐름 조합"에 집중하고, 반복되는 변환 로직은 feature/helper/widget 쪽으로 분리한다.

### widgets

`widgets`는 화면 조각이다.

- props로 필요한 값과 callback을 받는다.
- 직접 라우터를 조작하거나 전역 store를 읽는 일은 최소화한다.
- UI 상태가 해당 widget 안에서만 닫히는 경우에는 내부 state를 가질 수 있다.
- presentation 컴포넌트에는 페이지 수준 fallback이나 불필요한 fetch 로직을 넣지 않는다.

### features

`features`는 기능별 비즈니스 로직 계층이다.

- `features/{domain}/api`: 서버 API 함수
- `features/{domain}/model`: 요청/응답 또는 기능 전용 타입
- `features/{domain}/lib`: hook, storage, 권한 계산, navigation helper 같은 로직
- `features/{domain}/ui`: 특정 기능에 종속된 재사용 UI

API 함수는 `apiClient`를 사용한다. 새 axios instance를 만들지 않는다.

```ts
import { apiClient } from '@/src/shared/api/api';
```

### entities

`entities`는 도메인 타입의 기준점이다.

- 여러 feature/page/widget에서 공유되는 enum, interface를 둔다.
- 서버와 맞닿더라도 feature 전용 응답 타입이면 먼저 `features/.../model`에 둔다.
- 여러 곳에서 공통적으로 참조되기 시작하면 `entities`로 올리는 것을 검토한다.

### shared

`shared`는 도메인에 독립적인 공통 계층이다.

- `shared/api/api.ts`: 공통 axios client, 인증 토큰 주입, 401 refresh, Sentry error capture
- `shared/ui`: `PageLayout`, `Header`, `NText`, `BottomSheet`, `BaseModal` 등 공통 UI
- `shared/lib`: 날짜 등 순수 유틸
- `shared/assets`: 이미지와 아이콘

도메인 지식이 필요한 코드는 `shared`에 두지 않는다.

## 현재 레포의 아키텍처 규칙

### 앱 부트스트랩

- 전역 인증 부트스트랩은 `app/_layout.tsx`가 담당한다.
- 루트 레이아웃은 다음 책임을 가진다.
  - Sentry 초기화
  - SplashScreen 제어
  - `getUserProfile()` 기반 인증 게이트
  - 로그인 성공 이후 푸시 등록 준비
  - 앱 시작/탭 시점의 알림 응답 라우팅
- 인증 문제, 로그인 루프, 보호 화면 강제 이동 문제는 페이지보다 먼저 `app/_layout.tsx`와 `src/shared/api/api.ts`를 본다.

### 스토어 컨텍스트 부트스트랩

- 매장 단위 권한/역할 동기화는 `app/[storeId]/_layout.tsx`가 담당한다.
- `getMyStore()` 결과를 바탕으로 현재 매장 접근 정보를 `useUser` store에 적재한다.
- 매장 권한 로딩 여부는 `currentStoreAccessLoaded`로 추적한다.
- 스토어 하위 화면의 권한/빈 화면 문제는 개별 페이지보다 이 레이아웃의 hydration 흐름을 먼저 확인한다.

### 상태 관리와 권한

- 사용자 전역 상태는 `src/features/user/lib/useUser.ts`의 zustand store를 사용한다.
- 현재 매장 권한은 `useCurrentStoreAccess`를 통해 읽는다.
- 권한 계산 자체는 `src/features/permission/lib/access.ts`에 모은다.
- 권한 조건을 페이지마다 새로 하드코딩하지 말고 access helper에 추가하는 방향을 우선 검토한다.
- 이미 진입 가능한 버튼이나 화면 흐름이 권한을 증명했다면, 도착 페이지를 다시 숨기지 않는다.
- 대신 수정/삭제처럼 실제 행위 권한만 좁게 제한한다.

### API 계층

- 모든 API 요청은 `src/shared/api/api.ts`의 `apiClient`를 사용한다.
- 인증 헤더, access token refresh, 인증 실패 시 `/auth` 이동은 `apiClient` interceptor에서 처리한다.
- feature API 함수는 endpoint와 request params/body 조립까지만 담당한다.
- 화면에서 필요한 데이터 형태 변환은 mapper/helper로 분리한다.
- 로그인 요청은 전역 `401` 재발급/로그아웃 흐름에서 예외 처리한다.

### 푸시/알림

- 푸시 등록의 단일 진입점은 `preparePushNotificationsAsync()`다.
- 이 함수가 권한 요청, 토큰 획득, 서버 등록, device id 저장까지 담당한다.
- 알림 라우팅의 공통 경로는 `src/features/user/lib/notificationNavigation.ts`다.
- 알림 목록/설정은 현재 `user` 축 기능이다.
- 알림 설정 DTO와 알림 목록 응답 타입은 `src/features/user/model/notification.ts`에 둔다.
- 공지사항 도메인 타입과 개인 알림 응답 타입은 분리한다.

## Import 규칙

- 절대 경로 alias는 `@/*`를 사용한다.
- 다른 계층/먼 경로 import는 `@/src/...`를 우선 사용한다.
- 같은 폴더 내부 파일은 상대 경로 import를 사용해도 된다.
- import 정렬은 `eslint-plugin-simple-import-sort` 규칙을 따른다.
- 중복 import, import 이전 코드 작성은 lint 에러다.

## 스타일 컨벤션

- 텍스트는 기본적으로 `src/shared/ui/NText.tsx`를 우선 사용한다.
- 색상, 간격, radius 등 디자인 값은 `src/init/styles/tokens.ts`에서 import한다.
- `tokens.ts`는 자동 생성 파일이므로 직접 수정하지 않는다.
- 토큰 원본은 `src/init/styles/tokens.json`이고, 변경 후 `npm run build:tokens`로 생성한다.
- 컴포넌트 스타일은 파일 하단 `StyleSheet.create` 패턴을 우선 유지한다.
- 공통 레이아웃은 `PageLayout`, 공통 모달은 `BaseModal`, 하단 시트는 `BottomSheet`를 우선 사용한다.

## TypeScript / 타입 배치 규칙

- `tsconfig.json`은 `strict: true`다. 타입 우회를 기본 해결책으로 쓰지 않는다.
- 서버 응답 shape가 있으면 함수 반환 타입까지 연결한다.
- loose object보다 명시적 interface/type을 선호한다.
- 타입은 가까운 계층에 먼저 두고, 공유 범위가 넓어지면 `entities`로 이동한다.
- 단, "서버 응답이지만 특정 feature에서만 쓰이는 타입"은 `entities`보다 `features/.../model`이 우선이다.

## 파일 작성 규칙

- 컴포넌트 파일명은 PascalCase를 사용한다. 예: `ScheduleDateBottomSheet.tsx`
- API 파일명은 domain 단수 또는 기능명을 사용한다. 예: `schedule.ts`, `member.ts`
- hook은 `use` prefix를 사용한다.
- route 파일은 얇게 유지하고 실제 화면은 `src/pages`에 둔다.
- 자동 생성 파일에는 직접 수정하지 않는다.
- 주석은 "무슨 코드인지"보다 "왜 이렇게 되어 있는지"가 필요할 때만 쓴다.
- 죽은 주석, TODO, 임시 메모는 남기지 않는다.

## Codex 작업 규칙

좋은 요청 예시:

- `src/widgets/schedule/ScheduleDateBottomSheet.tsx에서 근무불가 삭제 버튼만 수정해줘`
- `features/schedule/api/schedule.ts에 월별 근무불가 삭제 API만 추가해줘`
- `SchedulePage의 API 응답 매핑 함수를 별도 mapper 파일로 분리해줘`

피해야 할 요청 예시:

- `스케줄 전체 리팩토링해줘`
- `충돌 안 나게 알아서 정리해줘`
- `전체 구조 깔끔하게 바꿔줘`

Codex는 작업 전 다음을 확인해야 한다.

- `git status --short`로 기존 변경 파일 확인
- 요청 범위와 관련된 파일만 읽고 수정
- 사용자가 수정 중인 파일이 있으면 되돌리지 않기
- 자동 생성 파일, lockfile, 설정 파일은 요청에 필요할 때만 수정
- 큰 파일을 통째로 재작성하지 않고 필요한 부분만 patch
- 인증/권한/부트스트랩 문제처럼 보이면 루트 레이아웃과 공통 API를 먼저 확인

Codex는 작업 중 다음을 지켜야 한다.

- 기존 import 정렬, alias 경로, 파일 배치 규칙을 유지
- 불필요한 추상화, 사용되지 않는 helper, dead code를 만들지 않기
- 새 의존성 추가는 마지막 수단으로 두기
- 이미 증명된 진입 권한 위에 중복 view gate를 또 얹지 않기

Codex는 작업 후 다음을 확인해야 한다.

- 가능한 범위에서 최소 검증 수행
- UI/라우팅 수정이면 관련 route 연결 확인
- 설정/생성 파일 수정이면 직접 편집 대상이 맞는지 재확인
- 변경 이유는 "무엇을 바꿨는지"보다 "왜 이 위치에서 이 방식으로 바꿨는지"가 드러나게 설명

## 충돌을 줄이는 작업 단위

- 라우트 추가와 화면 구현을 한 커밋에 섞을 수는 있지만, unrelated feature와는 분리한다.
- API 함수 추가, 타입 추가, UI 연결은 가능하면 순서대로 작은 단위로 작업한다.
- 공통 컴포넌트 수정은 영향 범위가 넓으므로 별도 작업으로 분리한다.
- `src/init/styles/tokens.ts`처럼 생성 결과가 큰 파일은 디자인 토큰 변경 작업에서만 수정한다.
- 여러 사람이 같은 page 파일을 만질 가능성이 높으면 widget/helper로 먼저 분리한 뒤 각자 다른 파일을 작업한다.

## 현재 레포에서 특히 중요한 규칙

- 로그인/리다이렉트 문제를 페이지 문제로 단정하지 말고 `app/_layout.tsx`와 `src/shared/api/api.ts`부터 확인한다.
- 스토어 하위 화면 권한/빈 화면 문제는 `app/[storeId]/_layout.tsx`의 access hydration을 먼저 확인한다.
- 알림/알림 설정/알림 라우팅은 `user` 축으로 유지한다.
- 서버 응답 타입이라는 이유로 곧바로 `entities`에 두지 않는다.
- Expo Router, Expo Push, Zustand, shared Axios 구조는 이미 자리 잡은 기반이므로 먼저 재사용한다.

## 작업 전 체크리스트

- 내가 수정할 파일이 요청 범위에 직접 관련되는가?
- 이 변경이 `app` 엔트리인지 `src/pages` 실제 화면인지 구분했는가?
- 같은 기능을 처리하는 기존 helper나 공통 UI가 있는가?
- API 호출은 `apiClient`를 쓰고 있는가?
- 색상/간격/텍스트 스타일은 토큰과 공통 UI를 우선 사용했는가?
- 권한 분기는 `useCurrentStoreAccess` 또는 access helper를 통했는가?
- 라우트 파일에 화면 로직을 넣지 않았는가?
- 자동 생성 파일이나 lockfile이 불필요하게 바뀌지 않았는가?
- `npm run lint` 또는 관련 검증을 실행했는가?
