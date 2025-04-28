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
}

// catProfile 보여주기 (부드럽게)
function showCatProfile() {
  const cat = document.getElementById("catProfile");
  cat.classList.add("show");
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
//  section2 슬라이더
  const slider = document.getElementById('ratingSlider');
  const items = document.querySelectorAll('.eatMenu li');

  slider.addEventListener('input', function () {
    const selectedRating = parseFloat(this.value);

    items.forEach(item => {
      const rating = parseFloat(item.querySelector('.rating').innerText);
      if (rating >= selectedRating) {
        item.style.display = 'flex'; // 또는 block, 원하는 layout에 따라 조절
      } else {
        item.style.display = 'none';
      }
    });
  });

