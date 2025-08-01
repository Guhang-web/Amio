// ✅ scroll 복원 방지
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// ✅ 전역 상태
let currentSectionIndex = 0;
let profileStage = 0;  // 0: 아무것도 없음, 1: dogProfile, 2: catProfile

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

// ✅ 요소 참조
const dogThumbnail = document.getElementById("dogThumbnail");
const catThumbnail = document.getElementById("catThumbnail");
const dogProfile = document.getElementById("dogProfile");
const catProfile = document.getElementById("catProfile");
const dogFinal = document.getElementById("dogFinalPosition");
const catFinal = document.getElementById("catFinalPosition");

// ✅ 새로고침 시 section1로 강제 이동
window.addEventListener("load", () => {
  document.getElementById("section1").scrollIntoView({ behavior: "smooth" });
  updateCurrentSectionIndex(); // 현재 섹션 인덱스 갱신
});

// ✅ 복제된 이미지 참조용
let dogClone = null;
let catClone = null;

// ✅ 프로필 애니메이션
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

// ✅ 휠 이벤트 처리 - 조건 만족할 때만 실행
if (document.getElementById("section1")) {
  window.addEventListener("load", () => {
    document.getElementById("section1").scrollIntoView({ behavior: "auto" });
  });

  window.addEventListener("wheel", (e) => {
     updateCurrentSectionIndex();
    const currentSection = sectionList[currentSectionIndex];
    const visibleSection = document.getElementById(currentSection);
    if (currentSection !== 'footer' &&
        (!visibleSection || !visibleSection.contains(document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)))) {
      return;
    }

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
}
// 휠 이벤트가 항상 정확히 그 지점부터 작동하게 해주는 보정 로직
function updateCurrentSectionIndex() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  for (let i = 0; i < sectionList.length; i++) {
    const section = document.getElementById(sectionList[i]);
    if (!section) continue;

    const rect = section.getBoundingClientRect();
    if (
      rect.top <= centerY &&
      rect.bottom >= centerY
    ) {
      currentSectionIndex = i;
      break;
    }
  }
}
