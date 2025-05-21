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
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define the backup history item type to ensure type safety
type BackupHistoryItemType = {
  id: string;
  date: string;
  size: string;
  status: 'success' | 'failed' | 'pending';
  type: 'backup' | 'restore';
};

const BackupHistoryItem = ({
  date,
  size,
  status,
  type,
}: {
  date: string;
  size: string;
  status: 'success' | 'failed' | 'pending';
  type: 'backup' | 'restore';
}) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
      <div className="flex items-center space-x-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center
          ${status === 'success' ? 'bg-green-100 text-green-600' : ''}
          ${status === 'failed' ? 'bg-red-100 text-red-600' : ''}
          ${status === 'pending' ? 'bg-amber-100 text-amber-600' : ''}
        `}>
          {type === 'backup' ? <Download className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
        </div>
        <div>
          <p className="font-medium">{type === 'backup' ? 'Database Backup' : 'Database Restore'}</p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>{date}</span>
            <span>•</span>
            <span>{size}</span>
          </div>
        </div>
      </div>
      <Badge
        variant="outline"
        className={`
          ${status === 'success' ? 'status-approved' : ''}
          ${status === 'failed' ? 'status-rejected' : ''}
          ${status === 'pending' ? 'status-pending' : ''}
        `}
      >
        {status === 'success' && 'Success'}
        {status === 'failed' && 'Failed'}
        {status === 'pending' && 'Pending'}
      </Badge>
    </div>
  );
};

const Backup = () => {
  const { toast } = useToast();
  const [isBackupInProgress, setIsBackupInProgress] = useState(false);
  const [isRestoreInProgress, setIsRestoreInProgress] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [backupHistory, setBackupHistory] = useState<BackupHistoryItemType[]>([
    {
      id: '1',
      date: '2023-05-20 10:15 AM',
      size: '2.3 MB',
      status: 'success',
      type: 'backup',
    },
    {
      id: '2',
      date: '2023-05-15 09:30 AM',
      size: '2.1 MB',
      status: 'success',
      type: 'backup',
    },
    {
      id: '3',
      date: '2023-05-10 14:45 PM',
      size: '1.9 MB',
      status: 'success',
      type: 'backup',
    },
  ]);

  const handleBackup = () => {
    if (isBackupInProgress || isRestoreInProgress) {
      toast({
        title: "Operation in Progress",
        description: "Please wait for the current operation to complete.",
        variant: "destructive",
      });
      return;
    }
    
    setIsBackupInProgress(true);
    setBackupProgress(0);
    
    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackupInProgress(false);
          
          // Add backup to history
          const newBackup: BackupHistoryItemType = {
            id: Math.random().toString(36).substring(2, 15),
            date: new Date().toLocaleString(),
            size: '2.5 MB',
            status: 'success',
            type: 'backup',
          };
          
          setBackupHistory([newBackup, ...backupHistory]);
          
          // Show success message
          toast({
            title: "Backup Completed",
            description: "Database backup has been successfully completed.",
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleRestore = () => {
    if (isBackupInProgress || isRestoreInProgress) {
      toast({
        title: "Operation in Progress",
        description: "Please wait for the current operation to complete.",
        variant: "destructive",
      });
      return;
    }
    
    // Confirm before restoration
    if (!window.confirm("Are you sure you want to restore the database? This will overwrite current data.")) {
      return;
    }
    
    setIsRestoreInProgress(true);
    setRestoreProgress(0);
    
    // Simulate restore progress
    const interval = setInterval(() => {
      setRestoreProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRestoreInProgress(false);
          
          // Add restore to history
          const newRestore: BackupHistoryItemType = {
            id: Math.random().toString(36).substring(2, 15),
            date: new Date().toLocaleString(),
            size: '2.5 MB',
            status: 'success',
            type: 'restore',
          };
          
          setBackupHistory([newRestore, ...backupHistory]);
          
          // Show success message
          toast({
            title: "Restore Completed",
            description: "Database has been successfully restored.",
          });
          
          return 100;
        }
        return prev + 8;
      });
    }, 600);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Database Backup</h1>
        <p className="text-gray-600">
          Manage database backups and restoration
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Backup Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Backup Database
            </CardTitle>
            <CardDescription>
              Create a backup of the current database state
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isBackupInProgress ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Backup in progress...</p>
                  <p className="text-sm">{backupProgress}%</p>
                </div>
                <Progress value={backupProgress} />
                <p className="text-xs text-gray-500">
                  Please do not close the browser window while the backup is in progress.
                </p>
              </div>
            ) : backupProgress === 100 ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-md">
                <CheckCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">Backup Completed</p>
                  <p className="text-sm">
                    Database backup has been successfully completed.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-md">
                  <AlertCircle className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Important</p>
                    <p className="text-sm">
                      Backing up the database will create a snapshot of all current data. 
                      This will not affect current operations.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <p className="text-sm text-gray-500">
                    Last backup: {backupHistory[0]?.date || "Never"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleBackup}
              disabled={isBackupInProgress || isRestoreInProgress}
              className="w-full"
            >
              {isBackupInProgress ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {isBackupInProgress ? "Backing Up..." : "Backup Now"}
            </Button>
          </CardFooter>
        </Card>

        {/* Restore Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Restore Database
            </CardTitle>
            <CardDescription>
              Restore the database from a previous backup
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isRestoreInProgress ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Restore in progress...</p>
                  <p className="text-sm">{restoreProgress}%</p>
                </div>
                <Progress value={restoreProgress} />
                <p className="text-xs text-gray-500">
                  Please do not close the browser window while the restoration is in progress.
                </p>
              </div>
            ) : restoreProgress === 100 ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-md">
                <CheckCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">Restore Completed</p>
                  <p className="text-sm">
                    Database has been successfully restored.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-amber-50 text-amber-700 rounded-md">
                  <AlertCircle className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Warning</p>
                    <p className="text-sm">
                      Restoring the database will overwrite all current data. 
                      Make sure to create a backup before proceeding.
                    </p>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-md">
                  <p className="font-medium mb-2">Available Backups</p>
                  {backupHistory.filter(item => item.type === 'backup').length > 0 ? (
                    <div className="text-sm">
                      <div className="flex justify-between text-gray-500 mb-1">
                        <span>Date</span>
                        <span>Size</span>
                      </div>
                      {backupHistory
                        .filter(item => item.type === 'backup')
                        .slice(0, 3)
                        .map((backup, index) => (
                          <div key={backup.id} className="flex justify-between py-1 border-t border-gray-100">
                            <span>{backup.date}</span>
                            <span>{backup.size}</span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No backups available</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={handleRestore}
              disabled={isBackupInProgress || isRestoreInProgress || backupHistory.filter(item => item.type === 'backup').length === 0}
              className="w-full"
            >
              {isRestoreInProgress ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {isRestoreInProgress ? "Restoring..." : "Restore from Latest Backup"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Backup History */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backup History
          </CardTitle>
          <CardDescription>
            View backup and restore operation history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {backupHistory.length > 0 ? (
            <div className="space-y-1">
              {backupHistory.map((item) => (
                <BackupHistoryItem
                  key={item.id}
                  date={item.date}
                  size={item.size}
                  status={item.status}
                  type={item.type}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Database className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="font-medium">No backup history</p>
              <p className="text-sm mt-1">
                Create your first backup to see it here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Backup;
