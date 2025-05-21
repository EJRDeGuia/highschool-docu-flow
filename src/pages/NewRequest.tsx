
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/shared/PageHeader";
import RequestForm from "../components/requests/RequestForm";
import { Card } from "../components/ui/card";

const NewRequest = () => {
  return (
    <DashboardLayout>
      <PageHeader
        title="New Document Request"
        description="Fill out the form below to submit a new document request"
      />
      
      <Card className="dashboard-card border-0 p-6">
        <RequestForm />
      </Card>
    </DashboardLayout>
  );
};

export default NewRequest;
