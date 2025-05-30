
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/shared/PageHeader";
import RequestForm from "../components/requests/RequestForm";
import { Card, CardContent } from "../components/ui/card";
import { FileText, CheckCircle, Clock, Send, Sparkles } from "lucide-react";

const NewRequest = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-10">
        <PageHeader
          title="New Document Request"
          description="Fill out the form below to submit a new document request"
          action={{
            label: "View My Requests",
            icon: <FileText className="h-5 w-5" />,
            onClick: () => window.location.href = "/dashboard/my-requests",
          }}
        />
        
        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50 shadow-lg">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <Send className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">1. Submit</h3>
              <p className="text-sm text-gray-600 font-medium">Fill out the request form</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200/50 shadow-lg">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">2. Process</h3>
              <p className="text-sm text-gray-600 font-medium">We review your request</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200/50 shadow-lg">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">3. Complete</h3>
              <p className="text-sm text-gray-600 font-medium">Receive your document</p>
            </div>
          </div>
        </div>
        
        {/* Main Form Card */}
        <Card className="border-0 shadow-2xl overflow-hidden bg-white/95 backdrop-blur-xl rounded-3xl ring-1 ring-gray-200/50">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white mb-2">Document Request Form</h2>
                <p className="text-blue-100 text-base font-medium">Please fill out all required fields to process your request</p>
              </div>
            </div>
          </div>
          <CardContent className="p-10">
            <RequestForm />
          </CardContent>
        </Card>
        
        {/* Help Section */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-3xl p-8 border border-gray-200/50 shadow-lg">
          <h3 className="font-black text-xl text-gray-900 mb-4 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <FileText className="h-5 w-5 text-white" />
            </div>
            Need Help?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-base text-gray-800 mb-3">Required Documents</h4>
              <ul className="space-y-2 text-gray-600 font-medium">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Valid ID or Student ID
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Payment receipt (if applicable)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Previous academic records
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-base text-gray-800 mb-3">Processing Time</h4>
              <ul className="space-y-2 text-gray-600 font-medium">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Transcript: 3-5 business days
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Diploma: 7-10 business days
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Certificate: 2-3 business days
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewRequest;
