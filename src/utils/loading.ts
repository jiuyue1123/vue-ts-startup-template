// 全屏加载

/**
 * 全屏加载
 * @returns 全屏加载实例
 */
export function useFullscreenLoading() {
  let instance: ReturnType<typeof ElLoading.service> | null = null;
  const show = (text = '加载中...') => {
    instance = ElLoading.service({ fullscreen: true, text });
  };
  const hide = () => instance?.close();
  return { show, hide };
}

/**
 * 用法
 * const { show, hide } = useFullscreenLoading();
 * show();
 * await fetchData();
 * hide();
 */
