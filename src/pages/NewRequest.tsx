
import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/shared/PageHeader";
import RequestForm from "../components/requests/RequestForm";
import { Card, CardContent } from "../components/ui/card";
import { FileText, Plus, Clock, CheckCircle } from "lucide-react";

const NewRequest = () => {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Enhanced Page Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/40 rounded-3xl transform -rotate-1"></div>
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-gray-200/60 shadow-lg p-8">
            <PageHeader
              title="New Document Request"
              description="Submit your document request with ease. Fill out the form below and track your progress in real-time."
              action={{
                label: "View My Requests",
                icon: <FileText className="h-4 w-4" />,
                onClick: () => window.location.href = "/dashboard/my-requests",
              }}
            />
          </div>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/60 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Submit Request</h3>
              <p className="text-sm text-gray-600">Fill out the form with required details</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100/60 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Processing</h3>
              <p className="text-sm text-gray-600">Your request will be reviewed</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100/60 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Complete</h3>
              <p className="text-sm text-gray-600">Ready for collection or download</p>
            </div>
          </div>
        </div>

        {/* Enhanced Request Form Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 rounded-3xl transform rotate-1"></div>
          <Card className="relative bg-white/95 backdrop-blur-xl border-0 shadow-xl rounded-3xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            <CardContent className="p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  Document Request Form
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Please provide accurate information to ensure smooth processing of your request. 
                  All fields marked with an asterisk (*) are required.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50/80 to-blue-50/40 rounded-2xl p-8 border border-gray-200/50">
                <RequestForm />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100/60 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">?</span>
            </div>
            Need Help?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Processing Times</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Certificates: 3-5 business days</li>
                <li>• Transcripts: 5-7 business days</li>
                <li>• Letters: 1-3 business days</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Email: registrar@pinhs.edu.ph</li>
                <li>• Phone: (02) 123-4567</li>
                <li>• Office Hours: 8:00 AM - 5:00 PM</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewRequest;
