// 复制文本

/**
 * 复制文本
 * @param text 文本
 * @returns 是否成功
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'absolute';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  }
}

/* 用法
 * import { copyText } from '@/utils/copy';
 * const onCopy = async () => {
 *  await copyText('Hello') && ElMessage.success('已复制');
 * };
 */
