import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Settings as SettingsIcon,
  Mail,
  Bell,
  User,
  Lock,
  Database,
  FileText,
  Save,
  School
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

const Settings = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // General Settings
  const [schoolName, setSchoolName] = useState("High School Name");
  const [schoolAddress, setSchoolAddress] = useState("123 School Street, City, Country");
  const [schoolEmail, setSchoolEmail] = useState("info@school.edu");
  const [schoolPhone, setSchoolPhone] = useState("123-456-7890");
  const [schoolLogo, setSchoolLogo] = useState("");
  
  // Document Settings
  const [documentPrefix, setDocumentPrefix] = useState("REQ");
  const [defaultDocumentFee, setDefaultDocumentFee] = useState("50");
  const [documentExpiration, setDocumentExpiration] = useState("30");
  
  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [adminAlerts, setAdminAlerts] = useState(true);
  
  // Email Template Settings
  const [emailRequestReceivedTemplate, setEmailRequestReceivedTemplate] = useState(
    "Dear {{student_name}},\n\nYour request for {{document_type}} has been received. Your request ID is {{request_id}}.\n\nThank you,\n{{school_name}}"
  );
  const [emailRequestApprovedTemplate, setEmailRequestApprovedTemplate] = useState(
    "Dear {{student_name}},\n\nYour request for {{document_type}} ({{request_id}}) has been approved. You can pick up your document at the registrar's office.\n\nThank you,\n{{school_name}}"
  );
  
  const handleSaveSettings = (tab: string) => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      
      toast({
        title: "Settings Saved",
        description: `${tab} settings have been saved successfully.`,
      });
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-gray-600">
          Configure the document request system settings
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="document">Documents</TabsTrigger>
          <TabsTrigger value="notification">Notifications</TabsTrigger>
          <TabsTrigger value="email">Email Templates</TabsTrigger>
          <TabsTrigger value="backup">Backup & Security</TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                School Information
              </CardTitle>
              <CardDescription>
                Configure your school details that appear on documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="school-name">School Name</Label>
                <Input
                  id="school-name"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="school-address">School Address</Label>
                <Textarea
                  id="school-address"
                  value={schoolAddress}
                  onChange={(e) => setSchoolAddress(e.target.value)}
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="school-email">Email Address</Label>
                  <Input
                    id="school-email"
                    type="email"
                    value={schoolEmail}
                    onChange={(e) => setSchoolEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="school-phone">Phone Number</Label>
                  <Input
                    id="school-phone"
                    value={schoolPhone}
                    onChange={(e) => setSchoolPhone(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="school-logo">School Logo</Label>
                <Input
                  id="school-logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    // Handle logo upload
                    if (e.target.files && e.target.files[0]) {
                      // In a real app, this would upload the file
                      setSchoolLogo(e.target.files[0].name);
                    }
                  }}
                />
                {schoolLogo && (
                  <p className="text-sm text-gray-500">Selected: {schoolLogo}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings("General")}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Document Settings */}
        <TabsContent value="document">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Settings
              </CardTitle>
              <CardDescription>
                Configure document request settings and fees
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="document-prefix">Request ID Prefix</Label>
                  <Input
                    id="document-prefix"
                    value={documentPrefix}
                    onChange={(e) => setDocumentPrefix(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Example: "{documentPrefix}-2023-001"
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="document-expiration">Document Expiration (Days)</Label>
                  <Input
                    id="document-expiration"
                    type="number"
                    min="0"
                    value={documentExpiration}
                    onChange={(e) => setDocumentExpiration(e.target.value)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-4">Document Fee Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-fee">Default Document Fee (₱)</Label>
                    <Input
                      id="default-fee"
                      type="number"
                      min="0"
                      value={defaultDocumentFee}
                      onChange={(e) => setDefaultDocumentFee(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Custom Document Fees</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="transcript-fee">Transcript of Records (₱)</Label>
                        <Input id="transcript-fee" type="number" defaultValue="100" />
                      </div>
                      <div>
                        <Label htmlFor="certificate-fee">Certificate of Enrollment (₱)</Label>
                        <Input id="certificate-fee" type="number" defaultValue="50" />
                      </div>
                      <div>
                        <Label htmlFor="diploma-fee">Diploma (₱)</Label>
                        <Input id="diploma-fee" type="number" defaultValue="200" />
                      </div>
                      <div>
                        <Label htmlFor="goodmoral-fee">Good Moral Character (₱)</Label>
                        <Input id="goodmoral-fee" type="number" defaultValue="50" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Document Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="show-transcript" className="cursor-pointer">
                      Transcript of Records
                    </Label>
                    <Switch id="show-transcript" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="show-certificate" className="cursor-pointer">
                      Certificate of Enrollment
                    </Label>
                    <Switch id="show-certificate" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="show-diploma" className="cursor-pointer">
                      Diploma
                    </Label>
                    <Switch id="show-diploma" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="show-goodmoral" className="cursor-pointer">
                      Good Moral Character
                    </Label>
                    <Switch id="show-goodmoral" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="show-dismissal" className="cursor-pointer">
                      Certificate of Honorable Dismissal
                    </Label>
                    <Switch id="show-dismissal" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings("Document")}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notification">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how notifications are sent to users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Notification Channels</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="email-notifications" className="cursor-pointer">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-gray-500">
                        Send notification emails to users
                      </p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="sms-notifications" className="cursor-pointer">
                        SMS Notifications
                      </Label>
                      <p className="text-sm text-gray-500">
                        Send SMS notifications to users (additional fees may apply)
                      </p>
                    </div>
                    <Switch 
                      id="sms-notifications" 
                      checked={smsNotifications}
                      onCheckedChange={setSmsNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="admin-alerts" className="cursor-pointer">
                        Admin Alerts
                      </Label>
                      <p className="text-sm text-gray-500">
                        Notify admins of new requests and system events
                      </p>
                    </div>
                    <Switch 
                      id="admin-alerts" 
                      checked={adminAlerts}
                      onCheckedChange={setAdminAlerts}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Notification Events</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="notify-request" className="cursor-pointer">
                      Request Submission
                    </Label>
                    <Switch id="notify-request" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="notify-payment" className="cursor-pointer">
                      Payment Received
                    </Label>
                    <Switch id="notify-payment" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="notify-status" className="cursor-pointer">
                      Status Changes
                    </Label>
                    <Switch id="notify-status" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="notify-ready" className="cursor-pointer">
                      Document Ready for Pickup
                    </Label>
                    <Switch id="notify-ready" defaultChecked />
                  </div>
                </div>
              </div>
              
              {emailNotifications && (
                <>
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Email Settings</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sender-email">Sender Email Address</Label>
                        <Input id="sender-email" type="email" defaultValue="noreply@school.edu" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="sender-name">Sender Name</Label>
                        <Input id="sender-name" defaultValue="School Document System" />
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {smsNotifications && (
                <>
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">SMS Settings</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sms-provider">SMS Provider</Label>
                        <Select defaultValue="none">
                          <SelectTrigger id="sms-provider">
                            <SelectValue placeholder="Select SMS provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="twilio">Twilio</SelectItem>
                            <SelectItem value="nexmo">Nexmo</SelectItem>
                            <SelectItem value="globe">Globe Labs</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="sms-api-key">API Key</Label>
                        <Input id="sms-api-key" type="password" placeholder="Enter API key" />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings("Notification")}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Email Templates */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Templates
              </CardTitle>
              <CardDescription>
                Customize email templates sent to students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="template-request-received">Request Received Template</Label>
                  <div className="text-xs text-gray-500">
                    Available variables: {"{{student_name}}"}, {"{{document_type}}"}, {"{{request_id}}"}, {"{{school_name}}"}
                  </div>
                </div>
                <Textarea
                  id="template-request-received"
                  rows={6}
                  value={emailRequestReceivedTemplate}
                  onChange={(e) => setEmailRequestReceivedTemplate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="template-request-approved">Request Approved Template</Label>
                  <div className="text-xs text-gray-500">
                    Available variables: {"{{student_name}}"}, {"{{document_type}}"}, {"{{request_id}}"}, {"{{school_name}}"}
                  </div>
                </div>
                <Textarea
                  id="template-request-approved"
                  rows={6}
                  value={emailRequestApprovedTemplate}
                  onChange={(e) => setEmailRequestApprovedTemplate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="template-document-ready">Document Ready Template</Label>
                  <div className="text-xs text-gray-500">
                    Available variables: {"{{student_name}}"}, {"{{document_type}}"}, {"{{request_id}}"}, {"{{school_name}}"}
                  </div>
                </div>
                <Textarea
                  id="template-document-ready"
                  rows={6}
                  defaultValue={`Dear {{student_name}},\n\nYour requested document ({{document_type}}, Request ID: {{request_id}}) is now ready for pickup at the registrar's office. Please bring a valid ID when collecting your document.\n\nThank you,\n{{school_name}}`}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="template-request-rejected">Request Rejected Template</Label>
                  <div className="text-xs text-gray-500">
                    Available variables: {"{{student_name}}"}, {"{{document_type}}"}, {"{{request_id}}"}, {"{{rejection_reason}}"}, {"{{school_name}}"}
                  </div>
                </div>
                <Textarea
                  id="template-request-rejected"
                  rows={6}
                  defaultValue={`Dear {{student_name}},\n\nWe regret to inform you that your request for {{document_type}} ({{request_id}}) has been rejected. \n\nReason: {{rejection_reason}}\n\nPlease contact the registrar's office for more information.\n\nThank you,\n{{school_name}}`}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings("Email Template")}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Templates
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Backup & Security */}
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Backup & Security Settings
              </CardTitle>
              <CardDescription>
                Configure database backup and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Automatic Database Backup</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="auto-backup" className="cursor-pointer">
                        Enable Automatic Backup
                      </Label>
                      <p className="text-sm text-gray-500">
                        Automatically backup the database on a schedule
                      </p>
                    </div>
                    <Switch id="auto-backup" defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency">Backup Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger id="backup-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backup-retention">Backup Retention (Days)</Label>
                    <Input id="backup-retention" type="number" defaultValue="30" />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="fail-login" className="cursor-pointer">
                        Failed Login Lockout
                      </Label>
                      <p className="text-sm text-gray-500">
                        Lock accounts after multiple failed login attempts
                      </p>
                    </div>
                    <Switch id="fail-login" defaultChecked />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fail-attempts">Failed Attempts Before Lockout</Label>
                      <Input id="fail-attempts" type="number" defaultValue="5" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lockout-duration">Lockout Duration (Minutes)</Label>
                      <Input id="lockout-duration" type="number" defaultValue="15" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="password-policy" className="cursor-pointer">
                        Strong Password Policy
                      </Label>
                      <p className="text-sm text-gray-500">
                        Require strong passwords with numbers and special characters
                      </p>
                    </div>
                    <Switch id="password-policy" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="session-timeout" className="cursor-pointer">
                        Session Timeout
                      </Label>
                      <p className="text-sm text-gray-500">
                        Automatically log out inactive users
                      </p>
                    </div>
                    <Switch id="session-timeout" defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeout-duration">Session Timeout (Minutes)</Label>
                    <Input id="timeout-duration" type="number" defaultValue="30" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSaveSettings("Backup & Security")}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;
