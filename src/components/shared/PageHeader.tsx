
import React from 'react';
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  }
  className?: string;
}

const PageHeader = ({ title, description, action, className }: PageHeaderProps) => {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8", className)}>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-violet-700 to-violet-900 bg-clip-text text-transparent">{title}</h1>
        {description && <p className="text-gray-600 max-w-2xl">{description}</p>}
      </div>
      
      {action && (
        <Button 
          onClick={action.onClick}
          className="shrink-0 bg-gradient-to-r from-violet-600 to-violet-800 hover:from-violet-700 hover:to-violet-900 text-white shadow-md transition-all duration-200"
        >
          {action.icon && <span className="mr-2">{action.icon}</span>}
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default PageHeader;
