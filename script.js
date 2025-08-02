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

// ✅ 큰 강아지 이미지 클릭 시 제자리 복귀
dogFinal.addEventListener("click", () => {
  if (profileStage === 1) {
    restoreProfile(dogThumbnail, dogProfile, dogClone, true);
    profileStage = 0;
  }
});

// ✅ 큰 고양이 이미지 클릭 시 제자리 복귀
catFinal.addEventListener("click", () => {
  if (profileStage === 2) {
    restoreProfile(catThumbnail, catProfile, catClone, false);
    profileStage = 0;
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
// CatEat 슬라이더 (드래그 + 슬라이더 동기화)
const slider = document.getElementById('rationgSlider2');
const eatMenu = document.querySelector('.eatMenu1');

let isDragging = false;
let startX1 = 0;
let scrollStart = 0;
let currentValue = parseFloat(slider.value);
let animationFrame = null;
let latestX = 0;
let maxTranslate = 0;

// 초기 커서
eatMenu.style.cursor = 'grab';

// 이미지 로딩 후 maxTranslate 계산
window.addEventListener('load', () => {
  maxTranslate = eatMenu.scrollWidth - eatMenu.parentElement.offsetWidth;
  updateTranslate(currentValue);
});

// 슬라이더 변경 시
slider.addEventListener('input', () => {
  currentValue = parseFloat(slider.value);
  updateTranslate(currentValue);
});

// 드래그 시작
eatMenu.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX1 = e.clientX;
  latestX = e.clientX;
  scrollStart = getTranslateX();
  eatMenu.style.cursor = 'grabbing';

  // 이미지 로딩 이후 다시 계산 (혹시나 DOM 변경된 경우 대비)
  maxTranslate = eatMenu.scrollWidth - eatMenu.parentElement.offsetWidth;
  document.body.style.userSelect = 'none';
});

// 드래그 중
document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  latestX = e.clientX;

  if (!animationFrame) {
    animationFrame = requestAnimationFrame(() => {
      const dx = latestX - startX1;
      let newTranslate = scrollStart - dx * 0.3; // 속도 완화
      newTranslate = Math.max(0, Math.min(newTranslate, maxTranslate));

      eatMenu.style.transform = `translateX(-${newTranslate}px)`;

      // 슬라이더 동기화
      currentValue = (newTranslate / maxTranslate) * parseFloat(slider.max);
      slider.value = currentValue.toFixed(2);

      animationFrame = null;
    });
  }
});

// 드래그 종료
document.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  eatMenu.style.cursor = 'grab';
  document.body.style.userSelect = '';
});

// 헬퍼 함수: 슬라이더 값으로 위치 갱신
function updateTranslate(value) {
  const translateX = (value / parseFloat(slider.max)) * maxTranslate;
  eatMenu.style.transform = `translateX(-${translateX}px)`;
}

// 헬퍼 함수: 현재 transform 값 추출
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
      employee: 'section2Img/s2Main3.png',
      marginTop: '-13px',
      food: 'section2Img/chiken.png',
      text: '바르게 기른 동물복지 생닭고기를<br>사용하고 반려동물 첨가물 원칙을<br>지켜 올바른 식단을 만듭니다.'
    },
    egg: {
      employee: 'section2Img/s2Main3.png',
      marginTop: '-12px',
      food: 'section2Img/egg.png',
      text: '동물복지 농장에서 바르게 자란<br>닭들이 낳은 달걀을 사용해<br>자연담은 식단을 만듭니다.'
    },
    frult: {
      employee: 'section2Img/s2Main3.png',
      marginTop: '-12px',
      food: 'section2Img/frult.png',
      text: '내과 전문 수의사가 바르게<br>키운 채소들을 사용해 레시피를<br>설계하여 건강담은 식단을 만듭니다.'
    },
    salmon: {
      employee: 'section2Img/s2Main3.png',
      marginTop: '-12px',
      food: 'section2Img/salmon.png',
      text: '자연담은 힘찬 연어 노르웨이산<br>연어로 싱싱함이 더해 올바른<br>식단을 만드는데 주된 재료입니다.'
    },
    sort: {
      employee: 'section2Img/s2Main3.png',
      marginTop: '-12px',
      food: 'section2Img/sort.png',
      text: '수의사가 제안하는 기능별<br>건강케어에 들어가는 차전지피<br>반려동물들의 변비를 치료합니다.'
    },
    turkey: {
      employee: 'section2Img/s2Main3.png',
      marginTop: '-12px',
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
        employeeImg.style.marginTop = '0px';
        speechText.innerHTML = '좌측에 식재료들을 눌러<br>식재료들의 정보를 확인해보세요!';
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
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('slider');
  const cards = Array.from(slider.querySelectorAll('li'));
  const visibleCount = 5;

  let currentStartIndex = 0;

  // 초기 렌더링
  updateVisibleCards();

  let isDragging = false;
  let startX = 0;

  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
  });

  document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    const deltaX = e.pageX - startX;

    if (deltaX < -50) {
      // 👉 오른쪽으로 이동
      if (currentStartIndex + visibleCount < cards.length) {
        currentStartIndex++;
        updateVisibleCards();
      }
    } else if (deltaX > 50) {
      // 👈 왼쪽으로 이동
      if (currentStartIndex > 0) {
        currentStartIndex--;
        updateVisibleCards();
      }
    }

    isDragging = false;
  });

  function updateVisibleCards() {
    cards.forEach((card, idx) => {
      // 모든 클래스 제거
      card.className = '';
      card.style.display = 'none';
    });

    for (let i = 0; i < visibleCount; i++) {
      const cardIndex = currentStartIndex + i;
      if (cardIndex >= cards.length) break;

      const card = cards[cardIndex];

      card.className = ''; // 잔여 클래스 초기화
      card.classList.add(`animalReview${i + 1}`);
      card.style.display = 'block';
    }
  }
});

// 메뉴 클릭시 section 이동
function scrollTosection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};
