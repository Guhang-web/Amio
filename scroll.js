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


// === 추가: 타깃 요소 참조 ===
const dogFinal = document.getElementById('dogFinalPosition');
const dogFinalImg = dogFinal ? dogFinal.querySelector('img') : null;
const dogThumbImg = dogThumb ? (dogThumb.querySelector('img') || dogThumb) : null;

// === 추가: 이동용 플로팅 강아지 생성 (뷰포트 기준 고정) ===
const movingDog = document.createElement('img');
movingDog.src = dogThumbImg ? (dogThumbImg.src || 'mainImg/dog.png') : 'mainImg/dog.png';
movingDog.alt = '강아지 이동 중';
Object.assign(movingDog.style, {
  position: 'fixed',   // viewport 좌표계
  left: '0px',
  top: '0px',
  width: '0px',
  height: '0px',
  visibility: 'hidden',
  pointerEvents: 'none',
  zIndex: '350',       // blueBox(200) 위로
  willChange: 'left, top, width, height, opacity'
});
document.body.appendChild(movingDog);

// === 추가: 이동 상태 관리 ===
let dogStartRect = null;   // 시작 rect(썸네일) 메모
let dogWasInBlue = false;  // blue 구간 진입 여부
const lerp = (a, b, t) => a + (b - a) * t;
const getCenterRect = (el) => {
  const r = el.getBoundingClientRect();
  return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, w: r.width, h: r.height };
};

// === CAT refs ===
const catFinal = document.getElementById('catFinalPosition');
const catFinalImg = catFinal ? catFinal.querySelector('img') : null;
const catThumbImg = catThumb ? (catThumb.querySelector('img') || catThumb) : null;

// .invisible 이 있으면 visibility로는 안 보이니 제거
if (catFinalImg && catFinalImg.classList.contains('invisible')) {
  catFinalImg.classList.remove('invisible');
}

// === 이동용 플로팅 고양이 (한 번만 생성) ===
let movingCat = document.getElementById('movingCatImg');
if (!movingCat) {
  movingCat = document.createElement('img');
  movingCat.id = 'movingCatImg';
  movingCat.src = catThumbImg ? (catThumbImg.src || 'mainImg/catsTower.png') : 'mainImg/catsTower.png';
  movingCat.alt = '고양이 이동 중';
  Object.assign(movingCat.style, {
    position: 'fixed',
    left: '0px',
    top: '0px',
    width: '0px',
    height: '0px',
    visibility: 'hidden',
    pointerEvents: 'none',
    zIndex: '360',
    willChange: 'left, top, width, height, opacity'
  });
  document.body.appendChild(movingCat);
}

