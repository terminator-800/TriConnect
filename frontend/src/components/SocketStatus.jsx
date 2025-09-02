import { useEffect, useState } from 'react';
import socket from '../../utils/socket';

const SocketStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      setConnectionStatus('Connected');
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setConnectionStatus('Disconnected');
    };

    const onConnectError = (error) => {
      setIsConnected(false);
      setConnectionStatus('Connection Error');
    };

    // Set up event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    // Check initial connection status
    setIsConnected(socket.connected);
    setConnectionStatus(socket.connected ? 'Connected' : 'Disconnected');

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white p-2 rounded-lg shadow-lg border text-xs">
      <div className="flex items-center gap-2">
        <div 
          className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`} 
        />
        <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
          Socket: {connectionStatus}
        </span>
      </div>
    </div>
  );
};

export default SocketStatus;
