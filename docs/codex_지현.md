# 목적

- 이 문서는 `nanaly` 레포에서 Codex와 협업할 때 따라야 하는 현재 기준의 코드 컨벤션과 아키텍처 규칙을 정리한다.
- 추상적인 베스트 프랙티스보다, 지금 체크아웃에 이미 존재하는 구조와 패턴을 우선한다.
- 변경 범위를 좁게 유지하고 불필요한 리팩토링을 막는 것을 목표로 한다.

# 기본 원칙

- 기존 파일이 이미 보여주는 패턴을 먼저 따른다.
- 작은 수정은 작은 범위에서 끝낸다. 관련 없는 구조 개선을 끼워 넣지 않는다.
- 페이지에서 이미 접근 가능한 흐름이라면 목적지 화면에서 같은 권한 검사를 반복하지 않는다.
- 서버 응답 DTO는 재사용 가능한 순수 도메인 엔티티가 아닌 한 `src/features/.../model`에 둔다.
- 임시 데이터, fallback, UI 편의 로직은 재사용 컴포넌트보다 페이지/컨테이너 쪽에 둔다.
- 새 라이브러리 도입보다 기존 `expo`, `axios`, `zustand`, `shared/ui` 조합을 우선 사용한다.

# 프로젝트 구조

## 라우팅

- `app/`는 Expo Router 엔트리 레이어다.
- 각 route 파일은 가능한 얇게 유지하고 실제 화면 렌더링은 `src/pages/...`로 위임한다.
- 예시:
  - `app/auth/index.tsx` -> `src/pages/auth/SignInPage`
  - `app/[storeId]/home/admin.tsx` -> `src/pages/store/home/AdminHomePage`
  - `app/store/[storeId]/notification/index.tsx` -> `src/pages/store/NotificationPage`

## 소스 레이어

- `src/shared`: 전역적으로 재사용되는 기반 코드
  - `api`: 공통 API 클라이언트, 인터셉터
  - `ui`: 공용 UI 컴포넌트
  - `lib`: 범용 유틸
  - `assets`, `types`
- `src/entities`: 여러 곳에서 참조 가능한 도메인 타입
  - 예: `member`, `store`, `schedule`, `notice`, `user`
- `src/features`: 기능 단위 API, 모델, 로직, 일부 기능 전용 UI
  - 예: `auth`, `store`, `schedule`, `user`, `push`, `permission`
- `src/widgets`: 페이지에서 조합하는 표현 컴포넌트
- `src/pages`: 실제 화면 단위 컨테이너
- `src/init`: 스타일 토큰 등 앱 초기화 리소스

## 현재 레포의 FSD 해석

- 이 레포는 엄격한 교과서형 FSD보다 실용적으로 운용한다.
- `Page -> Feature` import는 허용되는 현재 패턴이다.
- `Feature -> Shared`, `Widget -> Shared`, `Page -> Widget/Feature` 흐름은 자연스럽다.
- 반대로 공용성이 없는 서버 응답 타입을 `entities`로 올리는 것은 지양한다.
- 개인 알림/알림 설정은 별도 `alarm` 축보다 현재처럼 `src/features/user` 축에 두는 것이 맞다.

# 아키텍처 규칙

## 앱 부트스트랩

- 전역 인증 부트스트랩은 `app/_layout.tsx`가 담당한다.
- 루트 레이아웃은 다음 책임을 가진다.
  - Sentry 초기화
  - 스플래시 제어
  - `getUserProfile()` 기반 인증 게이트
  - 로그인 성공 이후 푸시 등록 준비
  - 앱 시작/탭 시점의 알림 응답 라우팅
- 인증 문제, 로그인 루프, 보호 화면 강제 이동 문제는 페이지보다 먼저 `app/_layout.tsx`와 `src/shared/api/api.ts`를 본다.

## 스토어 컨텍스트 부트스트랩

- 매장 단위 권한/역할 동기화는 `app/[storeId]/_layout.tsx`가 담당한다.
- 이 레이아웃은 `getMyStore()` 결과를 바탕으로 현재 매장 접근 정보를 `useUser` 스토어에 적재한다.
- 매장 권한 로딩 여부는 `currentStoreAccessLoaded`로 추적한다.
- 스토어 하위 화면의 권한 이슈는 개별 페이지보다 이 레이아웃의 hydration 흐름을 먼저 확인한다.

## 상태 관리

