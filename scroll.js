// 썸네일 DOM
const dogThumb = document.getElementById('dogThumbnail');
const catThumb = document.getElementById('catThumbnail');
const talkBubble = document.querySelector('li.tolk');

// 보이기/숨기기 유틸 (레이아웃 흔들림 최소화를 위해 visibility 사용)
function setVisible(el, shown) {
  if (!el) return;
  el.style.visibility = shown ? 'visible' : 'hidden';
  el.style.pointerEvents = shown ? 'auto' : 'none';
  // 필요 시 opacity도 함께: el.style.opacity = shown ? '1' : '0';
}


//  브라우저 스크롤 복원 방지
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

//  유틸: clamp
const clamp = (v, min, max) => Math.max(min, Math.min(v, max));

//  DOM 참조
const sectionEl = document.getElementById('section1');
const stickyEl =
  sectionEl.querySelector('.stage') ||
  sectionEl; // .stage가 없으면 section1 자체를 sticky 대상으로 씀

// 전환 대상: 클래스 매핑(이미 네가 맞춰 둔 셀렉터)
const redBox = document.querySelector('.red-box');   // <li class="girl red-box">
const blueBox = document.querySelector('.blue-box');  // <div id="dogProfile" class="blue-box">
const greenBox = document.querySelector('.green-box'); // <div id="catProfile" class="green-box">

function ensureCentered(el) {
  if (!el) return;
  const style = el.style;
  if (!style.position) style.position = 'absolute';
  style.left = style.left || '50%';
  style.top = style.top || '41%';
  // 초기값을 덮어쓰지 않도록, transform이 비어 있을 때만 지정
  if (!style.transform) style.transform = 'translateX(-50%) translateY(-50%)';
  style.willChange = 'transform, opacity';
}
ensureCentered(redBox);


//  section 컨테이너는 absolute 배치 기준이 되도록 relative 권장
//   (이미 CSS에 있다면 무해)
if (getComputedStyle(sectionEl).position === 'static') {
  sectionEl.style.position = 'relative';
}

function setStickyHeightToViewport() {
  stickyEl.style.width = '100%';
  stickyEl.style.height = window.innerHeight + 'px';
}
setStickyHeightToViewport();

//  새로고침 시 section1로 이동
window.addEventListener('load', () => {
  sectionEl.scrollIntoView({ behavior: 'smooth' });
  // 네 기존 함수가 있다면 그대로 호출
  if (typeof updateCurrentSectionIndex === 'function') {
    updateCurrentSectionIndex();
  }
  measure();         // 초기 측정
  updateAndRender(); // 첫 렌더
});

// ===== Sticky 수동 구현을 위한 측정값 =====
let startY = 0; // sticky 시작(= sectionEl 상단)
let endY = 0; // sticky 끝(= sectionEl 하단 - viewportHeight)
let lastKnownScrollY = 0;
let ticking = false;

//  구간 재측정
function measure() {
  // sticky 기준 컨테이너는 #section1 (스크롤 공간)
  const containerRect = sectionEl.getBoundingClientRect();
  const containerTop = containerRect.top + window.scrollY;
  const containerHeight = sectionEl.offsetHeight;
  const viewportHeight = window.innerHeight;

  // sticky가 뷰포트에 고정되는 구간(start~end)
  startY = containerTop;
  endY = containerTop + containerHeight - viewportHeight;

  // sticky 요소 자체 높이를 뷰포트로 맞춰주기(권장)
  setStickyHeightToViewport();
}

//  sticky 상태 업데이트
function updateSticky(scrollY) {
  const viewportHeight = window.innerHeight;

  // 1) sticky 이전: absolute(상단 고정)
  if (scrollY < startY) {
    stickyEl.style.position = 'absolute';
    stickyEl.style.top = '0px';
    stickyEl.style.left = '0px';
    stickyEl.style.right = '0px';

    // (선택) 섹션 위쪽일 땐 썸네일 즉시 초기화
    setVisible(dogThumb, true);
    setVisible(catThumb, true);
    setVisible(talkBubble, true);
    return; // 아래 분기 불필요하므로 조기 종료해도 OK
  }
  // 2) sticky 구간: fixed(뷰포트 고정)
  else if (scrollY >= startY && scrollY <= endY) {
    stickyEl.style.position = 'fixed';
    stickyEl.style.top = '0px';
    stickyEl.style.left = '0px';
    stickyEl.style.right = '0px';
  }
  // 3) sticky 이후: absolute(하단 고정)
  else {
    stickyEl.style.position = 'absolute';
    stickyEl.style.top = (sectionEl.offsetHeight - viewportHeight) + 'px';
    stickyEl.style.left = '0px';
    stickyEl.style.right = '0px';
  }
}

