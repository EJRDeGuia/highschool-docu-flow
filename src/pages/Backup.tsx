
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

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
  const [backupHistory, setBackupHistory] = useState<BackupHistoryItemType[]>([]);
  const [backupData, setBackupData] = useState<any>(null);

  // Load backup history on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('backup_history');
    if (savedHistory) {
      setBackupHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveBackupHistory = (history: BackupHistoryItemType[]) => {
    localStorage.setItem('backup_history', JSON.stringify(history));
    setBackupHistory(history);
  };

  const handleBackup = async () => {
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
    
    try {
      // Simulate progress while we fetch data
      const progressInterval = setInterval(() => {
        setBackupProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Fetch all data from tables
      const [usersData, documentTypesData, documentRequestsData, receiptUploadsData, requestTimelineData] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('document_types').select('*'),
        supabase.from('document_requests').select('*'),
        supabase.from('receipt_uploads').select('*'),
        supabase.from('request_timeline').select('*'),
      ]);

      clearInterval(progressInterval);

      if (usersData.error || documentTypesData.error || documentRequestsData.error || 
          receiptUploadsData.error || requestTimelineData.error) {
        throw new Error('Failed to fetch data from database');
      }

      const backup = {
        timestamp: new Date().toISOString(),
        data: {
          users: usersData.data,
          document_types: documentTypesData.data,
          document_requests: documentRequestsData.data,
          receipt_uploads: receiptUploadsData.data,
          request_timeline: requestTimelineData.data,
        }
      };

      // Store backup data in localStorage
      const backupKey = `backup_${Date.now()}`;
      localStorage.setItem(backupKey, JSON.stringify(backup));
      
      // Calculate size
      const backupSize = (JSON.stringify(backup).length / 1024).toFixed(1) + ' KB';
      
      setBackupProgress(100);
      
      // Add backup to history
      const newBackup: BackupHistoryItemType = {
        id: backupKey,
        date: new Date().toLocaleString(),
        size: backupSize,
        status: 'success',
        type: 'backup',
      };
      
      const updatedHistory = [newBackup, ...backupHistory];
      saveBackupHistory(updatedHistory);
      
      toast({
        title: "Backup Completed",
        description: "Database backup has been successfully completed.",
      });
      
    } catch (error) {
      console.error('Backup error:', error);
      
      const newBackup: BackupHistoryItemType = {
        id: Math.random().toString(36).substring(2, 15),
        date: new Date().toLocaleString(),
        size: '0 KB',
        status: 'failed',
        type: 'backup',
      };
      
      const updatedHistory = [newBackup, ...backupHistory];
      saveBackupHistory(updatedHistory);
      
      toast({
        title: "Backup Failed",
        description: "Failed to create database backup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBackupInProgress(false);
    }
  };

  const handleRestore = async () => {
    if (isBackupInProgress || isRestoreInProgress) {
      toast({
        title: "Operation in Progress",
        description: "Please wait for the current operation to complete.",
        variant: "destructive",
      });
      return;
    }
    
    // Get the latest backup
    const latestBackup = backupHistory.find(item => item.type === 'backup' && item.status === 'success');
    if (!latestBackup) {
      toast({
        title: "No Backup Available",
        description: "No successful backup found to restore from.",
        variant: "destructive",
      });
      return;
    }
    
    // Confirm before restoration
    if (!window.confirm("Are you sure you want to restore the database? This will overwrite current data except for users.")) {
      return;
    }
    
    setIsRestoreInProgress(true);
    setRestoreProgress(0);
    
    try {
      // Get backup data
      const backupData = localStorage.getItem(latestBackup.id);
      if (!backupData) {
        throw new Error('Backup data not found');
      }
      
      const backup = JSON.parse(backupData);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setRestoreProgress(prev => {
          if (prev >= 80) {
            clearInterval(progressInterval);
            return 80;
          }
          return prev + 10;
        });
      }, 300);
      
      // Clear existing data (except users) and restore
      await Promise.all([
        supabase.from('request_timeline').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('receipt_uploads').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('document_requests').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabase.from('document_types').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
      ]);
      
      // Restore data (skip users to preserve existing users)
      if (backup.data.document_types?.length > 0) {
        await supabase.from('document_types').insert(backup.data.document_types);
      }
      if (backup.data.document_requests?.length > 0) {
        await supabase.from('document_requests').insert(backup.data.document_requests);
      }
      if (backup.data.receipt_uploads?.length > 0) {
        await supabase.from('receipt_uploads').insert(backup.data.receipt_uploads);
      }
      if (backup.data.request_timeline?.length > 0) {
        await supabase.from('request_timeline').insert(backup.data.request_timeline);
      }
      
      clearInterval(progressInterval);
      setRestoreProgress(100);
      
      // Add restore to history
      const newRestore: BackupHistoryItemType = {
        id: Math.random().toString(36).substring(2, 15),
        date: new Date().toLocaleString(),
        size: latestBackup.size,
        status: 'success',
        type: 'restore',
      };
      
      const updatedHistory = [newRestore, ...backupHistory];
      saveBackupHistory(updatedHistory);
      
      toast({
        title: "Restore Completed",
        description: "Database has been successfully restored from backup.",
      });
      
    } catch (error) {
      console.error('Restore error:', error);
      
      const newRestore: BackupHistoryItemType = {
        id: Math.random().toString(36).substring(2, 15),
        date: new Date().toLocaleString(),
        size: '0 KB',
        status: 'failed',
        type: 'restore',
      };
      
      const updatedHistory = [newRestore, ...backupHistory];
      saveBackupHistory(updatedHistory);
      
      toast({
        title: "Restore Failed",
        description: "Failed to restore database from backup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRestoreInProgress(false);
    }
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
                    Last backup: {backupHistory.find(item => item.type === 'backup')?.date || "Never"}
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
                      Restoring the database will overwrite current data (except users). 
                      Make sure to create a backup before proceeding.
                    </p>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-md">
                  <p className="font-medium mb-2">Available Backups</p>
                  {backupHistory.filter(item => item.type === 'backup' && item.status === 'success').length > 0 ? (
                    <div className="text-sm">
                      <div className="flex justify-between text-gray-500 mb-1">
                        <span>Date</span>
                        <span>Size</span>
                      </div>
                      {backupHistory
                        .filter(item => item.type === 'backup' && item.status === 'success')
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
              disabled={isBackupInProgress || isRestoreInProgress || backupHistory.filter(item => item.type === 'backup' && item.status === 'success').length === 0}
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
