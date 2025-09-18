import { useState, useCallback } from "react";
import { getCroppedImg } from "./getCropedImage";

export function useProfileEditor() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const openEditor = (src, editing = false) => {
        setImageSrc(src);
        setIsEditing(editing);
        setIsModalOpen(true);
    };

    const closeEditor = () => {
        setIsModalOpen(false);
        setImageSrc(null);
        setCroppedAreaPixels(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setIsEditing(false);
    };

    const uploadCroppedImage = async (changeProfile) => {
        if (!imageSrc || !croppedAreaPixels) return;
        const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
        changeProfile(croppedFile);
        closeEditor();
    };

    return {
        isModalOpen,
        imageSrc,
        crop,
        zoom,
        isEditing,
        setCrop,
        setZoom,
        onCropComplete,
        openEditor,
        closeEditor,
        uploadCroppedImage,
    };
}
