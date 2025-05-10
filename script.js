// 현재 어느 섹션에 있는지 기록 (1=section1, 2=section2, ..., 7=footer)
let currentSection = 1;

// 스크롤 중복 방지용 플래그
let isScrolling = false;

// dogProfile, catProfile 상태 기록
// 0: 아무것도 안 나옴, 1: dogProfile만 나옴, 2: catProfile까지 나옴
let profileStage = 0;

// dogProfile 보여주기 (부드럽게)
function showDogProfile() {
  const dog = document.getElementById("dogProfile");
  dog.classList.add("show");
  document.querySelector('.S1WrapperMiddle').style.zIndex = "10";
}

// catProfile 보여주기 (부드럽게)
function showCatProfile() {
  const cat = document.getElementById("catProfile");
  cat.classList.add("show");
  document.querySelector('.S1WrapperMiddle').style.zIndex = "10";
}

// catProfile 숨기기
function hideCatProfile() {
  const cat = document.getElementById("catProfile");
  cat.classList.remove("show");
}

// dogProfile 숨기기
function hideDogProfile() {
  const dog = document.getElementById("dogProfile");
  dog.classList.remove("show");
}

// 특정 섹션으로 스크롤 이동
function scrollToSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
}

// 메인 스크롤 제어 함수
function handleScroll(direction) {
  // 스크롤 중이라면 무시
  if (isScrolling) return;
  isScrolling = true;

  if (currentSection === 1) {
    // section1 안일 때
    if (direction === "down") {
      if (profileStage === 0) {
        // dogProfile 처음 등장
        showDogProfile();
        profileStage++;
      } else if (profileStage === 1) {
        // catProfile 등장
        showCatProfile();
        profileStage++;
      } else if (profileStage === 2) {
        // catProfile 사라지고 section2로 이동
        hideCatProfile();
        scrollToSection("section2");
        currentSection = 2;
        profileStage = 2; // stage는 유지
      }
    } else if (direction === "up") {
      // 위로 스크롤할 때
      if (profileStage === 2) {
        hideCatProfile();
        profileStage--;
      } else if (profileStage === 1) {
        hideDogProfile();
        profileStage--;
      }
    }
  } else if (currentSection === 2) {
    if (direction === "down") {
      scrollToSection("section3");
      currentSection = 3;
    } else if (direction === "up") {
      scrollToSection("section1");
      currentSection = 1;
      setTimeout(() => {
        // section1 올라오면 catProfile 다시 등장
        showCatProfile();
        profileStage = 2;
      }, 800); // 올라오는 스크롤 끝난 뒤
    }
  } else if (currentSection === 3) {
    if (direction === "down") {
      scrollToSection("section4");
      currentSection = 4;
    } else if (direction === "up") {
      scrollToSection("section2");
      currentSection = 2;
    }
  } else if (currentSection === 4) {
    if (direction === "down") {
      scrollToSection("section5");
      currentSection = 5;
    } else if (direction === "up") {
      scrollToSection("section3");
      currentSection = 3;
    }
  } else if (currentSection === 5) {
    if (direction === "down") {
      scrollToSection("section6");
      currentSection = 6;
    } else if (direction === "up") {
      scrollToSection("section4");
      currentSection = 4;
    }
  } else if (currentSection === 6) {
    if (direction === "down") {
      scrollToSection("footer");
      currentSection = 7;
    } else if (direction === "up") {
      scrollToSection("section5");
      currentSection = 5;
    }
  } else if (currentSection === 7) {
    if (direction === "up") {
      scrollToSection("section6");
      currentSection = 6;
    }
  }

  // 1초 뒤에 다시 스크롤 허용 (중복 방지용)
  setTimeout(() => {
    isScrolling = false;
  }, 1000);
}

// 휠(마우스 스크롤) 이벤트 감지
window.addEventListener("wheel", (e) => {
  const direction = e.deltaY > 0 ? "down" : "up";
  handleScroll(direction);
});

// 터치(모바일 스크롤) 이벤트 감지
let touchStartY = 0;
window.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
});
window.addEventListener("touchend", (e) => {
  const touchEndY = e.changedTouches[0].clientY;
  const deltaY = touchStartY - touchEndY;

  if (Math.abs(deltaY) < 50) return; // 너무 짧은 터치는 무시

  const direction = deltaY > 0 ? "down" : "up";
  handleScroll(direction);
});
// section2 DogEat 드래그 슬라이더
    const sliderWrapper = document.querySelector('.slider-wrapper');

    let isDown = false;
    let startX;
    let scrollLeft;

    sliderWrapper.addEventListener('mousedown', (e) => {
        isDown = true;
        sliderWrapper.classList.add('active');
        startX = e.pageX - sliderWrapper.offsetLeft;
        scrollLeft = sliderWrapper.scrollLeft;
    });

    sliderWrapper.addEventListener('mouseleave', () => {
        isDown = false;
        sliderWrapper.classList.remove('active');
    });

    sliderWrapper.addEventListener('mouseup', () => {
        isDown = false;
        sliderWrapper.classList.remove('active');
    });

    sliderWrapper.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - sliderWrapper.offsetLeft;
        const walk = (x - startX) * 0.5; // 스크롤 속도 조절
        sliderWrapper.scrollLeft = scrollLeft - walk;
    });
