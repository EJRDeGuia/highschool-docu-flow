
# Pinagtongulan Integrated National Highschool - Document Request System

A comprehensive web-based application for managing high school document requests with full-stack implementation guide.

## Overview

This document request management system allows students to submit and track document requests, while providing staff with tools to process and manage these requests efficiently. The system includes role-based access control, real-time notifications, and a complete workflow for document processing.

## Technologies Used

### Frontend
- React with TypeScript
- TailwindCSS for styling
- shadcn/ui component library
- React Router for navigation
- React Query for data fetching
- React Hook Form for form handling

### Backend (Implementation Guide)
- Node.js + Express.js OR PHP for the server
- MySQL database for data storage
- JWT for authentication
- RESTful API architecture

## Full-Stack Implementation Guide

### Step 1: Setup Database Schema

1. Create a MySQL database named `document_system`
2. Set up the following tables:

```sql
-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'registrar', 'admin') NOT NULL,
    student_id VARCHAR(50) NULL,
    contact_number VARCHAR(20) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Document types table
CREATE TABLE document_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    fee DECIMAL(10, 2) NOT NULL,
    processing_days INT NOT NULL DEFAULT 3,
    is_active BOOLEAN DEFAULT TRUE
);

-- Requests table
CREATE TABLE requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reference_code VARCHAR(20) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    document_type_id INT NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    copies INT NOT NULL DEFAULT 1,
    additional_details TEXT NULL,
    fee DECIMAL(10, 2) NOT NULL,
    status ENUM('Pending', 'Processing', 'Approved', 'Rejected', 'Completed', 'Cancelled') DEFAULT 'Pending',
    has_paid BOOLEAN DEFAULT FALSE,
    has_uploaded_receipt BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (document_type_id) REFERENCES document_types(id)
);

-- Request timeline table
CREATE TABLE request_timeline (
    id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT NOT NULL,
    step VARCHAR(255) NOT NULL,
    status ENUM('pending', 'current', 'completed') NOT NULL,
    note TEXT NULL,
    created_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES requests(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Payments and receipts table
CREATE TABLE receipts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN DEFAULT FALSE,
    verified_by INT NULL,
    verified_at TIMESTAMP NULL,
    FOREIGN KEY (request_id) REFERENCES requests(id),
    FOREIGN KEY (verified_by) REFERENCES users(id)
);

-- Notifications table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- System settings table
CREATE TABLE settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    updated_by INT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id)
);
```

3. Add initial data:

```sql
-- Insert default document types
INSERT INTO document_types (name, description, fee, processing_days) VALUES
('Transcript of Records', 'Official transcript of academic records', 200.00, 5),
('Certificate of Enrollment', 'Confirms current enrollment status', 50.00, 1),
('Certificate of Good Moral Character', 'Character certification for students', 50.00, 2),
('Diploma', 'Official graduation diploma', 500.00, 10);

-- Insert admin user
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@school.edu', '$2y$10$example_hash_for_password', 'admin'),
('Registrar User', 'registrar@school.edu', '$2y$10$example_hash_for_password', 'registrar'),
('Student User', 'student@school.edu', '$2y$10$example_hash_for_password', 'student');

-- Insert default settings
INSERT INTO settings (setting_key, setting_value, updated_by) VALUES
('school_name', 'Pinagtongulan Integrated National Highschool', 1),
('school_address', '123 Main St, Pinagtongulan', 1),
('contact_email', 'info@pinagtongulan.edu.ph', 1),
('contact_phone', '+63 123 456 7890', 1),
('payment_instructions', 'Please pay the fee at the cashier and upload your receipt.', 1);
```

### Step 2: Create Backend API (Node.js + Express Example)

1. Set up a new Node.js project:

```bash
mkdir document-system-api
cd document-system-api
npm init -y
npm install express mysql2 cors bcrypt jsonwebtoken dotenv multer
```

2. Create basic directory structure:

```
/document-system-api
  /src
    /config
      - database.js
    /controllers
      - authController.js
      - requestController.js
      - userController.js
      - settingsController.js
    /middleware
      - auth.js
      - roleCheck.js
    /routes
      - auth.js
      - requests.js
      - users.js
      - settings.js
    /utils
      - helpers.js
    - server.js
  .env
  package.json
```

3. Implement key API endpoints:

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new student
- `GET /api/auth/me` - Get current user data

#### Requests
- `GET /api/requests` - Get all requests (admin/registrar)
- `GET /api/requests/user/:userId` - Get user requests
- `GET /api/requests/:id` - Get request details
- `POST /api/requests` - Create new request
- `PUT /api/requests/:id/status` - Update request status
- `PUT /api/requests/:id/payment` - Mark payment received
- `POST /api/requests/:id/receipt` - Upload receipt
- `GET /api/requests/statistics` - Get request statistics

#### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create new user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

#### Settings
- `GET /api/settings` - Get all settings
- `PUT /api/settings` - Update settings (admin only)
- `POST /api/backup` - Create database backup (admin only)
- `POST /api/restore` - Restore database from backup (admin only)

### Step 3: Connect Frontend to Backend

1. Create API service files in your React frontend:

```bash
mkdir -p src/services/api
```

2. Create the following API service files:

