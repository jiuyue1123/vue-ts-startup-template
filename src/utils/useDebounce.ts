/**
 * 防抖函数
 * @param func 需要防抖的函数
 * @param wait 等待时间(毫秒)
 * @param immediate 是否立即执行
 * @returns 经过防抖处理的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false,
): (this: ThisParameterType<T>, ...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    // 如果已有定时器，清除它
    if (timeout) {
      clearTimeout(timeout);
    }

    // 立即执行的情况
    if (immediate) {
      // 如果没有定时器，说明可以立即执行
      const callNow = !timeout;

      // 使用箭头函数保留this上下文，避免创建别名
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);

      // 如果可以立即执行，调用原函数
      if (callNow) {
        func.apply(this, args);
      }
    } else {
      // 非立即执行的情况，使用箭头函数保留this上下文
      timeout = setTimeout(() => {
        func.apply(this, args);
        timeout = null;
      }, wait);
    }
  };
}

/* 使用示例
 * import { debounce } from '@/utils';
 * const handleInput = debounce((value: string) => {
 *  console.log(value);
 * }, 1000);
 */
