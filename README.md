
# High School Document Request Management System

A comprehensive web-based application for managing high school document requests, built with React, TypeScript, and TailwindCSS.

## Features

- **Document Request Submission**: Students can submit requests for various school documents.
- **Request Tracking**: Real-time tracking of document request status.
- **Admin Dashboard**: For registrars and administrators to manage document requests.
- **Payment Integration**: GCash QR code payment system with receipt upload.
- **Role-Based Access Control**: Different views and permissions for students, registrars, and administrators.
- **Notification System**: Real-time notifications for status updates.
- **Search Functionality**: Find requests by various criteria.
- **Database Backup**: Simulated backup and restore functionality.

## Tech Stack

- **Frontend**:
  - React with TypeScript
  - TailwindCSS for styling
  - shadcn/ui component library
  - React Router for navigation
  - React Query for data fetching

- **Backend**:
  - MySQL with phpMyAdmin (integration ready)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL server with phpMyAdmin

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd document-request-system
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. The application will be available at `http://localhost:8080`

### Database Setup

1. Create a new MySQL database named `document_system` in phpMyAdmin.

2. Import the SQL schema:
   - Navigate to your phpMyAdmin interface
   - Select the `document_system` database
   - Click on "Import" in the top menu
   - Choose the `database/schema.sql` file from the project
   - Click "Go" to import the schema

3. Configure the database connection:
   - Update the database connection settings in the Settings page of the application when logged in as an admin.
   - Default credentials: 
     - Host: localhost
     - Port: 3306
     - Database: document_system
     - Username: document_user
     - Password: password

## Project Structure

```
src/
├── components/         # UI components
│   ├── layout/         # Layout components like sidebar, header
│   ├── requests/       # Request-related components
│   ├── notifications/  # Notification components
│   └── ui/             # shadcn/ui components
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and helpers
├── pages/              # Page components
├── services/           # API service functions
├── App.tsx             # Main app component with routes
└── main.tsx            # Entry point
```

## User Roles

1. **Student**:
   - Submit document requests
   - Track request status
   - Upload payment receipts
   - View request history

2. **Registrar**:
   - View and manage all document requests
   - Update request status
   - Process document requests

3. **Admin**:
   - All registrar permissions
   - Manage user accounts
   - Configure system settings
   - Perform database backups

## Login Credentials (Demo)

- **Student**: student@school.edu / password
- **Registrar**: registrar@school.edu / password
- **Admin**: admin@school.edu / password

## Development and Testing

### Manual Testing

Test the application thoroughly using the following steps:

1. Log in with different user roles
2. Submit document requests
3. Process requests through the entire workflow
4. Test payment and receipt upload functionality
5. Verify that notifications work correctly
6. Test search functionality
7. Verify role-based access controls

### Known Issues and Limitations

- This version uses simulated data without actual database connections
- GCash QR code is a simulation and does not process real payments
- File uploads are simulated and don't persist between sessions

## Production Deployment

For production deployment:

1. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Deploy the `dist` directory to your web server

3. Set up the MySQL database on your production server

4. Configure the database connection in the admin settings

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- shadcn/ui for the component library
- Tailwind CSS for the utility-first CSS framework
- React and TypeScript for the frontend foundation
