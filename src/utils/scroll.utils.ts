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
