
import React from 'react';
import { Button } from "../ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  }
}

const PageHeader = ({ title, description, action }: PageHeaderProps) => {
  return (
    <div className="dashboard-header">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-gray-800">{title}</h1>
        {description && <p className="text-gray-600">{description}</p>}
      </div>
      
      {action && (
        <Button onClick={action.onClick}>
          {action.icon && <span className="mr-2">{action.icon}</span>}
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default PageHeader;
