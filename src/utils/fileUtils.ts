export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () =>
      resolve(reader.result?.toString().replace(/^data:.+;base64,/, '') ?? '');
    reader.onerror = (error) => reject(error);
  });
}
