const RESULT_ROOT_ID = "lupa-search-results";

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
  window.scrollTo({
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
