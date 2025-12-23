# Greeni – AI 기반 어린이 대화 서비스 플랫폼 (Frontend)
<br>

### 프로젝트 소개
<br>
Greeni는 AI 대화 캐릭터와 함께 아이가 그림일기, 스무고개, 역할놀이, 동물퀴즈 등을 즐기며  
자연스럽게 언어 표현력, 창의력, 정서 발달을 도울 수 있도록 설계된 놀이 기반 학습 앱입니다.  
<p align="center">
  <img width="85" height="150" alt="greeni" src="https://github.com/user-attachments/assets/93bdded6-2686-4e56-b69c-a8ccee5fb3d5" />
</p>
<br><br>


## 실행 방법

### 1) 환경 준비
- Node.js 20.19.6
- npm 10.8.2
- Android Studio (Android SDK, SDK Command-line Tools, React Native CLI (npx 사용))
<br>

### 2) 패키지 설치
프로젝트 루트 디렉토리 (greeni-cli/) 에서 의존성을 설치
```bash
npm install
```
<br>

## 앱 실행 (Android)

### ① Android 에뮬레이터 실행
Android Studio → AVD Manager → 에뮬레이터 실행

### ② Metro Bundler 실행
```bash
npx react-native start
```
### ③ 앱 실행
```bash
npx react-native run-android
```
<br>


안 된다면 캐시 초기화 후 재시도
```bash
npx react-native start --reset-cache
```
<br>

## 참고 사항
- 의존성 관리는 package.json / package-lock.json 기준
- Node 버전 통일 권장 (.nvmrc)
