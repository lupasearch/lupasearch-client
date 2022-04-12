export const debounce = (
  func: (...args: unknown[]) => unknown,
  timeout?: number
): (() => unknown) => {
  if (!timeout) {
    return (...args: unknown[]) => {
      func(args);
    };
  }
  let timer: number;
  return (...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(args);
    }, timeout);
  };
};
