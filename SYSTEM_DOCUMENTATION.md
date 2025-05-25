
# Student Records Management System - Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [System Modules](#system-modules)
3. [Module Interactions](#module-interactions)
4. [Technologies and Tools](#technologies-and-tools)
5. [User Manual](#user-manual)

---

## System Overview

The Student Records Management System is a web-based application designed to streamline the process of requesting, processing, and managing student documents. The system supports three user roles: Students, Registrars, and Administrators, each with specific permissions and capabilities.

---

## System Modules

### 1. Authentication Module (`src/contexts/AuthContext.tsx`)
**Purpose**: Manages user authentication and authorization
**Features**:
- User login/logout functionality
- Role-based access control (Student, Registrar, Admin)
- Session management
- Permission checking

### 2. Notifications Module (`src/contexts/NotificationsContext.tsx`)
**Purpose**: Handles system-wide notifications
**Features**:
- Role-specific notifications
- User-specific notifications
- Real-time notification display
- Notification persistence in localStorage
- Mark as read/unread functionality

### 3. Request Management Module (`src/services/requestService.ts`)
**Purpose**: Core business logic for document requests
**Features**:
- Create new document requests
- Update request status
- Manage request timeline
- Handle payment verification
- Request approval/rejection workflow

### 4. Document Types Module (Database: `document_types` table)
**Purpose**: Manages available document types
**Features**:
- Define document types (Transcript, Certificate, etc.)
- Set base fees for each document type
- Configure processing timeframes

### 5. Receipt Management Module (`src/components/requests/ReceiptUpload.tsx`)
**Purpose**: Handles payment receipt uploads and verification
**Features**:
- File upload functionality
- Receipt display for verification
- Payment status tracking
- QR code display for payment information

### 6. User Management Module (Database: `users` table)
**Purpose**: Manages user profiles and information
**Features**:
- User registration
- Profile management
- Role assignment
- Student ID management

### 7. Dashboard Module (`src/pages/Dashboard.tsx`)
**Purpose**: Provides role-specific overview screens
**Features**:
- Statistics display
- Quick access to common functions
- Recent activity overview

### 8. Request Timeline Module (`src/components/requests/RequestTimeline.tsx`)
**Purpose**: Tracks and displays request progress
**Features**:
- Visual timeline representation
- Status updates
- Historical tracking
- Notes and comments

---

## Module Interactions

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend UI   │    │   Auth Context   │    │  Notifications  │
│                 │◄──►│                  │◄──►│    Context      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Request Service │    │   Supabase DB    │    │ Notification    │
│                 │◄──►│                  │◄──►│   Service       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │
         ▼                        ▼
┌─────────────────┐    ┌──────────────────┐
│ Receipt Upload  │    │  Timeline Track  │
│                 │◄──►│                  │
└─────────────────┘    └──────────────────┘
```

### Interaction Flow:

1. **User Authentication**: 
   - User logs in through Auth Context
   - Role-based permissions are established
   - Dashboard displays role-appropriate content

2. **Request Creation**:
   - Student creates request through Request Service
   - System generates notifications for registrars
   - Request timeline is initialized
   - Payment information is displayed

3. **Receipt Upload**:
   - Student uploads payment receipt
   - Notification sent to registrars
   - Receipt stored in database
   - Request status updated

4. **Request Processing**:
   - Registrar reviews request and receipt
   - Payment verification or rejection
   - Status updates trigger notifications
   - Timeline updated with progress

5. **Notification System**:
   - Role-specific notifications generated
   - Real-time updates in notification popover
   - Persistent storage in localStorage
   - Cross-module communication

---

## Technologies and Tools

### Frontend Technologies
- **React 18.3.1**: Main frontend framework
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router DOM 6.26.2**: Client-side routing

### UI Libraries and Components
- **Shadcn/UI**: Modern React component library
- **Radix UI**: Headless UI primitives
- **Lucide React 0.462.0**: Icon library
- **Class Variance Authority**: Utility for component variants
- **Tailwind Animate**: Animation utilities

### State Management
- **React Context API**: Global state management
- **TanStack React Query 5.56.2**: Server state management
- **React Hook Form 7.53.0**: Form state management

### Backend and Database
- **Supabase**: Backend-as-a-Service platform
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - File storage
- **Supabase JS Client 2.49.8**: JavaScript client library

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Git**: Version control

### Form Handling and Validation
- **React Hook Form**: Form management
- **Hookform Resolvers**: Form validation integration
- **Zod 3.23.8**: Schema validation

### Utilities
- **Date-fns 3.6.0**: Date manipulation
- **clsx & Tailwind Merge**: CSS class utilities
- **Sonner**: Toast notifications

---

## User Manual

### Getting Started

#### For Students

1. **Login**
   - Access the system through the login page
   - Enter your credentials (email and password)
   - You'll be redirected to the student dashboard

2. **Creating a New Request**
   - Navigate to "New Request" from the sidebar
   - Select the document type needed
   - Specify number of copies
   - Enter the purpose for the document
   - Add any additional details
   - Submit the request

3. **Making Payment**
   - After submitting a request, you'll see payment details
   - Use the provided QR code to make payment
   - Upload your payment receipt through "Upload Receipt"
   - Wait for payment verification

4. **Tracking Your Requests**
   - Go to "My Requests" to view all your submissions
   - Check the status of each request
   - View the timeline of processing steps
   - Download completed documents when ready

5. **Notifications**
   - Click the bell icon to view notifications
   - Receive updates on request status changes
   - Get notified when payment is verified or rejected

#### For Registrars

1. **Dashboard Overview**
   - View pending requests requiring attention
   - See recent activity and statistics
   - Quick access to management functions

2. **Managing Requests**
   - Navigate to "Manage Requests"
   - Review incoming document requests
   - Verify uploaded payment receipts
   - Approve or reject requests
   - Update request status

3. **Payment Verification**
   - Access receipt uploads through request details
   - View uploaded payment receipts
   - Verify payment authenticity
   - Mark payments as verified or reject them
   - Add notes for rejection reasons

4. **Processing Workflow**
   - Review request details and student information
   - Check payment status before processing
   - Update request timeline with progress notes
   - Mark requests as completed when documents are ready

#### For Administrators

1. **System Administration**
   - Access all registrar functions
   - Manage user accounts through "Users"
   - Configure system settings
   - Perform system backups

2. **User Management**
   - View all system users
   - Assign or modify user roles
   - Activate or deactivate accounts
   - Reset user passwords if needed

3. **System Configuration**
   - Access "Settings" for system configuration
   - Modify document types and fees
   - Update processing timeframes
   - Configure notification templates

4. **Data Management**
   - Use "Search" functionality for advanced queries
   - Generate reports on system usage
   - Perform database backups through "Backup"
   - Monitor system performance

### Common Workflows

#### Document Request Process
1. Student submits request → System generates request ID
2. Student makes payment → Uploads receipt
3. Registrar receives notification → Reviews request and receipt
4. Registrar verifies payment → Updates status to "Processing"
5. Document is prepared → Status updated to "Completed"
6. Student receives notification → Can collect document

#### Payment Verification Process
1. Student uploads receipt → Registrar notification sent
2. Registrar reviews receipt → Checks payment details
3. Payment verified → Status updated, student notified
4. OR Payment rejected → Reason provided, student notified

### Tips for Efficient Use

**For Students:**
- Ensure payment receipts are clear and readable
- Provide accurate contact information
- Check notifications regularly for updates
- Upload receipts promptly after payment

**For Registrars:**
- Process requests in chronological order
- Provide clear rejection reasons when applicable
- Use timeline notes to communicate progress
- Verify payment details carefully

**For Administrators:**
- Regularly backup system data
- Monitor user activity for security
- Keep document fees updated
- Review system settings periodically

### Troubleshooting

**Common Issues:**
- **Can't upload receipt**: Check file size and format (images only)
- **Notifications not appearing**: Refresh the page or check notification settings
- **Request stuck in pending**: Contact registrar for status update
- **Login problems**: Verify credentials or contact administrator

**Support:**
- Contact system administrator for technical issues
- Registrar office for document-related questions
- Check notification history for missed updates