// section2 DogEat 슬라이더 (input)
    const rangeSlider = document.getElementById('rationgSlider1');

    rangeSlider.addEventListener('input', () => {
        const maxScroll = sliderWrapper.scrollWidth - sliderWrapper.clientWidth;
        sliderWrapper.scrollLeft = (rangeSlider.value / 5) * maxScroll;
    });

    sliderWrapper.addEventListener('scroll', () => {
        const maxScroll = sliderWrapper.scrollWidth - sliderWrapper.clientWidth;
        rangeSlider.value = (sliderWrapper.scrollLeft / maxScroll) * 5;
    });


// section3 CatEat 슬라이더 (드래그)
const slider = document.getElementById('rationgSlider2');  // range input
const eatMenu = document.querySelector('.eatMenu1');       // 메뉴 슬라이드 영역

let isDragging = false;       // 드래그 중 여부
let startX1 = 0;               // 마우스 시작 위치 (x좌표)
let scrollStart = 0;          // 드래그 시작 시 메뉴의 위치
let currentValue = parseFloat(slider.value); // 현재 슬라이더 값 (0~100)

// ✅ 슬라이더 직접 조작 시 메뉴 이동
slider.addEventListener('input', function () {
    currentValue = parseFloat(this.value);
    scrollEatMenu(currentValue);
});

// ✅ 슬라이더 값(0~100)을 기반으로 메뉴 translateX 이동
function scrollEatMenu(value) {
    const maxTranslate = eatMenu.scrollWidth - eatMenu.parentElement.offsetWidth; // 최대 이동 거리
    const translateX = (value / parseFloat(slider.max)) * maxTranslate;  // 현재 슬라이더 비율만큼 이동
    eatMenu.style.transform = `translateX(-${translateX}px)`; // 왼쪽으로 이동
    slider.value = value; // 슬라이더 값 반영
}

// ✅ 마우스를 메뉴에 눌렀을 때: 드래그 시작
eatMenu.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX1 = e.clientX; // 마우스 x좌표 기억
    scrollStart = parseTransformX(eatMenu.style.transform); // 현재 위치 기억
    eatMenu.style.cursor = 'grabbing'; // 커서 변경
});

// ✅ 마우스를 움직일 때: 드래그 진행
document.addEventListener('mousemove', (e) => {
    if (!isDragging) return; // 드래그 상태 아니면 무시

    const dx = e.clientX - startX1; // 움직인 거리
    const speedFactor = 0.5; // 1.0 기본, >1 빠름, <1: 느림
    const containerWidth = eatMenu.parentElement.offsetWidth;
    const maxTranslate = eatMenu.scrollWidth - containerWidth;
    let newTranslate = scrollStart - dx * speedFactor; // 새 위치 계산 (오른쪽 드래그 시 음수)

    // 메뉴 이동 제한 (좌우 끝 벗어나지 않도록)
    newTranslate = Math.max(0, Math.min(newTranslate, maxTranslate));

    // 메뉴 위치 이동
    eatMenu.style.transform = `translateX(-${newTranslate}px)`;

    // 슬라이더 위치 동기화
    currentValue = (newTranslate / maxTranslate) * parseFloat(slider.max);
    slider.value = currentValue;
});

// ✅ 마우스 버튼을 뗐을 때: 드래그 종료
document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        eatMenu.style.cursor = 'grab'; // 커서 되돌리기
    }
});

// ✅ 기본 커서 스타일 설정
eatMenu.style.cursor = 'grab';

// ✅ 현재 transform 속성에서 translateX(px) 값만 숫자로 추출
function parseTransformX(transform) {
    const match = /translateX\(-?([\d.]+)px\)/.exec(transform);
    return match ? parseFloat(match[1]) : 0;
}



// section4 Click 이벤트


// section5 리뷰 드래그 이벤트
const slider5 = document.getElementById("slider");
let isDown5 = false;
let startX5;
let scrollLeft5;

slider5.addEventListener("mousedown", (e) => {
  isDown5 = true;
  slider5.classList.add("active");
  startX5 = e.pageX - slider5.offsetLeft;
  scrollLeft5 = slider5.scrollLeft;
});

slider5.addEventListener("mouseleave", () => {
  isDown5 = false;
});

slider5.addEventListener("mouseup", () => {
  isDown5 = false;
});

slider5.addEventListener("mousemove", (e) => {
  if (!isDown5) return;
  e.preventDefault();
  const x = e.pageX - slider5.offsetLeft;
  const walk = (x - startX5) * 2;
  slider5.scrollLeft = scrollLeft5 - walk;
  checkVisibleItems();
});

function checkVisibleItems() {
  const containerLeft = slider5.scrollLeft;
  const containerRight = containerLeft + slider5.offsetWidth;

  document.querySelectorAll(".review li").forEach((item) => {
    const itemLeft = item.offsetLeft;
    const itemRight = itemLeft + item.offsetWidth;

    if (
      itemRight > containerLeft &&
      itemLeft < containerRight &&
      (item.classList.contains("animalReview6") ||
       item.classList.contains("animalReview7") ||
       item.classList.contains("animalReview8"))
    ) {
      item.style.display = "block";
    } else if (
      item.classList.contains("animalReview6") ||
      item.classList.contains("animalReview7") ||
      item.classList.contains("animalReview8")
    ) {
      item.style.display = "none";
    } else {
      item.style.display = "block";
    }
  });
}

window.addEventListener("load", checkVisibleItems);

// 새로고침시 최상단으로 이동
window.addEventListener('load', function () {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
});

// 메뉴 클릭시 section 이동
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}