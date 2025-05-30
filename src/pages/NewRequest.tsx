
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/shared/PageHeader";
import RequestForm from "../components/requests/RequestForm";
import { Card, CardContent } from "../components/ui/card";
import { FileText } from "lucide-react";

const NewRequest = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="New Document Request"
          description="Fill out the form below to submit a new document request"
          action={{
            label: "View My Requests",
            icon: <FileText className="h-4 w-4" />,
            onClick: () => window.location.href = "/dashboard/my-requests",
          }}
        />
        
        <Card className="dashboard-card border-0 shadow-md overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <RequestForm />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewRequest;
