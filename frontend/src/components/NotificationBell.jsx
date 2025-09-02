import { useGlobalNotifications } from '../../hooks/useGlobalNotifications';
import { useState, useEffect } from 'react';
import { useUserProfile } from '../../hooks/useUserProfiles';
import icons from '../assets/svg/Icons';

const NotificationBell = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: profileData } = useUserProfile(role);
  const userId = profileData?.user_id;
  
  const {
    notifications,
    unreadCounts,
    totalUnreadCount,
    markNotificationAsRead,
    clearUnreadCount
  } = useGlobalNotifications(userId, role);

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleNotificationClick = (notification) => {
    markNotificationAsRead(notification.id);
    // Navigate to the conversation
    window.location.href = `/${role}/message?conversation=${notification.message.conversation_id}`;
    setIsOpen(false);
  };

  const handleClearAll = () => {
    notifications.forEach(notif => {
      if (!notif.read) {
        markNotificationAsRead(notif.id);
      }
    });
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <img src={icons.notification_bell} alt="Notification Icon" className="w-6 h-6 mr-2" />
        {/* Unread Count Badge */}
        {totalUnreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {notification.message.sender_name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.message.sender_name || 'Unknown User'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message.message_text || 'Sent you a message'}
                      </p>
                      
                      {!notification.read && (
                        <div className="mt-2">
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-sm text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
