
import DashboardLayout from "../components/layout/DashboardLayout";
import RequestForm from "../components/requests/RequestForm";

const NewRequest = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">New Document Request</h1>
        <p className="text-gray-600">
          Fill out the form below to submit a new document request
        </p>
      </div>
      
      <RequestForm />
    </DashboardLayout>
  );
};

export default NewRequest;