- 전역 사용자 상태는 `src/features/user/lib/useUser.ts`의 Zustand store를 사용한다.
- 현재 store에는 다음 성격의 값이 들어 있다.
  - 사용자 기본 정보
  - 현재 선택된 store access 정보
- 로그아웃/세션 정리의 실제 choke point는 `clearUser()`다.
- 토큰 삭제만 하지 말고, 로그아웃 흐름이 필요하면 `clearUser()`를 기준으로 붙인다.

## API 계층

- 공통 Axios 인스턴스와 인증/재발급 인터셉터는 `src/shared/api/api.ts`에 둔다.
- 개별 endpoint 함수는 각 feature의 `api/` 아래에 둔다.
- 예:
  - `src/features/user/api/notification.ts`
  - `src/features/store/api/dashboard.ts`
- 로그인 요청은 전역 `401` 재발급/로그아웃 흐름에서 예외 처리한다.
- API 에러 로깅이나 공통 인증 동작은 feature API가 아니라 `shared/api`에서 우선 해결한다.

## 권한 처리

- 권한 계산의 기준 함수는 `src/features/permission/lib/access.ts`다.
- 페이지/컴포넌트는 가급적 `useCurrentStoreAccess()` 또는 이 함수들이 만든 결과만 사용한다.
- 이미 진입 가능한 버튼이나 화면 흐름이 권한을 증명했다면, 도착 페이지를 다시 숨기지 않는다.
- 대신 수정/삭제처럼 실제 행위 권한만 좁게 제한한다.

## 푸시/알림

- 푸시 등록의 단일 진입점은 `preparePushNotificationsAsync()`다.
- 이 함수가 권한 요청, 토큰 획득, 서버 등록, device id 저장까지 담당한다.
- 알림 라우팅의 공통 경로는 `src/features/user/lib/notificationNavigation.ts`다.
- 알림 목록/설정은 현재 `user` 축 기능이다.
- 알림 설정 DTO와 알림 목록 응답 타입은 `src/features/user/model/notification.ts`에 둔다.
- 공지사항 도메인 타입과 개인 알림 응답 타입은 분리한다.

# 코드 스타일

## import / 경로

- import는 ESLint 설정대로 정렬한다.
- `@/` alias를 사용한다.
- 상대 경로보다 alias import를 우선한다.
- route wrapper 파일도 동일한 import 정렬 규칙을 지킨다.

## TypeScript

- `tsconfig.json`은 `strict: true`다. 타입 우회를 기본 해결책으로 쓰지 않는다.
- 서버 응답 shape가 있으면 함수 반환 타입까지 연결한다.
- loose object보다 명시적 interface/type을 선호한다.
- 다만 타입이 feature 전용이면 `entities`로 올리지 않는다.

## 네이밍

- React 컴포넌트는 PascalCase를 사용한다.
- 훅은 `use...` 형식으로 작성한다.
- API 함수는 `get...`, `set...`, `read...`, `register...`처럼 동사로 시작한다.
- route 파일의 default export 함수명은 짧아도 괜찮지만, 실제 화면 컴포넌트명은 역할이 드러나야 한다.

## 컴포넌트 분리

- `app/` route 파일은 얇게 유지한다.
- 데이터 fetch, route param 처리, 이벤트 조합은 `src/pages`가 맡는다.
- 재사용 가능한 렌더링 조각은 `src/widgets`로 내린다.
- 완전히 feature 전용이고 페이지 전반에서 재사용되지 않는 UI는 `src/features/.../ui`에 둘 수 있다.
- presentation 컴포넌트에는 임시 fetch fallback이나 페이지 상태를 넣지 않는다.

## 스타일

- 공용 숫자/색상은 가능하면 `src/init/styles/tokens.ts`를 사용한다.
- `src/init/styles/tokens.ts`는 생성 파일이므로 직접 수정하지 않는다.
- 토큰 원본 수정이 필요하면 생성 원본과 빌드 흐름을 먼저 확인한다.
- 인라인 스타일은 간단한 레이아웃 수준에서는 허용되지만, 반복되면 `StyleSheet.create`로 내린다.

## 주석

- 주석은 "무슨 코드인지"보다 "왜 이렇게 되어 있는지"가 필요할 때만 쓴다.
- 죽은 주석, TODO, 임시 메모는 남기지 않는다.
- 과거 API 응답 예시처럼 오래된 주석 데이터는 실제 코드 이해에 필요 없으면 제거 대상이다.

# 개발 규칙

