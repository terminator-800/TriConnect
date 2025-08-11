import { useGlobalNotifications } from '../../hooks/useGlobalNotifications';
import { useUserProfile } from '../../hooks/useUserProfiles';
import { ROLE } from '../../utils/role';

const UnreadMessageIndicator = ({ role }) => {
  const { data: profileData } = useUserProfile(role);
  const userId = profileData?.user_id;
  
  const { totalUnreadCount } = useGlobalNotifications(userId, role);

  if (totalUnreadCount === 0) return null;

  return (
    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
      {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
    </div>
  );
};

export default UnreadMessageIndicator;
