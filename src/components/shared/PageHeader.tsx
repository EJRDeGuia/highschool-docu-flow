
import React from 'react';
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

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
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 mb-12", className)}>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight tracking-tight">{title}</h1>
        </div>
        {description && (
          <p className="text-gray-600 text-xl max-w-3xl leading-relaxed font-medium pl-16">{description}</p>
        )}
      </div>
      
      {action && (
        <div className="flex-shrink-0">
          <Button 
            onClick={action.onClick}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-14 px-8 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl border-0 hover:scale-105"
          >
            {action.icon && <span className="mr-3">{action.icon}</span>}
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PageHeader;
