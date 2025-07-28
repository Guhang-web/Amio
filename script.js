if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
// ✅ 전역 상태 관리 변수들
let currentSectionIndex = 0;
let profileStage = 0; // 0: 아무것도 없음, 1: dogProfile, 2: catProfile

// ✅ 요소들 참조
const dogThumbnail = document.getElementById("dogThumbnail");
const catThumbnail = document.getElementById("catThumbnail");
const dogProfile = document.getElementById("dogProfile");
const catProfile = document.getElementById("catProfile");
const dogFinal = document.getElementById("dogFinalPosition");
const catFinal = document.getElementById("catFinalPosition");

// ✅ 복제된 이미지 참조용
let dogClone = null;
let catClone = null;

// ✅ 새로고침 시 section1로 강제 이동
window.addEventListener("load", () => {
  document.getElementById("section1").scrollIntoView({ behavior: "auto" });
});

// ✅ 프로필 등장 애니메이션
function animateToProfile(img, targetEl, profile, isDog) {
  if (!img || !targetEl || !profile) return;

  profile.style.opacity = "1";
  profile.style.visibility = "visible";
  profile.style.zIndex = "20";
  document.body.classList.add("profile-active");

  const clone = img.cloneNode(true);
  const start = img.getBoundingClientRect();
  const end = targetEl.getBoundingClientRect();

  Object.assign(clone.style, {
    position: "fixed",
    left: `${start.left}px`,
    top: `${start.top}px`,
    width: `${start.width}px`,
    height: `${start.height}px`,
    transition: "all 0.8s ease",
    zIndex: 9999,
    pointerEvents: "none"
  });

  document.body.appendChild(clone);
  img.style.opacity = "0";
  img.style.pointerEvents = "auto";

  requestAnimationFrame(() => {
    clone.style.left = `${end.left}px`;
    clone.style.top = `${end.top}px`;
    clone.style.width = `${end.width}px`;
    clone.style.height = `${end.height}px`;
  });

  if (isDog) dogClone = clone;
  else catClone = clone;
}

// ✅ 프로필 복귀 애니메이션
function restoreProfile(img, profile, clone, isDog) {
  if (!img || !profile || !clone) return;

  const start = img.getBoundingClientRect();
  Object.assign(clone.style, {
    left: `${start.left}px`,
    top: `${start.top}px`,
    width: `${start.width}px`,
    height: `${start.height}px`
  });

  profile.style.opacity = "0";
  profile.style.visibility = "hidden";
  profile.style.zIndex = "-1";
  document.body.classList.remove("profile-active");

  setTimeout(() => {
    clone.remove();
    img.style.opacity = "1";
    img.style.pointerEvents = "auto";
    if (isDog) dogClone = null;
    else catClone = null;
  }, 800);
}

// ✅ 섹션 리스트
const sectionList = [
  "section1",
  "section2",
  "section3",
  "section4",
  "section5",
  "section6",
  "footer"
];

let isScrolling = false;

// ✅ 휠 이벤트 처리
window.addEventListener("wheel", (e) => {
  const currentSection = sectionList[currentSectionIndex];
  const visibleSection = document.getElementById(currentSection);
  if (currentSection !== 'footer' && (!visibleSection || !visibleSection.contains(document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)))) return;

  e.preventDefault();
  if (isScrolling) return;
  isScrolling = true;

  const isDown = e.deltaY > 0;

  if (isDown) {
    if (currentSectionIndex === 0 && profileStage === 0) {
      animateToProfile(dogThumbnail, dogFinal, dogProfile, true);
      profileStage = 1;
      isScrolling = false;
    } else if (currentSectionIndex === 0 && profileStage === 1) {
      restoreProfile(dogThumbnail, dogProfile, dogClone, true);
      setTimeout(() => {
        animateToProfile(catThumbnail, catFinal, catProfile, false);
        profileStage = 2;
        isScrolling = false;
      }, 850);
    } else if (currentSectionIndex === 0 && profileStage === 2) {
      restoreProfile(catThumbnail, catProfile, catClone, false);
      profileStage = 0;
      setTimeout(() => {
        currentSectionIndex++;
        document.getElementById(sectionList[currentSectionIndex]).scrollIntoView({ behavior: "smooth" });
        isScrolling = false;
      }, 850);
    } else if (currentSectionIndex < sectionList.length - 1) {
      currentSectionIndex++;
      document.getElementById(sectionList[currentSectionIndex]).scrollIntoView({ behavior: "smooth" });
      setTimeout(() => { isScrolling = false; }, 1000);
    } else {
      isScrolling = false;
    }
  } else {
    if (currentSectionIndex === 0 && profileStage === 2) {
      restoreProfile(catThumbnail, catProfile, catClone, false);
      profileStage = 1;
      isScrolling = false;
    } else if (currentSectionIndex === 0 && profileStage === 1) {
      restoreProfile(dogThumbnail, dogProfile, dogClone, true);
      profileStage = 0;
      isScrolling = false;
    } else if (currentSectionIndex > 0) {
      currentSectionIndex--;
      document.getElementById(sectionList[currentSectionIndex]).scrollIntoView({ behavior: "smooth" });
      setTimeout(() => { isScrolling = false; }, 1000);
    } else {
      isScrolling = false;
    }
  }
}, { passive: false });