- `src/services/api/authService.ts`
- `src/services/api/requestService.ts`
- `src/services/api/userService.ts`
- `src/services/api/settingsService.ts`

3. Example implementation of requestService.ts:

```typescript
import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api/requests`;

// Configure axios with interceptors for auth tokens
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to inject auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllRequests = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch requests');
  }
};

export const getUserRequests = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user requests');
  }
};

// Add other API methods following the same pattern
```

### Step 4: Authentication Implementation

1. Set up JWT authentication in the backend:

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Authentication required' });
  }
};

module.exports = auth;
```

2. Update the `AuthContext.tsx` to use real authentication:

```typescript
// Update the login function to make API calls
const login = async (email: string, password: string) => {
  try {
    const response = await authService.login(email, password);
    const { token, user } = response.data;
    
    // Store token in local storage
    localStorage.setItem('token', token);
    
    // Set the authenticated user
    setUser(user);
    
    return user;
  } catch (error) {
    throw new Error('Authentication failed');
  }
};
```

### Step 5: File Upload Implementation

1. Configure Multer for file uploads in the backend:

```javascript
// routes/requests.js
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/receipts');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `receipt-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only .jpeg, .jpg, .png, and .pdf files are allowed'));
  }
});

// Receipt upload endpoint
router.post('/:id/receipt', auth, upload.single('receipt'), requestController.uploadReceipt);
```

2. Update frontend receipt upload component to use actual API:

```typescript
const handleUpload = async (file: File) => {
  try {
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('receipt', file);
    
    await requestService.uploadReceipt(requestId, formData);
    
    setHasUploaded(true);
    addNotification({
      title: 'Receipt Uploaded',
      message: 'Your receipt has been uploaded successfully',
      type: 'success'
    });
  } catch (error) {
    console.error('Upload failed:', error);
    addNotification({
      title: 'Upload Failed',
      message: 'There was a problem uploading your receipt',
      type: 'error'
    });
  } finally {
    setIsUploading(false);
  }
};
```

### Step 6: Database Backup & Restore (Admin Only)

1. Implement database backup functionality in the backend:

```javascript
// controllers/settingsController.js
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const fs = require('fs');

// Create backup
exports.createBackup = async (req, res) => {
  try {
    // Only admin can perform backup
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '../backups');
    const backupFile = path.join(backupDir, `backup-${timestamp}.sql`);
    
    // Create backup directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Execute mysqldump command
    const { stdout, stderr } = await exec(
      `mysqldump -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} > ${backupFile}`
    );
    
    if (stderr) {
      console.error(`Backup error: ${stderr}`);
      return res.status(500).json({ message: 'Backup failed' });
    }
    
    res.status(200).json({ 
      message: 'Backup created successfully',
      filename: path.basename(backupFile)
    });
  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).json({ message: 'Backup failed' });
  }
};
```

### Step 7: Deployment Preparation

1. Prepare the backend for production:
```javascript
// server.js
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app build directory
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  // Handle any requests that don't match the API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}
```

2. Create a production build script:
```json
// package.json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js",
  "build:frontend": "cd ../frontend && npm run build",
  "deploy": "npm run build:frontend && npm start"
}
```

### Step 8: Security Considerations

1. Implement HTTPS using certificates
2. Add rate limiting to prevent abuse
3. Implement proper input validation and sanitation
4. Set secure HTTP headers
5. Configure CORS properly

```javascript
// Add security middleware
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Apply helmet for secure headers
app.use(helmet());

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per window
});
app.use('/api/', limiter);
```

## Development Workflow

1. **Set up the local development environment**:
   - Clone both frontend and backend repositories
   - Install dependencies using `npm install`
   - Configure environment variables in `.env` files
   - Start both servers in development mode

2. **Database migration workflow**:
   - Create a `migrations` directory in the backend
   - Add numbered migration scripts for database changes
   - Implement a migration runner

3. **Testing strategy**:
   - Unit tests for individual functions and components
   - Integration tests for API endpoints
   - End-to-end tests for critical user flows

## System Administration

1. **Initial setup**:
   - Create the admin user
   - Configure system settings
   - Set up document types and fees

2. **User management**:
   - Add/modify staff accounts
   - Reset passwords
   - Deactivate accounts when needed

3. **Backup and recovery**:
   - Schedule regular automated backups
   - Store backups in a secure off-site location
   - Test restoration process periodically

## Maintenance and Support

1. **Regular maintenance tasks**:
   - Database optimization
   - Log rotation and analysis
   - Security updates

2. **Troubleshooting common issues**:
   - Authentication problems
   - File upload errors
   - Database connection issues

3. **Performance monitoring**:
   - Track API response times
   - Monitor database query performance
   - Set up alerts for system issues

## Future Enhancements

1. **Additional features to consider**:
   - SMS notifications
   - Integration with payment gateways
   - Document digital signing
   - Mobile application
   - Reports and analytics dashboard

2. **Scalability improvements**:
   - Implement caching
   - Consider microservices architecture for specific functions
   - Add load balancing for higher traffic

---

This implementation guide provides a comprehensive roadmap for converting the current frontend application into a full-stack system. Follow the steps sequentially, ensuring each component is thoroughly tested before proceeding to the next.

For further assistance or custom implementation, please contact the system administrators.
