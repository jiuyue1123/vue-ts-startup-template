// 将文件转换为base64

/**
 * 将文件转换为base64
 * @param file 文件
 * @returns base64字符串
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* 用法
 * const onUpload = async (e: Event) => {
 *  const file = (e.target as HTMLInputElement).files![0];
 *  const base64 = await fileToBase64(file);
 *  console.log(base64);
 *};
 */
