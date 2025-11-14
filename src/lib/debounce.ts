export function debounce<T extends (...args: any[]) => void>(fn: T, delay = 150) {
  let timer: number | undefined;

  function debounced(this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timer) {
      window.clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      fn.apply(this, args);
      timer = undefined;
    }, delay);
  }

  debounced.cancel = () => {
    if (timer) {
      window.clearTimeout(timer);
      timer = undefined;
    }
  };

  return debounced as T & { cancel: () => void };
}
