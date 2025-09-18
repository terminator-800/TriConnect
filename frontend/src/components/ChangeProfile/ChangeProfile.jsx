import { useRef } from "react";
import { useChangeProfile } from "../../../hooks/useChangeProfile";
import { imageUrlToBase64 } from "../../../utils/imageToBase64";
import { useProfileEditor } from "./useProfileEditor";
import { ProfileCropperModal } from "./ProfileCropperModal";
import { ProfileImage } from "./ProfileImage";

const ChangeProfile = ({ profileData }) => {
    const role = profileData?.role;
    const fileInputRef = useRef(null);
    const { mutate: changeProfile, isLoading } = useChangeProfile(role);

    const {
        isModalOpen,
        imageSrc,
        crop,
        zoom,
        setCrop,
        setZoom,
        onCropComplete,
        openEditor,
        closeEditor,
        uploadCroppedImage
    } = useProfileEditor();

    const openProfileEditor = async () => {
        if (!profileData?.profile) return;
        try {
            const base64 = await imageUrlToBase64(profileData.profile);
            openEditor(base64, false);
        } catch (err) {
            console.error(err);
            alert("Failed to load image for editing.");
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) return alert("Only image files are allowed.");
        const reader = new FileReader();
        reader.onload = () => openEditor(reader.result, true);
        reader.readAsDataURL(file);
    };

    return (
        <>
            <ProfileImage
                profileData={profileData}
                fileInputRef={fileInputRef}
                onClick={openProfileEditor}
                onFileChange={handleFileSelect}
                isLoading={isLoading}
            />

            <ProfileCropperModal
                isOpen={isModalOpen}
                imageSrc={imageSrc}
                crop={crop}
                zoom={zoom}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                onCancel={closeEditor}
                onSave={() => uploadCroppedImage(changeProfile)}
            />
        </>
    );
};

export default ChangeProfile;
