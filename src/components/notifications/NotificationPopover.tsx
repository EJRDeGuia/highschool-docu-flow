
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
          className="relative h-10 w-10 rounded-xl bg-white/80 hover:bg-white transition-all duration-200 border border-gray-200 shadow-sm group"
        >
          {unreadCount > 0 ? (
            <BellDot className="h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
          ) : (
            <Bell className="h-5 w-5 text-gray-600 group-hover:text-gray-700 transition-colors" />
          )}
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs font-bold min-w-6 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-2 border-white shadow-lg transition-all duration-200 scale-110"
              variant="destructive"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 bg-white/95 backdrop-blur-2xl border border-gray-200/70 shadow-2xl rounded-2xl" align="end">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h4 className="font-bold text-lg text-gray-900">Notifications</h4>
            <p className="text-sm text-gray-600 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-8 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-medium transition-colors"
              onClick={() => {
                markAllAsRead();
              }}
            >
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[420px]">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-100/80">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-5 cursor-pointer transition-all duration-200 hover:bg-gray-50/80 relative",
                    !notification.read ? 'bg-gradient-to-r from-blue-50/80 to-indigo-50/40 border-l-4 border-l-blue-500' : ''
                  )}
                  onClick={() => {
                    markAsRead(notification.id);
                    if (notification.action) {
                      setIsOpen(false);
                    }
                  }}
                >
                  <div className="flex gap-4">
                    <div 
                      className={cn(
                        "h-3 w-3 mt-1 rounded-full flex-shrink-0 transition-all duration-200 shadow-sm",
                        notification.read ? 'bg-gray-300' : 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-200'
                      )} 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 break-words leading-relaxed mb-2">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 break-words leading-relaxed mb-3">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 font-medium bg-gray-100/60 px-2 py-1 rounded-md inline-block">
                        {new Date(notification.timestamp).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                <Bell className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">All clear!</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                No notifications at the moment.<br />
                We'll notify you when something needs your attention.
              </p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}
