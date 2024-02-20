export async function convertUrlToFile(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  const filename = url.substring(url.lastIndexOf("/") + 1);
  return new File([blob], filename, { type: blob.type });
}
