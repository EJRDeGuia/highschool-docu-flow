
import DashboardLayout from "../components/layout/DashboardLayout";
import ReceiptUpload from "../components/requests/ReceiptUpload";

const ReceiptUploadPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upload Payment Receipt</h1>
        <p className="text-gray-600">
          Upload a screenshot of your payment receipt to verify your payment
        </p>
      </div>
      
      <ReceiptUpload />
    </DashboardLayout>
  );
};

export default ReceiptUploadPage;