// ✅ 썸네일 클릭 이벤트

dogThumbnail.addEventListener("click", () => {
  if (profileStage === 2) {
    restoreProfile(catThumbnail, catProfile, catClone, false);
    profileStage = 0;
    setTimeout(() => {
      animateToProfile(dogThumbnail, dogFinal, dogProfile, true);
      profileStage = 1;
    }, 850);
  } else if (profileStage === 1) {
    restoreProfile(dogThumbnail, dogProfile, dogClone, true);
    profileStage = 0;
  } else if (profileStage === 0) {
    animateToProfile(dogThumbnail, dogFinal, dogProfile, true);
    profileStage = 1;
  }
});

catThumbnail.addEventListener("click", () => {
  if (profileStage === 1) {
    restoreProfile(dogThumbnail, dogProfile, dogClone, true);
    profileStage = 0;
    setTimeout(() => {
      animateToProfile(catThumbnail, catFinal, catProfile, false);
      profileStage = 2;
    }, 850);
  } else if (profileStage === 2) {
    restoreProfile(catThumbnail, catProfile, catClone, false);
    profileStage = 0;
  } else if (profileStage === 0) {
    animateToProfile(catThumbnail, catFinal, catProfile, false);
    profileStage = 2;
  }
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
const slider = document.getElementById('rationgSlider2');
const eatMenu = document.querySelector('.eatMenu1');

let isDragging = false;
let startX1 = 0;
let scrollStart = 0;
let currentValue = parseFloat(slider.value);
let animationFrame = null;

// 슬라이더 변경 시
slider.addEventListener('input', () => {
  currentValue = parseFloat(slider.value);
  updateTranslate(currentValue);
});

// 드래그 시작
eatMenu.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX1 = e.clientX;
  scrollStart = getTranslateX();
  eatMenu.style.cursor = 'grabbing';
});

// 드래그 종료
document.addEventListener('mouseup', () => {
  isDragging = false;
  eatMenu.style.cursor = 'grab';
});

// 드래그 중
document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  // requestAnimationFrame으로 최적화
  if (!animationFrame) {
    animationFrame = requestAnimationFrame(() => {
      const dx = e.clientX - startX1;
      const maxTranslate = eatMenu.scrollWidth - eatMenu.parentElement.offsetWidth;
      let newTranslate = scrollStart - dx * 0.5;
      newTranslate = Math.max(0, Math.min(newTranslate, maxTranslate));

      eatMenu.style.transform = `translateX(-${newTranslate}px)`;

      // 슬라이더 동기화
      currentValue = (newTranslate / maxTranslate) * parseFloat(slider.max);
      slider.value = currentValue;

      animationFrame = null;
    });
  }
});

// 초기 커서
eatMenu.style.cursor = 'grab';

// 헬퍼 함수
function updateTranslate(value) {
  const maxTranslate = eatMenu.scrollWidth - eatMenu.parentElement.offsetWidth;
  const translateX = (value / parseFloat(slider.max)) * maxTranslate;
  eatMenu.style.transform = `translateX(-${translateX}px)`;
}

