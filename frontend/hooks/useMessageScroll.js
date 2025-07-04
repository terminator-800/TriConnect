import { useEffect } from 'react';

export const useMessageScroll = ({ ref, messagesLength, selectedConversationId, setVisibleCount }) => {
  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop < 50) {
        setVisibleCount(prev => prev + 10);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [selectedConversationId]);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.scrollTop = ref.current.scrollHeight;
  }, [messagesLength]);

  useEffect(() => {
    setVisibleCount(10);
  }, [selectedConversationId]);
};
