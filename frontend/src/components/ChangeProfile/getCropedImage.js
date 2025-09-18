export const getCroppedImg = (imageSrc, pixelCrop, saveOriginal = false) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    return new Promise((resolve) => {
        const image = new Image();
        image.src = imageSrc;
        image.crossOrigin = "anonymous";
        image.onload = () => {
            if (saveOriginal) {
                // Save original image size
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
            } else {
                // Draw cropped rectangle
                canvas.width = pixelCrop.width;
                canvas.height = pixelCrop.height;
                ctx.drawImage(
                    image,
                    pixelCrop.x,
                    pixelCrop.y,
                    pixelCrop.width,
                    pixelCrop.height,
                    0,
                    0,
                    pixelCrop.width,
                    pixelCrop.height
                );
            }

            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], "profile.png", { type: "image/png" });
                    resolve(file);
                }
            }, "image/png");
        };
    });
};
