
import { useState, useEffect } from "react";
import { Bell, BellDot } from "lucide-react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { NotificationsProvider, useNotifications } from "../../contexts/NotificationsContext";

export const NotificationPopover = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-12 w-12 rounded-xl bg-white hover:bg-gray-50 transition-colors border border-gray-200/70 shadow-sm"
        >
          {unreadCount > 0 ? (
            <BellDot className="h-6 w-6 text-blue-600" />
          ) : (
            <Bell className="h-6 w-6 text-gray-600" />
          )}
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs font-bold bg-red-500 hover:bg-red-600 text-white border-2 border-white"
              variant="destructive"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[420px] p-0 bg-white border border-gray-200/70 shadow-2xl rounded-xl" align="end">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="space-y-1">
            <h4 className="font-bold text-gray-900 text-lg">Notifications</h4>
            <p className="text-base text-gray-600">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm h-10 px-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-medium"
              onClick={() => {
                markAllAsRead();
              }}
            >
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-96">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 cursor-pointer transition-colors hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50/30 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => {
                    markAsRead(notification.id);
                    if (notification.action) {
                      setIsOpen(false);
                    }
                  }}
                >
                  <div className="flex gap-4">
                    <div 
                      className={`h-3 w-3 mt-2 rounded-full flex-shrink-0 ${
                        notification.read ? 'bg-gray-300' : 'bg-blue-500'
                      }`} 
                    />
                    <div className="flex-1 min-w-0 space-y-2">
                      <p className="text-base font-semibold text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <Bell className="h-16 w-16 mx-auto mb-6 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-3">All clear!</h3>
              <p className="text-base text-gray-500">
                No notifications at the moment.
              </p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
