import { useRef, useState } from 'react';
import { useSendMessage } from '../../../../../hooks/CHAT';
import { ROLE } from '../../../../../utils/role';
import icons from '../../../../assets/svg/Icons';

const MessageInput = ({ selectedUser }) => {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [messageText, setMessageText] = useState('');

  const { mutate: sendMessage, isPending } = useSendMessage(ROLE.MANPOWER_PROVIDER);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    e.target.value = '';
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if (!selectedUser || (!messageText.trim() && selectedFiles.length === 0)) return;

    sendMessage(
      {
        receiver_id: selectedUser.sender_id,
        message_text: messageText,
        files: selectedFiles,
        conversation_id: selectedUser.conversation_id,
      },
      {
        onSuccess: () => {
          setMessageText('');
          setSelectedFiles([]);
        },
      }
    );
  };

  return (
    <div className="p-4 border-t border-gray-300 flex flex-col gap-2">
      {selectedFiles.length > 0 && (
        <div className="flex flex-col gap-1 px-2">
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
              <span className="truncate">{file.name}</span>
              <button
                onClick={() => handleRemoveFile(index)}
                className="ml-2 text-red-500 hover:text-red-700 font-bold cursor-pointer"
              >
                <img src={icons.close} alt="" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Upload pin */}
        <button
          type="button"
          disabled={!selectedUser}
          onClick={() => fileInputRef.current?.click()}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 disabled:opacity-50 cursor-pointer"
        >
          <img src={icons.pin} alt="Attach File" className="w-5 h-5" />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />

        {/* Message input */}
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          disabled={!selectedUser}
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none disabled:opacity-50 border-gray-300"
          placeholder="Type a message ...."
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!selectedUser || isPending}
          className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white text-xl disabled:opacity-50 cursor-pointer"
        >
          <img src={icons.send} alt="Send" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