let catStartRect = null;
let catWasInGreen = false;
let catSnapped = false; // greenStart에 진입한 그 프레임에 즉시 자리 고정했는지



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

    //  블루 가시성 플래그를 바깥에서 쓸 수 있게 준비
  let blueVisible = false;

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
  // ======== 강아지 이동 애니메이션 : 썸네일 -> dogFinalPosition ========
  // blue 범위: scrollProgress ∈ [blueStart, greenStart)
  const inBlueRange = (scrollProgress >= blueStart - EPS) && (scrollProgress < greenStart - EPS);

  if (inBlueRange && dogFinalImg && dogThumbImg) {
    if (!dogWasInBlue) {
      dogWasInBlue = true;
      dogStartRect = getCenterRect(dogThumbImg);
      setVisible(dogFinalImg, false);
      setVisible(movingDog, true);
      movingDog.style.opacity = '1';
    }

    const target = getCenterRect(dogFinalImg);
    const t = blueProgress;

    const curW = lerp(dogStartRect.w, target.w, t);
    const curH = lerp(dogStartRect.h, target.h, t);
    const curCX = lerp(dogStartRect.cx, target.cx, t);
    const curCY = lerp(dogStartRect.cy, target.cy, t);

    movingDog.style.width = curW + 'px';
    movingDog.style.height = curH + 'px';
    movingDog.style.left = (curCX - curW / 2) + 'px';
    movingDog.style.top  = (curCY - curH / 2) + 'px';

    if (t >= 1 - EPS) {
      setVisible(movingDog, false);
      setVisible(dogFinalImg, true);
    } else {
      setVisible(dogFinalImg, false);
    }

  } else {
    if (dogWasInBlue) {
      dogWasInBlue = false;
      dogStartRect = null;
    }
    setVisible(movingDog, false);

    if (scrollProgress < blueStart - EPS) {
      setVisible(dogFinalImg, false);
    } else if (scrollProgress >= (blueStart + blueDuration) - EPS) {
      // 강아지 최종 이미지는 네 기존 의도대로 유지 (원하면 숨김으로 바꿔도 OK)
      setVisible(dogFinalImg, true);
    }
  }

  const blueBaseTranslateX = redProgress * -20;
  const blueBaseScale = 1 + (redProgress * 0.3);
  const blueBaseTranslateY = redProgress * -10;

  const blueScale = blueBaseScale + (blueProgress * 1.2);
  const blueTranslateX = blueBaseTranslateX + (blueProgress * -30);
  const blueTranslateY = blueBaseTranslateY + (blueProgress * -30);

  blueBox.style.transform =
    `translateX(-50%) translateY(-50%) scale(${blueScale}) translateX(${blueTranslateX}%) translateY(${blueTranslateY}%)`;

  // ======== ★ 여기부터: blueBox만 "늦게" 사라지게 하는 지연 페이드 ========
  // 블루 진행도(0~1) 중 후반부터만 페이드 시작 → 끝에서 급격히 떨어지도록 이징
  const FADE_START = 0.2;                                   // ★ 페이드 시작 지점(느낌에 맞게 0.6~0.75)
  const fadeT = clamp((blueProgress - FADE_START) / (1 - FADE_START), 0, 1);
  const lateDrop = Math.pow(fadeT, 3);                       // ★ 끝에서 급히 떨어지는 easeInCubic
  const blueOpacitySlow = 1 - lateDrop;

  // green 시작과 동시에 0 보장(겹침 방지)
  const blueCoreVisible = (scrollProgress >= blueStart - EPS) && (scrollProgress < greenStart - EPS);
  blueBox.style.opacity = blueCoreVisible ? blueOpacitySlow : 0;   // ★ 핵심: 느리게 사라지되 greenStart에서 0
  blueBox.style.visibility = (blueCoreVisible && blueOpacitySlow > 0) ? 'visible' : 'hidden';
  blueBox.style.pointerEvents = (blueCoreVisible && blueOpacitySlow > 0.2) ? 'auto' : 'none'; // 후반 상호작용 차단
  // --- 이미지 동기 페이드(강아지) ---
  // 블루 코어 구간에서만 강아지 이미지도 박스와 같은 타이밍으로 페이드
  const isBlueCore =
  (scrollProgress >= blueStart - EPS) &&
    (scrollProgress <  greenStart - EPS);
    
    // 이동 중엔 플로팅 강아지(movingDog)만, 도착 후엔 최종 자리(dogFinalImg)만 보이므로
    // 같은 타이밍(blueOpacitySlow)으로 각각에 alpha를 적용한다.
    if (isBlueCore) {
      const movingDogAlpha = (blueProgress < 1 - EPS) ? blueOpacitySlow : 0;
      const dogFinalAlpha  = (blueProgress >= 1 - EPS) ? blueOpacitySlow : 0;
      
      // will-change은 미리 걸어두면 좋음(성능)
      movingDog.style.willChange = 'left, top, width, height, opacity';
      if (dogFinalImg) dogFinalImg.style.willChange = 'opacity';
      
      movingDog.style.opacity = String(movingDogAlpha);
    if (dogFinalImg) dogFinalImg.style.opacity = String(dogFinalAlpha);
  } else {
    movingDog.style.opacity = '0';
    if (dogFinalImg) dogFinalImg.style.opacity = '0';
  }
  
  
  // ======== ★ 끝 ========
  blueBox.style.zIndex = (redProgress > 0.1 || blueProgress > 0.1) ? 200 : 95;
}
// ----- GREEN -----
if (greenBox) {
  // 코어 가시 구간: [greenStart, greenStart + greenDuration)
  const greenCoreVisible =
    (scrollProgress >= greenStart - EPS) &&
    (scrollProgress < (greenStart + greenDuration) - EPS);

  // 진행도 (0~1)
  const tRaw = greenProgress;
  // 필요 시 이징: 부드럽게
  const easeInOut = x => (x < 0.5) ? 2*x*x : 1 - Math.pow(-2*x + 2, 2) / 2;
  const t = easeInOut(tRaw);

  // ======== 고양이 이동: 썸네일 -> catFinalPosition (부드러운 보간) ========
  if (greenCoreVisible && catFinalImg && catThumbImg) {
    if (!catWasInGreen) {
      catWasInGreen = true;
      catStartRect = getCenterRect(catThumbImg); // 시작점 캡처
      setVisible(catFinalImg, false);            // 도착 전 최종 이미지는 숨김
      setVisible(movingCat, true);               // 플로팅 고양이 표시
      movingCat.style.opacity = '1';
    }

    // 매 프레임 타깃(최종 자리) 측정
    const target = getCenterRect(catFinalImg);

    const curW  = lerp(catStartRect.w,  target.w,  t);
    const curH  = lerp(catStartRect.h,  target.h,  t);
    const curCX = lerp(catStartRect.cx, target.cx, t);
    const curCY = lerp(catStartRect.cy, target.cy, t);

    movingCat.style.width  = curW + 'px';
    movingCat.style.height = curH + 'px';
    movingCat.style.left   = (curCX - curW / 2) + 'px';
    movingCat.style.top    = (curCY - curH / 2) + 'px';

    if (t >= 1 - EPS) {
      // 이동 완료: 플로팅 숨기고 최종 이미지 노출
      setVisible(movingCat, false);
      setVisible(catFinalImg, true);
    } else {
      setVisible(catFinalImg, false);
    }
  } else {
    // 코어 구간 밖: 모두 정리(블루와 동일하게 동기화)
    if (catWasInGreen) {
      catWasInGreen = false;
      catStartRect = null;
    }
    setVisible(movingCat, false);
    setVisible(catFinalImg, false);
  }

  // ======== greenBox 트랜스폼 ========
  const greenBaseTranslateX = redProgress * -15;
  const greenBaseScale      = 1 + (redProgress * 0.2);
  const greenBaseTranslateY = redProgress * -8;

  const greenScale      = greenBaseScale + (greenProgress * 1.3);
  const greenTranslateX = greenBaseTranslateX + (greenProgress * 30);
  const greenTranslateY = greenBaseTranslateY + (greenProgress * -30);

  greenBox.style.transform =
    `translateX(-50%) translateY(-50%) scale(${greenScale}) translateX(${greenTranslateX}%) translateY(${greenTranslateY}%)`;

  // ======== greenBox 느린 페이드(블루와 동일한 느낌) ========
  // 후반에만 서서히 사라지다가 마지막에 툭 떨어지게
  const FADE_START_G = 0.2; // 블루에서 좋았던 0.65 그대로
  const fadeTG = clamp((greenProgress - FADE_START_G) / (1 - FADE_START_G), 0, 1);
  const lateDropG = Math.pow(fadeTG, 1); // 끝에서 급격히
  const greenOpacitySlow = 1 - lateDropG;

  greenBox.style.opacity = greenCoreVisible ? greenOpacitySlow : 0;
  greenBox.style.visibility = (greenCoreVisible && greenOpacitySlow > 0) ? 'visible' : 'hidden';
  greenBox.style.pointerEvents = (greenCoreVisible && greenOpacitySlow > 0.2) ? 'auto' : 'none';
  greenBox.style.zIndex = (redProgress > 0.1 || greenProgress > 0.1) ? 200 : 90;

  // === 이미지 동기 페이드(고양이) ===
const isGreenCore =
  (scrollProgress >= greenStart - EPS) &&
  (scrollProgress <  greenStart + greenDuration - EPS);

if (isGreenCore) {
  // 이동 중엔 플로팅 고양이만, 도착 후엔 최종 자리 고양이만 보이도록
  const movingCatAlpha = (greenProgress < 1 - EPS) ? greenOpacitySlow : 0;
  const catFinalAlpha  = (greenProgress >= 1 - EPS) ? greenOpacitySlow : 0;

  movingCat.style.opacity = String(movingCatAlpha);
  if (catFinalImg) catFinalImg.style.opacity = String(catFinalAlpha);
} else {
  movingCat.style.opacity = '0';
  if (catFinalImg) catFinalImg.style.opacity = '0';
}

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
   dogStartRect = null;
  measure();
  updateAndRender();
});
window.addEventListener('orientationchange', () => {
  setTimeout(() => { dogStartRect = null; measure(); updateAndRender(); }, 50);
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