# [PRD] 마이링크 (MyLink) 제품 요구사항 정의서

- **문서 버전**: v1.1.0
- **작성 일자**: 2026-10-10
- **상태**: 승인됨 (Approved)
- **대상 플랫폼**: 반응형 웹 애플리케이션 (클라이언트 전용 데모 / 프로토타입)
- **디자인 시스템**: shadcn/ui 기반 + 토스 디자인 시스템 (TDS) 스타일

---

## 1. 프로젝트 개요

### 1.1 배경 및 목적
- 복잡하고 무거운 기존 링크트리/포트폴리오 서비스 대비, **직장인과 개인이 1분 만에 깔끔한 디지털 명함 형태의 프로필 링크**를 만들 수 있는 미니멀 멀티링크 서비스입니다.
- 백엔드 서버 없이 브라우저의 `LocalStorage`와 `Mock Data`를 기반으로 동작하여, 별도의 인프라 비용 없이 완성도 높은 사용자 경험(생성, 편집, 실시간 프리뷰, 통계 추적, 명함 다운로드)을 제공합니다.

### 1.2 핵심 타깃 사용자
- 네트워킹, 커피챗, 링크드인/이메일 서명용으로 깔끔한 프로필 링크가 필요한 **직장인**
- 여러 SNS, 블로그, 개인 웹사이트를 한 페이지에 미니멀하게 정리하고 싶은 **일반 개인**

---

## 2. 핵심 가치 및 목표 (KPI)

| 핵심 가치 | 세부 내용 및 목표 |
| :--- | :--- |
| **즉시성 (Instant)** | 로그인/회원가입 없이 접속 즉시 3분 이내 프로필 완성 |
| **토스형 미니멀 디자인** | `shadcn/ui` 기반 컴포넌트에 토스 디자인 시스템(TDS) 감성(시원한 여백, 둥근 모서리, 직관적인 인터랙션)을 접목 |
| **데이터 영속성 (Persistence)** | 새로고침 및 재방문 시에도 `LocalStorage`를 통해 데이터 안전 유지 |
| **클라이언트 분석 (Analytics)** | 총 방문 조회수 및 각 링크별 클릭 수 실시간 카운팅 |

---

## 3. 디자인 시스템 및 UI/UX 원칙 (shadcn/ui & 토스 스타일)