//  전환 애니메이션(네 기존 로직 그대로, Y 중앙정렬 추가만)
function updateBoxes(scrollY) {
  const windowHeight = window.innerHeight;

  // 네가 기존에 쓰던 기준 유지
  const animationStart = windowHeight * 0.1;
  const animationRange = windowHeight * 2.0;
  const clamp = (v, min, max) => Math.max(min, Math.min(v, max));

  const scrollProgress = clamp((scrollY - animationStart) / animationRange, 0, 1);

  const redStart = 0.0, redDuration = 0.3;
  const blueStart = 0.3, blueDuration = 0.3;
  const greenStart = 0.6, greenDuration = 0.3;
  const EPS = 1e-6;

  const redProgress = clamp((scrollProgress - redStart) / redDuration, 0, 1);
  const blueProgress = clamp((scrollProgress - blueStart) / blueDuration, 0, 1);
  const greenProgress = clamp((scrollProgress - greenStart) / greenDuration, 0, 1);

  // ======== 가시성(visibility) 제어 ========
  // red : 0.0 ~ 0.3 구간에서만 보임
  if (redBox) {
    const redVisible = scrollProgress < blueStart - EPS;
    redBox.style.visibility = redVisible ? 'visible' : 'hidden';
    redBox.style.pointerEvents = redVisible ? 'auto' : 'none';
  }
  // blue : 0.3 ~ 0.6 구간에서만 보임
  if (blueBox) {
    const blueVisible =
      scrollProgress >= blueStart - EPS && scrollProgress < greenStart - EPS;
    blueBox.style.visibility = blueVisible ? 'visible' : 'hidden';
    blueBox.style.pointerEvents = blueVisible ? 'auto' : 'none';
  }
  // green : 0.6 ~ 0.9 구간에서만 보임
  if (greenBox) {
    const greenVisible =
      scrollProgress >= greenStart - EPS &&
      scrollProgress < (greenStart + greenDuration) + EPS; // == 0.9 근처까지
    greenBox.style.visibility = greenVisible ? 'visible' : 'hidden';
    greenBox.style.pointerEvents = greenVisible ? 'auto' : 'none';
  }

  // ======== (신규) 썸네일 토글 ========
  // 강아지 썸네일: 블루 프로필 구간부터 숨김, 그 이전(=레드)에는 보임, 섹션 처음으로 돌아오면 자동 리셋됨
  if (dogThumb) {
    const dogShouldHide = (scrollProgress >= blueStart - EPS); // 0.3~
    setVisible(dogThumb, !dogShouldHide);
  }
  // 고양이 썸네일: 그린 프로필 구간부터 숨김, 그 이전에는 보임
  if (catThumb) {
    const catShouldHide = (scrollProgress >= greenStart - EPS); // 0.6~
    setVisible(catThumb, !catShouldHide);
  }
  if (talkBubble) {
    const bubbleVisible = scrollProgress < blueStart - EPS; // 0.3 이전
    setVisible(talkBubble, bubbleVisible);
  }

  // ----- RED -----
  if (redBox) {
    const redScale = 1 + (redProgress * 1.5);
    const redTranslateX = redProgress * -50;
    const redTranslateY = redProgress * -30;
    const redOpacity = 1 - redProgress;

    redBox.style.transform =
      `translateX(-50%) translateY(-50%) scale(${redScale}) translateX(${redTranslateX}%) translateY(${redTranslateY}%)`;
    redBox.style.opacity = redOpacity;
  }

  // ----- BLUE -----
  if (blueBox) {
    const blueBaseTranslateX = redProgress * -20;
    const blueBaseScale = 1 + (redProgress * 0.3);
    const blueBaseTranslateY = redProgress * -10;

    const blueScale = blueBaseScale + (blueProgress * 1.2);
    const blueTranslateX = blueBaseTranslateX + (blueProgress * -30);
    const blueTranslateY = blueBaseTranslateY + (blueProgress * -30);
    const blueOpacity = 1 - blueProgress;

    blueBox.style.transform =
      `translateX(-50%) translateY(-50%) scale(${blueScale}) translateX(${blueTranslateX}%) translateY(${blueTranslateY}%)`;
    blueBox.style.opacity = blueOpacity;
    blueBox.style.zIndex = (redProgress > 0.1 || blueProgress > 0.1) ? 200 : 95;
  }

  // ----- GREEN -----
  if (greenBox) {
    const greenBaseTranslateX = redProgress * -15;
    const greenBaseScale = 1 + (redProgress * 0.2);
    const greenBaseTranslateY = redProgress * -8;

    const greenScale = greenBaseScale + (greenProgress * 1.3);
    const greenTranslateX = greenBaseTranslateX + (greenProgress * 30);
    const greenTranslateY = greenBaseTranslateY + (greenProgress * -30);
    const greenOpacity = 1 - greenProgress;

    greenBox.style.transform =
      `translateX(-50%) translateY(-50%) scale(${greenScale}) translateX(${greenTranslateX}%) translateY(${greenTranslateY}%)`;
    greenBox.style.opacity = greenOpacity;
    greenBox.style.zIndex = (redProgress > 0.1 || greenProgress > 0.1) ? 200 : 90;
  }
}

// 스크롤/리사이즈 루프 (성능: rAF)
function onScroll() {
  lastKnownScrollY = window.scrollY;
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(updateAndRender);
  }
}

function updateAndRender() {
  ticking = false;
  updateSticky(lastKnownScrollY);
  updateBoxes(lastKnownScrollY);
}

// 이벤트: passive 스크롤, 리사이즈/오리엔테이션 변경
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => {
  measure();
  updateAndRender();
});
window.addEventListener('orientationchange', () => {
  setTimeout(() => { measure(); updateAndRender(); }, 50);
});

// 이미지 로딩 후 재측정(레이아웃 변형 방지)
window.addEventListener('load', () => {
  // 만약 섹션 내 이미지가 많다면 한 번 더 측정
  measure();
  updateAndRender();
});

// 초기 측정
measure();
updateAndRender();