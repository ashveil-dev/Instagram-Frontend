# 인스타그램 클론 코딩 (V2.5)

프론트엔드(Vite + React)와 백엔드(Express + MongoDB)를 하나의 저장소에서 실행합니다.

## 진행 기간

- 2024년 5월 15일 ~ 2024년 6월 3일

## 목표

- 인증 페이지: 로그인/회원가입 **(완료)**
- 홈 페이지
  - 무한 스크롤을 통한 피드 가져오기 **(완료)**
  - 좋아요 누르기 **(완료)**
  - 댓글 보기 / 작성 / 댓글 좋아요 **(완료)**
  - 게시물 업로드 **(완료)**

## 로컬 실행

### 1. MongoDB

로컬 MongoDB가 `mongodb://localhost:27017/instagram` 에서 동작해야 합니다.

### 2. 백엔드 환경 변수

`server/.env.example`을 참고해 `server/.env`를 만듭니다.

### 3. 의존성 설치

```bash
npm install
npm install --prefix server
```

### 4. 개발 서버 (프론트 + 백엔드 동시 실행)

```bash
npm run dev
```

- 프론트: http://localhost:4173
- API 프록시: `/api` → http://localhost:4000
- 미디어 프록시: `/images`, `/videos` → http://localhost:4000

프론트만 실행: `npm run dev:client`  
백엔드만 실행: `npm run dev:server`

### 5. 피드·릴스 시드 데이터

MongoDB가 실행 중일 때:

```bash
npm run seed
```

- 데모 계정 4개 (`seed_travel`, `seed_photo`, `seed_daily`, `seed_reels`) — 비밀번호 `password123`
- 피드 게시물 6개, **릴스 5개** (서로 다른 mp4, 시드 시 자동 다운로드)
- 시드 게시물을 다시 넣으려면: `npm run seed:reset`

**릴스 영상 품질 (인스타 스타일):** `server/.env`에 [Pixabay 무료 API 키](https://pixabay.com/api/docs/)를 넣으세요.

```env
PIXABAY_API_KEY=your_key_here
```

이후 `npm run seed:reset` 또는 `npm run seed:reels --prefix server` 실행.  
(Instagram에서 직접 수집은 저작권·이용약관상 지원하지 않으며, Pixabay 세로 라이프스타일 영상으로 대체합니다.)

## GitHub Pages 배포 (프론트, 백엔드 서버 불필요)

주소: **https://ashveil-dev.github.io/Instagram-Frontend/**

GitHub Pages는 정적 사이트만 호스팅할 수 있어, 배포 빌드는 **프로젝트 내 Mock API**(`src/mock/`)를 사용합니다.  
데이터는 `public/`의 Unsplash 이미지·릴스 mp4와 시드 계정이며, 변경 사항은 **브라우저 localStorage**에 저장됩니다.

### 데모 로그인

| 닉네임 | 비밀번호 |
|--------|----------|
| `seed_travel` | `password123` |
| `seed_photo` | `password123` |
| `seed_daily` | `password123` |
| `seed_reels` | `password123` |

회원가입·좋아요·댓글·DM·알림도 mock에서 동작합니다.

### 설정 (중요)

1. Repo → **Settings** → **Pages**
2. **Build and deployment** → Source: **Deploy from a branch**
3. Branch: **`gh-pages`** / **`/ (root)`** → Save

`main`에 push하면 Actions가 `npm run build` 후 **`gh-pages` 브랜치**에 배포합니다.  
(예전처럼 `main` 루트 소스만 올리면 화면이 비어 있습니다.)

접속 URL 예: `https://ashveil-dev.github.io/Instagram-Frontend/#/home`

### 로컬에서 Pages 미리보기

```bash
npm run build:pages
npm run preview:pages
```

### 로컬에서 GitHub Pages 배포

```bash
npm install
npm run deploy
```

`predeploy` → 빌드 + `404.html` 생성 후 `gh-pages` 브랜치에 push합니다.  
(Pages 설정: branch **`gh-pages`** / **`/ (root)`**)

### 로컬 개발 (Express + MongoDB)

별도 백엔드가 필요하면 `server/`를 사용합니다 (`VITE_USE_MOCK_API` 없이):

```bash
npm run dev
```

## 배포 (MongoDB Atlas + 초기 시드)

### Atlas 연결

[MongoDB Atlas](https://cloud.mongodb.com) 클러스터:

`mongodb+srv://cluster0.fira4pz.mongodb.net/` — 사용자 `ashveil`

`server/.env` (또는 Docker/EC2 환경 변수):

```env
MONGO_USER=ashveil
MONGO_PASSWORD=Atlas에서_설정한_비밀번호
MONGO_CLUSTER_HOST=cluster0.fira4pz.mongodb.net
MONGO_DB_NAME=instagram
PUBLIC_SERVER_URL=http://YOUR_SERVER_IP:4000
PASS_PHRASE=your_jwt_passphrase
```

또는 `MONGO_URI=mongodb+srv://ashveil:PASSWORD@cluster0.fira4pz.mongodb.net/instagram?retryWrites=true&w=majority&appName=Cluster0`

Atlas **Network Access**에 배포 서버 IP를 허용해야 합니다.

### Docker 배포 (최초 1회 DB + 시드 자동)

```bash
# 루트에서 이미지 빌드
docker build -f server/Dockerfile -t bluebird999280/backend:latest .

# .env에 MONGO_PASSWORD 등 설정 후
docker compose up -d
```

컨테이너 시작 시 순서:

1. 컬렉션 생성·인덱스 동기화 (`user`, `post`, `comment`, `notification`, `conversation`, `message`, `deploymeta`)
2. **최초 1회만** 시드 데이터 삽입 (데모 계정·피드·릴스)
3. API 서버 기동

이미 시드가 끝난 DB에는 `deploymeta` 플래그로 재시드를 건너뜁니다. 다시 넣으려면 `FORCE_DEPLOY_SEED=true`.

### GitHub Actions 시크릿

| Secret | 설명 |
|--------|------|
| `MONGO_PASSWORD` | Atlas 비밀번호 |
| `PASS_PHRASE` | JWT 암호 |
| `PUBLIC_SERVER_URL` | 예: `http://52.63.35.30:4000` |
| `DOCKERHUB_USERNAME` / `DOCKERHUB_TOKEN` | Docker Hub |
| `SERVER_ADDRESS` / `SERVER_TOKEN` | EC2 SSH |

## API 구조 (백엔드 `server/`)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/user/signIn` | 로그인 |
| POST | `/api/user/signUp` | 회원가입 |
| POST | `/api/user/check` | 토큰 갱신/검증 |
| GET | `/api/post` | 피드 목록 (페이지네이션) |
| GET | `/api/post/:id` | 단일 피드 + 댓글 |
| POST | `/api/post` | 게시물 업로드 |
| GET | `/api/post/like` | 게시물 좋아요 토글 |
| POST | `/api/comment` | 댓글 작성 |
| GET | `/api/comment/like` | 댓글 좋아요 토글 |

프론트 API 호출은 `src/slices/user/api.ts`, `src/slices/feed/api.ts`, `src/slices/comment/api.ts`에 정리되어 있습니다.

## 배포

<a href="http://13.124.70.98:4173/home">서버 배포</a>

프로덕션 API는 `public/_redirects`의 Netlify 프록시 설정을 따릅니다.

## 자체 피드백

1. 개발과 배포 환경 설정하기
2. 한 API에 대하여 에러를 공유하지 않기
