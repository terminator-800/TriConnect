// utils/imageToBase64.js
export const imageUrlToBase64 = async (url) => {
  const response = await fetch(url, { mode: "cors" }); // CORS enabled
  const blob = await response.blob(); // get the image data as blob

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result); // result is Base64 string
    reader.onerror = reject;
    reader.readAsDataURL(blob); // convert blob to Base64
  });
};
