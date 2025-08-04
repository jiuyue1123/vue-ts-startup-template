// 下载文件/Blob

/**
 * 下载文件/Blob
 * @param blob Blob
 * @param filename 文件名
 */
export function downloadBlob(blob: Blob, filename = 'file') {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

/* 用法
 * await downloadBlob(
 *   new Blob(['This is a text string.', new ArrayBuffer(8)], { type: 'text/plain' }),
 *   'test.txt',
 * );
 */
