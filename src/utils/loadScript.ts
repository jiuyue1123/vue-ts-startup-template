// 加载脚本, 异步加载（慎用）

/**
 * 加载脚本
 * @param src 脚本地址
 * @returns 是否成功
 */
export function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/* 用法
 * await loadScript('https://cdn.xxx.com/vditor.js');
 */