## 새 기능 추가

- 먼저 route wrapper가 필요한지 확인한다.
- 실제 화면은 `src/pages`에 만들고, 재사용 조각만 `widgets` 또는 `features/ui`로 분리한다.
- API 추가 시:
  - `shared/api/api.ts`를 재사용한다.
  - feature별 `api/`에 함수 추가
  - 필요한 DTO를 같은 feature의 `model/`에 추가
- 전역 상태가 아니면 page local state를 우선 사용한다.

## 리팩토링

- 사용자가 요청하지 않은 대규모 구조 변경은 하지 않는다.
- 같은 흐름의 중복이 명확하고 영향 범위가 작을 때만 묶는다.
- 한 파일 수정 요청이면 먼저 그 파일 주변의 기존 패턴에 맞춰 해결한다.

## 예외 처리 / 로깅

- 공통 API 예외는 `src/shared/api/api.ts`에서 먼저 본다.
- 인증/부트스트랩/푸시처럼 전역 영향이 큰 실패는 Sentry capture 대상이다.
- 단, 푸시 등록 실패가 인증 세션 자체를 깨지 않게 분리하는 현재 패턴을 유지한다.
- 조용히 무시하는 `catch {}`가 이미 많은 레포이므로, 새로운 코드에서 추가할 때는 정말 무시 가능한 실패인지 판단하고 넣는다.

# 현재 레포에서 특히 중요한 규칙

- 로그인/리다이렉트 문제를 페이지 문제로 단정하지 말고 `app/_layout.tsx`와 `src/shared/api/api.ts`부터 확인한다.
- 스토어 하위 화면 권한/빈 화면 문제는 `app/[storeId]/_layout.tsx`의 access hydration을 먼저 확인한다.
- 알림/알림 설정/알림 라우팅은 `user` 축으로 유지한다.
- 서버 응답 타입이라는 이유로 곧바로 `entities`에 두지 않는다.
- 이미 관리자 화면에 들어올 수 있는 진입점이 열린 상태라면, 도착 페이지를 다시 `AccessDenied`로 가리는 방향은 기본값이 아니다.
- Expo Router, Expo Push, Zustand, shared Axios 구조는 이미 자리 잡은 기반이므로 먼저 재사용한다.

# AI 작업 규칙

## 수정 전

- 관련 route, page, feature api/model, shared choke point를 먼저 읽는다.
- 증상이 인증/권한/부트스트랩 문제처럼 보이면 루트 레이아웃과 공통 API를 먼저 본다.
- 새 파일 추가 전에 기존 위치가 정말 맞는지 같은 성격의 파일을 찾아본다.

## 수정 중

- 기존 import 정렬, alias 경로, 파일 배치 규칙을 유지한다.
- 불필요한 추상화, 사용되지 않는 helper, dead code를 만들지 않는다.
- 새 의존성 추가는 마지막 수단이다.

## 수정 후

- 가능한 범위에서 최소 검증을 한다.
- UI/라우팅 수정이면 관련 route 연결이 맞는지 확인한다.
- 설정/생성 파일 수정이면 직접 편집 대상이 맞는지 다시 본다.
- 변경 이유는 "무엇을 바꿨는지"보다 "왜 이 위치에서 이 방식으로 바꿨는지"가 드러나야 한다.

# 금지사항

- 추측만으로 폴더 위치를 정하지 않는다.
- feature 전용 DTO를 습관적으로 `entities`로 올리지 않는다.
- app route 파일에 페이지 로직을 두껍게 넣지 않는다.
- 이미 증명된 진입 권한 위에 중복 view gate를 또 얹지 않는다.
- 생성 파일을 직접 수정하지 않는다.
- TODO, 사용하지 않는 상태, 사용하지 않는 컴포넌트, 임시 fallback을 남긴 채 끝내지 않는다.

# 체크리스트

- 이 변경이 `app` 엔트리인지 `src/pages` 실제 화면인지 구분했는가? // 삭제
- API 함수는 feature `api/`에 있고, 공통 인증 로직은 `shared/api`에 남아 있는가?
- 타입 위치가 `entities`보다 `features/.../model`에 있어야 하는 케이스는 아닌가?
- 권한 검사가 실제 행위 제한인지, 불필요한 화면 차단인지 구분했는가?
- 스타일 값은 토큰을 재사용할 수 있는가?
- 전역 상태가 정말 필요한가, 아니면 page local state로 충분한가?