### 3.1 기술 기반: `shadcn/ui` + Tailwind CSS v4 (스타일 통일화)
- **Tailwind CSS 단일 통일**: 별도의 CSS 모듈(`*.module.css`)이나 분산된 스타일 시트 대신, 유틸리티 퍼스트인 **Tailwind CSS로 스타일을 100% 통일**하여 일관된 디자인 시스템과 코드 가독성을 보장.
- **재사용 가능한 `shadcn/ui` 컴포넌트 구조**: Radix UI 및 Base UI 원칙에 입각한 경량 컴포넌트(`src/components/ui/`)를 직접 구축하여 프로젝트 전반에서 재사용.
  - `Card` (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`): 컨테이너 레이아웃 표준화
  - `Button`: CVA 기반 variant(`default`, `secondary`, `destructive`, `ghost`, `outline`) 및 크기별 모듈화
  - `Input` & `Textarea`: 일관된 포커스 링, 에러 상태 및 토스 스타일 패딩 적용
  - `Switch`: 접근성 높은 토글 스위치 컴포넌트
  - `Badge`: 상태 및 카운트 표시를 위한 배지 컴포넌트
  - `Dialog` (`DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`): 모달 대화상자 컴포넌트
- **클래스 병합 및 모듈화**: `clsx`와 `cn` 유틸리티를 활용하여 필요 시 유연한 오버라이딩 지원.

### 3.2 비주얼 & 인터랙션: 토스 디자인 시스템 (TDS) 아이덴티티
- **Color Palette (절제되고 신뢰도 높은 색감)**
  - **Primary**: 토스 블루 (`#3182F6` / `hsl(217, 91%, 60%)`), 마우스 오버 시 신뢰감 있는 딥 블루 (`#1B64DA`).
  - **Neutral**:
    - 배경 (Background): 시각적 피로를 줄여주는 미색/소프트 그레이 (`#F9FAFB` 또는 `#F2F4F6`).
    - 카드/컨테이너 (Surface): 순백색 (`#FFFFFF`).
    - 텍스트 (Typography): 제목용 진한 블랙 (`#191F28`), 본문용 딥 그레이 (`#4E5968`), 보조/캡션용 뮤트 그레이 (`#8B95A1`).
  - **Border**: 과하지 않은 은은한 경계선 (`#E5E8EB` / `#F2F4F6`).
- **Typography (가독성 최우선 계층 구조)**
  - 폰트: 시스템 기본 산세리프 및 Pretendard / Geist 기반의 현대적 산세리프 서체.
  - 위계: 굵고 명확한 헤드라인(Bold 20~24px), 명확한 레이블(Medium/SemiBold 15~16px), 설명 캡션(Regular 13~14px)으로 불필요한 장식 배제.
- **Shape & Spacing (넉넉한 여백과 부드러운 라운딩)**
  - **Border Radius**: 토스 특유의 둥글고 부드러운 곡률 적용 (카드/컨테이너 `rounded-2xl` 16~20px, 버튼 `rounded-xl` 12px, 아바타 `rounded-full`).
  - **Padding/Margin**: 답답하지 않고 호흡이 긴 넉넉한 컴포넌트 여백 유지 (최소 16px~24px 단위의 내부 패딩).
  - **Shadow**: 인위적이고 짙은 그림자 대신, 플랫한 카드 배경과 은은한 보더 혹은 매우 부드러운 초미세 그림자(`shadow-xs`, `shadow-sm`) 활용.
- **Micro-Interaction & Feedback (생동감 있는 터치/인터랙션)**
  - 버튼 클릭 시 미세하게 축소되는 스케일 피드백 (`active:scale-[0.98]` 트랜지션).
  - 토글 스위치, 링크 활성화, 모달 오픈 시 부드러운 ease-out 트랜지션 제공.
  - 중요한 액션 완료 시(링크 복사, vCard 저장 등) 토스 스타일의 간결한 플로팅 토스트(Toast/Sonner) 노출.

---

## 4. 정보 구조 및 데이터 모델 (Schema)

```typescript
export interface ProfileInfo {
  name: string;                  // 사용자 이름 (예: "홍길동")
  role: string;                  // 직함/소속 (예: "Product Designer @ Acme Corp")
  bio: string;                   // 한 줄 소개 (예: "디자인과 기술을 연결합니다.")
  avatarUrl: string;             // 프로필 이미지 URL 또는 Base64/프리셋 아바타
}

export interface ContactInfo {
  email?: string;                // 이메일 주소
  phone?: string;                // 전화번호
  linkedin?: string;             // LinkedIn URL
  github?: string;               // GitHub URL
  instagram?: string;            // Instagram URL
}

export interface LinkItem {
  id: string;                    // 링크 고유 식별자 (UUID 등)
  title: string;                 // 버튼 레이블 (예: "포트폴리오 노션")
  url: string;                   // 연결 대상 URL
  icon?: string;                 // 링크 아이콘 (선택)
  isActive: boolean;             // 공개/숨김 여부
  clicks: number;                // 클릭 횟수 (통계)
}

export type ThemeType = 'minimal-light' | 'modern-dark' | 'corporate-blue' | 'warm-beige';

export interface AnalyticsInfo {
  pageViews: number;             // 총 프로필 조회수
  updatedAt: string;             // 마지막 갱신 시간 (ISO string)
}

export interface MyLinkState {
  profile: ProfileInfo;
  contact: ContactInfo;
  links: LinkItem[];
  theme: ThemeType;
  analytics: AnalyticsInfo;
}
```

### 4.2 기본 더미 데이터 명세 (Default Dummy Data Specification)

서비스 초기 로드 및 '샘플 데이터 채우기(Mock Data)' 기능 실행 시 사용되는 표준 링크 더미 데이터셋입니다.

```typescript
export const DEFAULT_LINKS_DUMMY_DATA: LinkItem[] = [
  {
    id: "link-1",
    title: "GitHub 저장소",
    url: "https://github.com",
    icon: "github",
    isActive: true,
    clicks: 42,
  },
  {
    id: "link-2",
    title: "기술 블로그 & 기록",
    url: "https://velog.io",
    icon: "book-open",
    isActive: true,
    clicks: 28,
  },
  {
    id: "link-3",
    title: "온라인 이력서 & 포트폴리오",
    url: "https://notion.so",
    icon: "file-text",
    isActive: true,
    clicks: 65,
  },
  {
    id: "link-4",
    title: "최신 토이 프로젝트 데모",
    url: "https://vercel.app",
    icon: "rocket",
    isActive: true,
    clicks: 19,
  },
  {
    id: "link-5",
    title: "LinkedIn 프로필",
    url: "https://linkedin.com",
    icon: "linkedin",
    isActive: true,
    clicks: 34,
  },
  {
    id: "link-6",
    title: "Instagram",
    url: "https://instagram.com",
    icon: "instagram",
    isActive: false,
    clicks: 12,
  },
  {
    id: "link-7",
    title: "1:1 커피챗 & 오픈채팅",
    url: "https://open.kakao.com",
    icon: "message-circle",
    isActive: true,
    clicks: 15,
  },
  {
    id: "link-8",
    title: "비즈니스 문의 (Email)",
    url: "mailto:contact@example.com",
    icon: "mail",
    isActive: true,
    clicks: 8,
  },
];
```

> **더미 데이터 활용 원칙**:
> - 신규 사용자 유입 시 빈 화면 대신 풍부한 샘플 화면을 보여주어 서비스 완성도 및 온보딩 경험 제고.
> - 에디터 패널의 '샘플 불러오기(Load Sample)' 버튼 클릭 시 상기 데이터셋으로 즉시 복원.
> - 클릭 수(`clicks`) 및 활성화 토글(`isActive`) 테스트를 위해 일부 항목에 기본 카운트 및 비활성화 상태 포함.

---

## 5. 전역 상태 관리 아키텍처 (Zustand)

### 5.1 도입 이유
- **LocalStorage 자동 동기화**: `persist` 미들웨어를 통해 상태 변경 시 실시간 브라우저 로컬 저장 및 자동 복원(Hydration).
- **렌더링 최적화**: 좌측 에디터 입력 시 필요한 컴포넌트(우측 모바일 미리보기의 특정 부분)만 세밀하게 리렌더링.
- **간결한 구조**: 보일러플레이트 없이 직관적인 단일 스토어 형태로 관리.

### 5.2 스토어 설계 (State & Actions)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MyLinkStore extends MyLinkState {
  // 프로필 & 연락처 액션
  updateProfile: (field: keyof ProfileInfo, value: string) => void;
  updateContact: (field: keyof ContactInfo, value: string) => void;

  // 링크 관리 액션
  addLink: (link: Omit<LinkItem, 'id' | 'clicks'>) => void;
  updateLink: (id: string, updated: Partial<LinkItem>) => void;
  deleteLink: (id: string) => void;
  reorderLinks: (newLinks: LinkItem[]) => void;
  toggleLinkActive: (id: string) => void;

  // 테마 & 통계 액션
  setTheme: (theme: ThemeType) => void;
  incrementPageView: () => void;
  incrementLinkClick: (linkId: string) => void;

  // 유틸리티 액션
  loadSampleData: () => void;
  resetToDefault: () => void;
}
```

---

## 6. 상세 기능 요구사항 (Functional Requirements)

### 6.1 관리자 편집기 (Editor Panel)
- **컴포넌트 구현 기반**: `shadcn/ui`의 Form, Input, Card, Button, Switch 컴포넌트를 TDS(토스) 스타일로 커스텀하여 구성.
- **기본 프로필 설정**
  - 이름, 소속/직함, 한 줄 소개(최대 100자) 입력 (`shadcn/ui Input`, `Textarea`).
  - 프로필 이미지: 프리셋 아바타 선택 / 외부 URL 입력 / 로컬 이미지 파일 업로드(Base64 인코딩).
- **소셜 및 연락처 아이콘 설정**
  - 이메일, 전화번호, LinkedIn, GitHub, Instagram 입력 시 프로필에 전용 아이콘 자동 표시.
- **링크 목록 관리 (CRUD & 순서 조정)**
  - 추가, 수정, 삭제 기능 (`shadcn/ui Dialog` 모달 기반 편집 지원).
  - 노출 여부 토글: `shadcn/ui Switch`를 활용하여 링크 삭제 없이 부드러운 애니메이션과 함께 일시 숨김 지원.
  - 링크 순서 정렬(위/아래 이동 버튼 또는 드래그 앤 드롭).
- **데이터 관리 도구**
  - `샘플 데이터 채우기`: 원클릭으로 직장인 표준 프로필 샘플 데이터 로드 (`shadcn/ui Button`).
  - `전체 초기화`: 빈 템플릿으로 리셋 (`shadcn/ui AlertDialog` 확인창 제공).

### 6.2 테마 커스터마이징 (4종 프리셋 - TDS 기반 변주)
모든 테마는 TDS의 기본 철학(시원한 카드 UI, 라운딩, 명확한 가독성)을 계승하며 색상/분위기를 분기:
1. **Minimal Light (TDS Standard)**: 토스 시그니처 룩. 클린 화이트 카드 + 미색 배경(`slate-50`), 토스 블루 포인트, 그레이 보더.
2. **Modern Dark**: 딥 차콜/다크 배경, 차분한 화이트 텍스트, 네온 블루 포인트, 모던 다크 카드.
3. **Corporate Blue**: 신뢰감을 주는 네이비/로열 블루 그라데이션 포인트, 직장인 명함에 최적화된 비즈니스 룩.
4. **Warm Beige**: 부드러운 크림/베이지 톤 배경, 따뜻한 텍스트 컬러와 감성적인 라운드 카드.

### 6.3 모바일 프리뷰 (Live Split View)
- 좌측 편집 폼과 우측 모바일 기기 목업(iPhone 프레임) 분할 뷰 제공.
- 좌측 편집 시 우측 화면에 지연 없이 실시간 반영.
- [에디터 모드]와 [방문자 전용 전체화면 모드] 전환 지원 (`shadcn/ui Tabs` 또는 `ToggleGroup`).

### 6.4 디지털 명함 & 공유 기능
- **vCard(.vcf) 다운로드**: 방문자가 `연락처 저장` 버튼 클릭 시 스마트폰 연락처 앱에 등록 가능한 vCard 파일 즉시 다운로드.
- **링크 공유 / 클립보드 복사**: 프로필 링크 복사 버튼 클릭 시 토스 스타일 플로팅 토스트(`sonner`/`toast`) 알림 제공.

### 6.5 방문자 통계 (Local Analytics)
- **페이지 조회수**: 프로필 화면 노출 시 `pageViews` 카운트 증가.
- **링크 클릭수**: 각 링크 버튼 클릭 시 해당 링크의 `clicks` 카운트 증가.
- **통계 대시보드 위젯**: 편집기 상단에 `shadcn/ui Card` 기반으로 총 조회수, 총 클릭수, 가장 인기 있는 링크 지표를 깔끔한 숫자 뱃지와 함께 표시.

---

## 7. 화면 레이아웃 (UI Structure)

```
+-----------------------------------------------------------------------------------+
|  [MyLink 로고]                  [샘플 불러오기] [초기화] [방문자 화면 보기] [공유하기]  |
+-------------------------------------------------+---------------------------------+
|  < 좌측: 편집 패널 (Editor) >                     |  < 우측: 실시간 모바일 목업 >      |
|  (shadcn/ui Card & Form 기반 TDS 스타일)          |  (iPhone 목업 프레임)            |
|                                                 |                                 |
|  [ 통계 요약: 총 조회수 128회 | 링크 클릭수 54회 ] |     +---------------------+     |
|                                                 |     |   [Profile Image]   |     |
|  1. 프로필 정보 (이름, 직함, 소개글, 아바타)         |     |      홍 길 동       |     |
|  2. 소셜/연락처 아이콘 (Email, LinkedIn 등)       |     |  Product Manager    |     |
|  3. 테마 선택 (Light / Dark / Blue / Beige)     |     |   "문제를 해결하는..."|     |
|  4. 링크 목록 관리                              |     |     (E) (In) (Gh)   |     |
|     [+ 새 링크 추가]                            |     |                     |     |
|     - [위/아래] 포트폴리오 노션 [ON] [수정/삭제]     |     |  [연락처 저장 (vCard)]|     |
|     - [위/아래] 브런치 블로그   [ON] [수정/삭제]     |     |  +---------------+  |     |
|                                                 |     |  | 포트폴리오 노션 |  |     |
|                                                 |     |  +---------------+  |     |
|                                                 |     |  | 브런치 블로그  |  |     |
|                                                 |     |  +---------------+  |     |
+-------------------------------------------------+---------------------------------+
```

---

## 8. 향후 로드맵 (Backend 연동 확장 시)

1. **Phase 1 (현재)**: shadcn/ui + TDS 스타일링 + Zustand + LocalStorage 기반의 클라이언트 완성형 프로토타입.
2. **Phase 2**: Supabase / Firebase Auth를 통한 소셜 로그인(Google, Kakao) 연동.
3. **Phase 3**: 사용자별 고유 URL 라우팅 (`mylink.io/@username`) 및 서버 DB 영구 저장.
4. **Phase 4**: 일자별/유입 경로별 정밀 방문자 분석 차트 제공.
