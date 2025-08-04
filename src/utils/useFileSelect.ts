// 文件选择

/**
 * 文件选择
 * @param options 选项
 * @returns 文件选择实例
 */
import { ref } from 'vue';

export function useFileSelect(
  options: {
    accept?: string;
    multiple?: boolean;
  } = {},
) {
  const files = ref<File[]>([]);
  const open = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = options.accept || '*';
    input.multiple = options.multiple || false;
    input.onchange = (e) => {
      const list = (e.target as HTMLInputElement).files;
      if (list) files.value = Array.from(list);
    };
    input.click();
  };
  return { files, open };
}

/**
 * 用法
 * const { files, open } = useFileSelect({ accept: 'image/*', multiple: true });
 */