function getTranslateX() {
  const match = /translateX\(-?([\d.]+)px\)/.exec(eatMenu.style.transform);
  return match ? parseFloat(match[1]) : 0;
}



// section4 Click 이벤트
document.querySelectorAll('.food-btn') // => svg들만 선택됨

document.addEventListener('DOMContentLoaded', () => {
  const employeeImg = document.getElementById('employeeImage'); // 종업원 이미지
  const speechText = document.querySelector('.speech-text'); // 말풍선 텍스트
  const foodImgs = document.querySelectorAll('.foodList li img'); // 모든 음식 이미지
  const buttons = document.querySelectorAll('.food-btn'); // 모든 SVG 버튼

  let currentFood = null;

  // 음식별 설정 데이터
  const foodData = {
    chiken: {
      employee: 'section2Img/s2Main2.png',
      marginTop: '73.5px',
      food: 'section2Img/chiken.png',
      text: '바르게 기른 동물복지 생닭고기를<br>사용하고 반려동물 첨가물 원칙을<br>지켜 올바른 식단을 만듭니다.'
    },
    egg: {
      employee: 'section2Img/s2Main2.png',
      marginTop: '73.5px',
      food: 'section2Img/egg.png',
      text: '동물복지 농장에서 바르게 자란<br>닭들이 낳은 달걀을 사용해<br>자연담은 식단을 만듭니다.'
    },
    frult: {
      employee: 'section2Img/s2Main2.png',
      marginTop: '73.5px',
      food: 'section2Img/frult.png',
      text: '내과 전문 수의사가 바르게<br>키운 채소들을 사용해 레시피를<br>설계하여 건강담은 식단을 만듭니다.'
    },
    salmon: {
      employee: 'section2Img/s2Main2.png',
      marginTop: '73.5px',
      food: 'section2Img/salmon.png',
      text: '자연담은 힘찬 연어 노르웨이산<br>연어로 싱싱함이 더해 올바른<br>식단을 만드는데 주된 재료입니다.'
    },
    sort: {
      employee: 'section2Img/s2Main2.png',
      marginTop: '73.5px',
      food: 'section2Img/sort.png',
      text: '수의사가 제안하는 기능별<br>건강케어에 들어가는 차전지피<br>반려동물들의 변비를 치료합니다.'
    },
    turkey: {
      employee: 'section2Img/s2Main2.png',
      marginTop: '73.5px',
      food: 'section2Img/turkey.png',
      text: '바르게 기른 칠면조 고기를<br>사용하고 반려동물 첨가물<br>원칙을 지켜 식단을 만듭니다.'
    }
  };

  // 🍽 모든 음식 이미지 숨김
  function hideAllFoods() {
    foodImgs.forEach(img => {
      img.classList.remove('active');
    });
  }

  // 👉 SVG 버튼 클릭 이벤트
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const food = btn.dataset.food;

      // 이미 선택한 음식이면 → 리셋
      if (currentFood === food) {
        employeeImg.src = 'section2Img/s2Main.png'; // 기본 종업원 이미지
        employeeImg.style.marginTop = '100px';
        speechText.innerHTML = '안녕하세요.<br>여기는 반려동물을 위한<br>건강음식재료를 소개합니다!';
        hideAllFoods();
        currentFood = null;
        return;
      }

      // 새로 클릭된 음식일 경우
      const selected = foodData[food];
      if (!selected) return;

      employeeImg.src = selected.employee;
      employeeImg.style.marginTop = selected.marginTop;
      speechText.innerHTML = selected.text;

      hideAllFoods(); // 기존 음식 숨김

      const targetImg = document.querySelector(`.foodList .${food}`);
      if (targetImg) {
        targetImg.classList.add('active');
      }

      currentFood = food;
    });
  });
});
function showFoodImage(foodClass) {
  const allImages = document.querySelectorAll('.foodList img');

  allImages.forEach(img => {
    img.classList.remove('active');
  });

  const target = document.querySelector(`.foodList .${foodClass}`);
  if (target) {
    target.classList.add('active');
  }
}

// section5 리뷰 드래그 이벤트

// 메뉴 클릭시 section 이동
function scrollTosection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};
