
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
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8", className)}>
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-gradient leading-tight">{title}</h1>
        {description && (
          <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">{description}</p>
        )}
      </div>
      
      {action && (
        <div className="flex-shrink-0">
          <Button 
            onClick={action.onClick}
            className="btn-gradient h-12 px-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PageHeader;
