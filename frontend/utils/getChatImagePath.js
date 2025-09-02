const getChatImagePath = (msg) => {
  if (!msg || !msg.file_url) return null;

  if (msg.file_url.startsWith('/uploads/chat/')) {
    return `${import.meta.env.VITE_API_URL}${msg.file_url}`;
  }

  return null;
};


export default getChatImagePath;
