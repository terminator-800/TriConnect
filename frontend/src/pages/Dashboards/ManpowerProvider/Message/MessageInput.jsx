import { useRef } from 'react';

const MessageInput = ({ text, setText, file, setFile, onSend, isSending }) => {
    const fileInputRef = useRef(null);

    const handleRemoveFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col gap-2 mt-2">
            {/* File Preview with X Button */}
            {file && (
                <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                    <span className="text-sm text-gray-700 truncate max-w-xs">
                        {file.name}
                    </span>
                    <button
                        onClick={() => setFile(null)}
                        className="text-red-500 text-lg font-bold ml-2 hover:text-red-700 cursor-pointer"
                        title="Remove file"
                    >
                        ✖
                    </button>
                </div>
            )}

            {/* Message Input */}
            <div className="flex items-center gap-3">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow p-2 border border-gray-300 rounded"
                    disabled={isSending}
                />

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="fileInput"
                />

                <label htmlFor="fileInput" className="cursor-pointer text-blue-600" title="Attach file">
                    📎
                </label>

                <button
                    onClick={() => {
                        onSend();
                        handleRemoveFile();
                    }}
                    disabled={isSending}
                    className="bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700"
                    title="Send"
                >
                    ➤
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
