
import { useState, useEffect } from "react";
import { Bell, BellDot, Sparkles } from "lucide-react";
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
          className="relative h-12 w-12 rounded-2xl bg-white/90 hover:bg-white transition-all duration-300 border border-gray-200/70 shadow-lg hover:shadow-xl group backdrop-blur-xl"
        >
          {unreadCount > 0 ? (
            <BellDot className="h-6 w-6 text-blue-600 group-hover:text-blue-700 transition-colors group-hover:scale-110 duration-300" />
          ) : (
            <Bell className="h-6 w-6 text-gray-600 group-hover:text-gray-700 transition-colors group-hover:scale-110 duration-300" />
          )}
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-7 w-7 flex items-center justify-center p-0 text-sm font-bold min-w-7 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-3 border-white shadow-xl transition-all duration-300 scale-110 animate-pulse"
              variant="destructive"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[420px] p-0 bg-white/95 backdrop-blur-3xl border border-gray-200/70 shadow-2xl rounded-3xl mt-2" align="end">
        <div className="flex items-center justify-between p-8 border-b border-gray-200/60">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <h4 className="font-black text-xl text-gray-900">Notifications</h4>
            </div>
            <p className="text-base text-gray-600 font-medium">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm h-10 px-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl font-bold transition-all duration-300 hover:scale-105"
              onClick={() => {
                markAllAsRead();
              }}
            >
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[450px]">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-100/60">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-6 cursor-pointer transition-all duration-300 hover:bg-gray-50/80 relative group",
                    !notification.read ? 'bg-gradient-to-r from-blue-50/80 via-blue-50/60 to-indigo-50/40 border-l-4 border-l-blue-500' : ''
                  )}
                  onClick={() => {
                    markAsRead(notification.id);
                    if (notification.action) {
                      setIsOpen(false);
                    }
                  }}
                >
                  <div className="flex gap-5">
                    <div 
                      className={cn(
                        "h-4 w-4 mt-1 rounded-full flex-shrink-0 transition-all duration-300 shadow-lg",
                        notification.read ? 'bg-gray-300' : 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-200 animate-pulse'
                      )} 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-gray-900 break-words leading-relaxed mb-3">
                        {notification.title}
                      </p>
                      <p className="text-base text-gray-600 break-words leading-relaxed mb-4">
                        {notification.message}
                      </p>
                      <p className="text-sm text-gray-500 font-semibold bg-gray-100/80 px-3 py-2 rounded-xl inline-block">
                        {new Date(notification.timestamp).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center text-gray-500">
              <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-xl">
                <Bell className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-3">All clear!</h3>
              <p className="text-base text-gray-500 leading-relaxed max-w-sm mx-auto">
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
