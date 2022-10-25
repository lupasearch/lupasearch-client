const RESULT_ROOT_ID = "lupa-search-results";
const CONTAINER_ROOT_ID = "lupa-search-container";

export const scrollToSearchResults = (timeout = 500): void => {
  if (timeout) {
    setTimeout(() => scrollTo(RESULT_ROOT_ID), timeout);
  } else {
    scrollTo(RESULT_ROOT_ID);
  }
};

export const scrollTo = (elementId: string): void => {
  const el = document.getElementById(elementId);
  if (!el) {
    return;
  }
  const serchContainer = document.getElementById(CONTAINER_ROOT_ID);
  const container = serchContainer ?? window;
  container.scrollTo({
    top: el.offsetTop,
    behavior: "smooth",
  });
};

export const disableBodyScroll = (): void => {
  const scrollY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
};

export const enableBodyScroll = (): void => {
  const scrollY = document.body.style.top;
  document.body.style.position = "";
  document.body.style.top = "";
  window.scrollTo(0, parseInt(scrollY || "0") * -1);
};
