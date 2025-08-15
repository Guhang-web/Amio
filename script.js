
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
const sliderWrapper1 = document.querySelector('.slider-wrapper1');

let isDown1 = false;
let startX1;
let scrollLeft1;

sliderWrapper1.addEventListener('mousedown', (e1) => {
  isDown1 = true;
  sliderWrapper1.classList.add('active');
  startX1 = e1.pageX - sliderWrapper1.offsetLeft;
  scrollLeft1 = sliderWrapper1.scrollLeft;
});

sliderWrapper1.addEventListener('mouseleave', () => {
  isDown1 = false;
  sliderWrapper1.classList.remove('active');
});

sliderWrapper1.addEventListener('mouseup', () => {
  isDown1 = false;
  sliderWrapper1.classList.remove('active');
});

sliderWrapper1.addEventListener('mousemove', (e1) => {
  if (!isDown1) return;
  e1.preventDefault();
  const x1 = e1.pageX - sliderWrapper1.offsetLeft;
  const walk1 = (x1 - startX1) * 0.5; // 스크롤 속도 조절
  sliderWrapper1.scrollLeft = scrollLeft1 - walk1;
});

// section2 DogEat 슬라이더 (input)
const rangeSlider1 = document.getElementById('rationgSlider2');

rangeSlider1.addEventListener('input', () => {
  const maxScroll1 = sliderWrapper1.scrollWidth - sliderWrapper1.clientWidth;
  sliderWrapper1.scrollLeft = (rangeSlider1.value / 5) * maxScroll1;
});

sliderWrapper1.addEventListener('scroll', () => {
  const maxScroll1 = sliderWrapper1.scrollWidth - sliderWrapper1.clientWidth;
  rangeSlider1.value = (sliderWrapper1.scrollLeft / maxScroll1) * 5;
});


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
      marginTop: '1.5px',
      food: 'section2Img/chiken.png',
      text: '바르게 기른 동물복지 생닭고기를<br>사용하고 반려동물 첨가물 원칙을<br>지켜 올바른 식단을 만듭니다.'
    },
    egg: {
      employee: 'section2Img/s2Main3.png',
      marginTop: '1.5px',
      food: 'section2Img/egg.png',
      text: '동물복지 농장에서 바르게 자란<br>닭들이 낳은 달걀을 사용해<br>자연담은 식단을 만듭니다.'
    },
    frult: {
      employee: 'section2Img/s2Main3.png',
      marginTop: '1.5px',
      food: 'section2Img/frult.png',
      text: '내과 전문 수의사가 바르게<br>키운 채소들을 사용해 레시피를<br>설계하여 건강담은 식단을 만듭니다.'
    },
    salmon: {
      employee: 'section2Img/s2Main3.png',
      marginTop: '1.5px',
      food: 'section2Img/salmon.png',
      text: '자연담은 힘찬 연어 노르웨이산<br>연어로 싱싱함이 더해 올바른<br>식단을 만드는데 주된 재료입니다.'
    },
    sort: {
      employee: 'section2Img/s2Main3.png',
      marginTop: '1.5px',
      food: 'section2Img/sort.png',
      text: '수의사가 제안하는 기능별<br>건강케어에 들어가는 차전지피<br>반려동물들의 변비를 치료합니다.'
    },
    turkey: {
      employee: 'section2Img/s2Main3.png',
      marginTop: '1.5px',
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
        employeeImg.src = 'section2Img/s2Main1.png'; // 기본 종업원 이미지
        employeeImg.style.marginTop = '0px';
        speechText.innerHTML = '좌측에 식재료들을 눌러<br><br>식재료들의 정보를 확인해보세요!';
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
