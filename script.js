
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
  const employeeImg = document.getElementById('s2Girl2'); // 종업원 이미지
  const speechText = document.querySelector('.speech-text'); // 말풍선 텍스트
  const foodImgs = document.querySelectorAll('.foodList li img'); // 모든 음식 이미지
  const buttons = document.querySelectorAll('.food-btn'); // 모든 SVG 버튼

  let currentFood = null;

  // 음식별 설정 데이터
  const foodData = {
    chiken: {
      employee: 'section2Img/s2Girl1.png',
      food: 'section2Img/chiken.png',
      text: '바르게 기른 동물복지 생닭고기를<br>사용하고 반려동물 첨가물 원칙을<br>지켜 올바른 식단을 만듭니다.'
    },
    egg: {
      employee: 'section2Img/s2Girl1.png',
      food: 'section2Img/egg.png',
      text: '동물복지 농장에서 바르게 자란<br>닭들이 낳은 달걀을 사용해<br>자연담은 식단을 만듭니다.'
    },
    frult: {
      employee: 'section2Img/s2Girl1.png',
      food: 'section2Img/frult.png',
      text: '내과 전문 수의사가 바르게<br>키운 채소들을 사용해 레시피를<br>설계하여 건강담은 식단을 만듭니다.'
    },
    salmon: {
      employee: 'section2Img/s2Girl1.png',
      food: 'section2Img/salmon.png',
      text: '자연담은 힘찬 연어 노르웨이산<br>연어로 싱싱함이 더해 올바른<br>식단을 만드는데 주된 재료입니다.'
    },
    sort: {
      employee: 'section2Img/s2Girl1.png',
      food: 'section2Img/sort.png',
      text: '수의사가 제안하는 기능별<br>건강케어에 들어가는 차전지피<br>반려동물들의 변비를 치료합니다.'
    },
    turkey: {
      employee: 'section2Img/s2Girl1.png',
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
        employeeImg.src = 'section2Img/s2Girl2.png'; // 기본 종업원 이미지
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
(() => {
  const slider = document.querySelector('#slider');
  if (!slider) return;

  // DOM 고정 순서 (1~8)
  const list = Array.from(slider.querySelectorAll('li'));
  const N = list.length;          // 8
  const VISIBLE = 5;              // 항상 5장만 보임
  const STEP_PX = 140, SNAP = 0.35;

  // 곡선 슬롯 클래스 (1~5만 사용)
  const SLOT_CLASSES = ['animalReview1','animalReview2','animalReview3','animalReview4','animalReview5'];

  // 현재 보이는 5장의 "첫 카드 인덱스"(0기준)
  // 0 → [1..5], 1 → [2..6], 2 → [3..7], 3 → [4..8]
  // 여기서 한 칸 더 앞으로 가면 "리셋"해 0으로 돌아가게 함.
  let start = 0;

  // 유틸
  function clearSlots(el) {
    // animalReview1~8 전부 제거
    for (let i = 1; i <= 8; i++) el.classList.remove(`animalReview${i}`);
    el.classList.remove('fade-in', 'fade-out');
  }

  // 현재 start 윈도우를 슬롯(곡선 자리)에 매핑
  function renderWindow() {
    // 다 숨기고 시작
    list.forEach(el => {
      clearSlots(el);
      el.style.display = 'none';
    });

    // 보이는 5장만 animalReview1~5 자리에 올려둠
    for (let i = 0; i < VISIBLE; i++) {
      const idx = start + i;         // 0..7 범위 내만 사용 (리셋 정책상 wrap 안 함)
      const el  = list[idx];
      el.style.display = '';          // 보이게
      el.classList.add(SLOT_CLASSES[i]); // 곡선 슬롯 배치
    }
  }

  // 경계 리셋: 현재 보이는 것들을 페이드아웃 → start 재설정 → 페이드인
  function resetTo(targetStart) {
    const currentlyVisible = list.filter(el =>
      SLOT_CLASSES.some(c => el.classList.contains(c))
    );
    currentlyVisible.forEach(el => el.classList.add('fade-out'));

    setTimeout(() => {
      start = targetStart;      // 0(처음 화면) 또는 3(마지막 화면)
      renderWindow();
      slider.getBoundingClientRect(); // reflow
      const nowVisible = list.filter(el =>
        SLOT_CLASSES.some(c => el.classList.contains(c))
      );
      nowVisible.forEach(el => {
        el.classList.add('fade-in');
        setTimeout(() => el.classList.remove('fade-in'), 240);
      });
    }, 120);
  }

  // 한 장씩 이동 (dir: +1=오른쪽/이전, -1=왼쪽/다음)
  function step(dir) {
    if (dir > 0) {
      // ➡️ 한 칸 앞으로: [1..5]→[2..6]→[3..7]→[4..8] 까지만
      if (start >= 3) {
        // [4..8] 에서 한 칸 더 → "처음 화면"으로 리셋
        resetTo(0);
        return;
      }
      start += 1;
      renderWindow();
    } else if (dir < 0) {
      // ⬅️ 한 칸 뒤로: [4..8]←[3..7]←[2..6]←[1..5]
      if (start <= 0) {
        // [1..5] 에서 한 칸 뒤로 → "마지막 화면(4..8)"으로 리셋
        resetTo(3);
        return;
      }
      start -= 1;
      renderWindow();
    }
  }

  // 드래그 스냅 (x축, 1장씩만 이동)
  let dragging = false, startX = 0, dx = 0;

  function onDown(e) {
    dragging = true;
    startX = (e.clientX ?? e.touches?.[0]?.clientX ?? 0);
    dx = 0;
    slider.style.cursor = 'grabbing';
  }
  function onMove(e) {
    if (!dragging) return;
    const x = (e.clientX ?? e.touches?.[0]?.clientX ?? 0);
    dx = x - startX;
  }
  function onUp() {
    if (!dragging) return;
    dragging = false;
    slider.style.cursor = 'grab';
    const p = dx / STEP_PX;
    if (p > SNAP) step(+1);     // 오른쪽으로 충분히 드래그 → 이전 카드 앞으로
    else if (p < -SNAP) step(-1); // 왼쪽으로 충분히 드래그 → 다음 카드 앞으로
    dx = 0;
  }

  // 초기 화면: [1..5]
  renderWindow();

  // 이벤트
  slider.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
  window.addEventListener('pointerleave', onUp);
})();





// 메뉴 클릭시 section 이동
function scrollTosection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};
