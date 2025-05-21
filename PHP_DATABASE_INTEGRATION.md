
# Connecting the Document Request System to a PHP Backend Database

This guide provides step-by-step instructions on how to connect this React frontend application to a PHP backend with a MySQL database.

## Table of Contents

1. [Setting Up PHP Backend](#setting-up-php-backend)
2. [Database Configuration](#database-configuration)
3. [Creating Required API Endpoints](#creating-required-api-endpoints)
4. [Connecting React Frontend to PHP Backend](#connecting-react-frontend-to-php-backend)
5. [Testing the Connection](#testing-the-connection)
6. [Security Considerations](#security-considerations)
7. [Troubleshooting](#troubleshooting)

## Setting Up PHP Backend

### Prerequisites
- Web server (Apache, Nginx, etc.)
- PHP 7.4 or higher
- MySQL 5.7 or higher
- phpMyAdmin (optional but recommended)

### Installation Steps

1. **Install XAMPP, WAMP, MAMP, or set up a custom web server with PHP and MySQL**
   - Download from [XAMPP](https://www.apachefriends.org/index.html), [WAMP](https://www.wampserver.com/en/), or [MAMP](https://www.mamp.info/en/downloads/)
   - Install and start the server

2. **Create a project folder in the web server directory**
   ```
   /htdocs/document-system-api/  (for XAMPP)
   /www/document-system-api/     (for WAMP)
   ```

3. **Set up CORS headers for your PHP files**
   - Create a `.htaccess` file in your API directory:
   ```apache
   Header set Access-Control-Allow-Origin "*"
   Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
   Header set Access-Control-Allow-Headers "Content-Type, Authorization"
   ```

## Database Configuration

1. **Create a new MySQL database**
   - Open phpMyAdmin (usually at http://localhost/phpmyadmin)
   - Click "New" and create database named `document_system`
   
2. **Import database schema**
   - Create a file named `schema.sql` in your API folder with the following content:

```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'registrar', 'admin') NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE document_requests (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    document_type_name VARCHAR(100) NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    additional_details TEXT,
    copies INT NOT NULL DEFAULT 1,
    status ENUM('Pending', 'Processing', 'Approved', 'Rejected', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fee DECIMAL(10,2) NOT NULL,
    has_paid BOOLEAN NOT NULL DEFAULT FALSE,
    has_uploaded_receipt BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE request_timeline (
    id VARCHAR(36) PRIMARY KEY,
    request_id VARCHAR(36) NOT NULL,
    step VARCHAR(100) NOT NULL,
    status ENUM('completed', 'current', 'pending') NOT NULL,
    date TIMESTAMP NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES document_requests(id) ON DELETE CASCADE
);

-- Insert sample users for testing
INSERT INTO users (id, name, email, password, role) VALUES
('1', 'Student User', 'student@school.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('2', 'Registrar User', 'registrar@school.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'registrar'),
('3', 'Admin User', 'admin@school.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
```

3. **Import the schema**
   - In phpMyAdmin, select your database and go to the "Import" tab
   - Choose the `schema.sql` file and click "Go"

## Creating Required API Endpoints

Create the following PHP files in your API directory:

1. **config.php** - Database connection configuration

```php
<?php
// Database configuration
$db_host = 'localhost';
$db_name = 'document_system';
$db_user = 'root';  // Change to your MySQL username
$db_pass = '';      // Change to your MySQL password

// Create connection
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Check connection
if ($conn->connect_error) {
    header('HTTP/1.1 500 Internal Server Error');
    die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}

// Set the response content type to JSON
header('Content-Type: application/json');

// Helper function to generate UUID
function generate_uuid() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}
?>
```

2. **auth.php** - Authentication endpoints

```php
<?php
require_once 'config.php';

// Get HTTP method
$method = $_SERVER['REQUEST_METHOD'];

// Process based on HTTP method
switch ($method) {
    case 'POST':
        // Get request body
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Login endpoint
        if (isset($data['email']) && isset($data['password'])) {
            $email = $conn->real_escape_string($data['email']);
            
            // Get user from database
            $sql = "SELECT id, name, email, password, role FROM users WHERE email = '$email'";
            $result = $conn->query($sql);
            
            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();
                
                // Verify password (in production, use password_verify())
                // For simplicity, we're not hashing passwords in this example
                if ($user['password'] === '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi') {
                    // Remove password from response
                    unset($user['password']);
                    
                    echo json_encode([
                        'success' => true,
                        'user' => $user
                    ]);
                } else {
                    http_response_code(401);
                    echo json_encode(['error' => 'Invalid credentials']);
                }
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'User not found']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Email and password required']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>
```

3. **requests.php** - Document request endpoints

```php
<?php
require_once 'config.php';

// Get HTTP method
$method = $_SERVER['REQUEST_METHOD'];

// Process based on HTTP method
switch ($method) {
    case 'GET':
        // Get all requests or specific user requests
        if (isset($_GET['userId'])) {
            $userId = $conn->real_escape_string($_GET['userId']);
            $sql = "SELECT * FROM document_requests WHERE user_id = '$userId'";
        } else if (isset($_GET['id'])) {
            $id = $conn->real_escape_string($_GET['id']);
            $sql = "SELECT * FROM document_requests WHERE id = '$id'";
        } else {
            $sql = "SELECT * FROM document_requests";
        }
        
        $result = $conn->query($sql);
        $requests = [];
        
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                // Get timeline for each request
                $requestId = $row['id'];
                $timelineSql = "SELECT * FROM request_timeline WHERE request_id = '$requestId' ORDER BY created_at ASC";
                $timelineResult = $conn->query($timelineSql);
                
                $timeline = [];
                if ($timelineResult->num_rows > 0) {
                    while ($timelineRow = $timelineResult->fetch_assoc()) {
                        $timeline[] = [
                            'id' => $timelineRow['id'],
                            'step' => $timelineRow['step'],
                            'status' => $timelineRow['status'],
                            'date' => $timelineRow['date'],
                            'note' => $timelineRow['note']
                        ];
                    }
                }
                
                $row['timeline'] = $timeline;
                $requests[] = $row;
            }
        }
        
        echo json_encode($requests);
        break;
        
    case 'POST':
        // Create a new request
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (!isset($data['userId']) || !isset($data['documentType']) || 
            !isset($data['documentTypeName']) || !isset($data['purpose']) || 
            !isset($data['copies'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            break;
        }
        
        // Generate request ID
        $id = 'REQ-' . date('Y') . '-' . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
        
        // Escape data
        $userId = $conn->real_escape_string($data['userId']);
        $documentType = $conn->real_escape_string($data['documentType']);
        $documentTypeName = $conn->real_escape_string($data['documentTypeName']);
        $purpose = $conn->real_escape_string($data['purpose']);
        $copies = (int)$data['copies'];
        $additionalDetails = isset($data['additionalDetails']) ? $conn->real_escape_string($data['additionalDetails']) : null;
        $fee = isset($data['fee']) ? (float)$data['fee'] : ($copies * 50); // Default fee
        
        // Insert request
        $sql = "INSERT INTO document_requests (id, user_id, document_type, document_type_name, purpose, 
                additional_details, copies, fee) 
                VALUES ('$id', '$userId', '$documentType', '$documentTypeName', '$purpose', 
                " . ($additionalDetails ? "'$additionalDetails'" : "NULL") . ", $copies, $fee)";
        
        if ($conn->query($sql) === TRUE) {
            // Create initial timeline entry
            $timelineId = generate_uuid();
            $step = 'Request Submitted';
            $status = 'completed';
            $date = date('Y-m-d H:i:s');
            $note = 'Document request submitted successfully.';
            
            $timelineSql = "INSERT INTO request_timeline (id, request_id, step, status, date, note) 
                           VALUES ('$timelineId', '$id', '$step', '$status', '$date', '$note')";
                           
            $conn->query($timelineSql);
            
            // Add remaining timeline steps
            $steps = ['Payment Completed', 'Processing Request', 'Document Ready', 'Completed'];
            $status = 'pending';
            
            foreach ($steps as $step) {
                $timelineId = generate_uuid();
                $timelineSql = "INSERT INTO request_timeline (id, request_id, step, status) 
                               VALUES ('$timelineId', '$id', '$step', '$status')";
                $conn->query($timelineSql);
            }
            
            // Get the created request with timeline
            $sql = "SELECT * FROM document_requests WHERE id = '$id'";
            $result = $conn->query($sql);
            $request = $result->fetch_assoc();
            
            // Get timeline
            $timelineSql = "SELECT * FROM request_timeline WHERE request_id = '$id' ORDER BY created_at ASC";
            $timelineResult = $conn->query($timelineSql);
            
            $timeline = [];
            if ($timelineResult->num_rows > 0) {
                while ($timelineRow = $timelineResult->fetch_assoc()) {
                    $timeline[] = [
                        'id' => $timelineRow['id'],
                        'step' => $timelineRow['step'],
                        'status' => $timelineRow['status'],
                        'date' => $timelineRow['date'],
                        'note' => $timelineRow['note']
                    ];
                }
            }
            
            $request['timeline'] = $timeline;
            echo json_encode($request);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error creating request: ' . $conn->error]);
        }
        break;
        
    case 'PUT':
        // Update request status
        if (isset($_GET['id'])) {
            $id = $conn->real_escape_string($_GET['id']);
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (isset($data['status'])) {
                $status = $conn->real_escape_string($data['status']);
                $note = isset($data['note']) ? $conn->real_escape_string($data['note']) : null;
                
                // Update request status
                $sql = "UPDATE document_requests SET status = '$status', updated_at = NOW() WHERE id = '$id'";
                
                if ($conn->query($sql) === TRUE) {
                    // Update timeline based on status
                    $timelineStep = '';
                    
                    switch ($status) {
                        case 'Processing':
                            $timelineStep = 'Processing Request';
                            break;
                        case 'Approved':
                            $timelineStep = 'Document Ready';
                            break;
                        case 'Completed':
                            $timelineStep = 'Completed';
                            break;
                        case 'Rejected':
                            $timelineStep = 'Request Rejected';
                            break;
                    }
                    
                    if ($timelineStep) {
                        $date = date('Y-m-d H:i:s');
                        
                        // Update the timeline step
                        $sql = "UPDATE request_timeline SET status = 'current', date = '$date'" . 
                               ($note ? ", note = '$note'" : "") .
                               " WHERE request_id = '$id' AND step = '$timelineStep'";
                        $conn->query($sql);
                        
                        // Mark previous steps as completed
                        $sql = "UPDATE request_timeline SET status = 'completed' 
                               WHERE request_id = '$id' AND 
                               created_at < (SELECT created_at FROM request_timeline WHERE request_id = '$id' AND step = '$timelineStep')";
                        $conn->query($sql);
                    }
                    
                    // Get updated request
                    $sql = "SELECT * FROM document_requests WHERE id = '$id'";
                    $result = $conn->query($sql);
                    $request = $result->fetch_assoc();
                    
                    // Get timeline
                    $timelineSql = "SELECT * FROM request_timeline WHERE request_id = '$id' ORDER BY created_at ASC";
                    $timelineResult = $conn->query($timelineSql);
                    
                    $timeline = [];
                    if ($timelineResult->num_rows > 0) {
                        while ($timelineRow = $timelineResult->fetch_assoc()) {
                            $timeline[] = [
                                'id' => $timelineRow['id'],
                                'step' => $timelineRow['step'],
                                'status' => $timelineRow['status'],
                                'date' => $timelineRow['date'],
                                'note' => $timelineRow['note']
                            ];
                        }
                    }
                    
                    $request['timeline'] = $timeline;
                    echo json_encode($request);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Error updating request: ' . $conn->error]);
                }
            } else if (isset($data['hasPaid']) || isset($data['hasUploadedReceipt'])) {
                // Update payment status
                $updateFields = [];
                
                if (isset($data['hasPaid'])) {
                    $hasPaid = $data['hasPaid'] ? 1 : 0;
                    $updateFields[] = "has_paid = $hasPaid";
                }
                
                if (isset($data['hasUploadedReceipt'])) {
                    $hasUploadedReceipt = $data['hasUploadedReceipt'] ? 1 : 0;
                    $updateFields[] = "has_uploaded_receipt = $hasUploadedReceipt";
                }
                
                $sql = "UPDATE document_requests SET " . implode(", ", $updateFields) . ", updated_at = NOW() WHERE id = '$id'";
                
                if ($conn->query($sql) === TRUE) {
                    // If marking as paid, update the Payment Completed timeline step
                    if (isset($data['hasPaid']) && $data['hasPaid']) {
                        $date = date('Y-m-d H:i:s');
                        $note = 'Payment verified successfully.';
                        
                        $sql = "UPDATE request_timeline SET status = 'completed', date = '$date', note = '$note' 
                               WHERE request_id = '$id' AND step = 'Payment Completed'";
                        $conn->query($sql);
                    }
                    
                    // Get updated request
                    $sql = "SELECT * FROM document_requests WHERE id = '$id'";
                    $result = $conn->query($sql);
                    $request = $result->fetch_assoc();
                    
                    // Get timeline
                    $timelineSql = "SELECT * FROM request_timeline WHERE request_id = '$id' ORDER BY created_at ASC";
                    $timelineResult = $conn->query($timelineSql);
                    
                    $timeline = [];
                    if ($timelineResult->num_rows > 0) {
                        while ($timelineRow = $timelineResult->fetch_assoc()) {
                            $timeline[] = [
                                'id' => $timelineRow['id'],
                                'step' => $timelineRow['step'],
                                'status' => $timelineRow['status'],
                                'date' => $timelineRow['date'],
                                'note' => $timelineRow['note']
                            ];
                        }
                    }
                    
                    $request['timeline'] = $timeline;
                    echo json_encode($request);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Error updating payment status: ' . $conn->error]);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Missing update fields']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Missing request ID']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>
```

4. **statistics.php** - Get request statistics

```php
<?php
require_once 'config.php';

// Get HTTP method
$method = $_SERVER['REQUEST_METHOD'];

// Process based on HTTP method
switch ($method) {
    case 'GET':
        // Get statistics
        $statistics = [
            'total' => 0,
            'pending' => 0,
            'processing' => 0,
            'approved' => 0,
            'completed' => 0,
            'rejected' => 0,
        ];
        
        // Get total count
        $sql = "SELECT COUNT(*) as count FROM document_requests";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $statistics['total'] = (int)$row['count'];
        }
        
        // Get counts by status
        $statuses = ['Pending', 'Processing', 'Approved', 'Completed', 'Rejected'];
        foreach ($statuses as $status) {
            $statusLower = strtolower($status);
            $sql = "SELECT COUNT(*) as count FROM document_requests WHERE status = '$status'";
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $statistics[$statusLower] = (int)$row['count'];
            }
        }
        
        echo json_encode($statistics);
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>
```

5. **search.php** - Search requests

```php
<?php
require_once 'config.php';

// Get HTTP method
$method = $_SERVER['REQUEST_METHOD'];

// Process based on HTTP method
switch ($method) {
    case 'GET':
        // Search requests
        if (isset($_GET['query'])) {
            $query = $conn->real_escape_string($_GET['query']);
            
            $sql = "SELECT * FROM document_requests 
                   WHERE id LIKE '%$query%' 
                   OR document_type_name LIKE '%$query%' 
                   OR purpose LIKE '%$query%' 
                   OR additional_details LIKE '%$query%' 
                   OR status LIKE '%$query%'";
            
            $result = $conn->query($sql);
            $requests = [];
            
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    // Get timeline for each request
                    $requestId = $row['id'];
                    $timelineSql = "SELECT * FROM request_timeline WHERE request_id = '$requestId' ORDER BY created_at ASC";
                    $timelineResult = $conn->query($timelineSql);
                    
                    $timeline = [];
                    if ($timelineResult->num_rows > 0) {
                        while ($timelineRow = $timelineResult->fetch_assoc()) {
                            $timeline[] = [
                                'id' => $timelineRow['id'],
                                'step' => $timelineRow['step'],
                                'status' => $timelineRow['status'],
                                'date' => $timelineRow['date'],
                                'note' => $timelineRow['note']
                            ];
                        }
                    }
                    
                    $row['timeline'] = $timeline;
                    $requests[] = $row;
                }
            }
            
            echo json_encode($requests);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Missing search query']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>
```

## Connecting React Frontend to PHP Backend

Now that your PHP backend is set up, you need to modify the React frontend to use it:

1. **Create an API service file in your React project**

```javascript
// src/services/api.ts
import { User } from "../contexts/AuthContext";
import { DocumentRequest, RequestStatus, RequestTimelineItem } from "../services/requestService";

// Set the base API URL to your PHP backend
const API_BASE_URL = 'http://localhost/document-system-api';

// Authentication API calls
export const loginUser = async (email: string, password: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to login');
  }
  
  const data = await response.json();
  return data.user;
};

// Document request API calls
export const getAllRequests = async (): Promise<DocumentRequest[]> => {
  const response = await fetch(`${API_BASE_URL}/requests.php`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch requests');
  }
  
  const requests = await response.json();
  return requests.map(mapRequestFromBackend);
};

export const getUserRequests = async (userId: string): Promise<DocumentRequest[]> => {
  const response = await fetch(`${API_BASE_URL}/requests.php?userId=${userId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user requests');
  }
  
  const requests = await response.json();
  return requests.map(mapRequestFromBackend);
};

export const getRequestById = async (requestId: string): Promise<DocumentRequest> => {
  const response = await fetch(`${API_BASE_URL}/requests.php?id=${requestId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch request');
  }
  
  const requests = await response.json();
  if (requests.length === 0) {
    throw new Error('Request not found');
  }
  
  return mapRequestFromBackend(requests[0]);
};

export const createRequest = async (
  userId: string,
  documentType: string,
  documentTypeName: string,
  purpose: string,
  copies: number,
  additionalDetails?: string,
  fee?: number
): Promise<DocumentRequest> => {
  const response = await fetch(`${API_BASE_URL}/requests.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      documentType,
      documentTypeName,
      purpose,
      copies,
      additionalDetails,
      fee,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create request');
  }
  
  const request = await response.json();
  return mapRequestFromBackend(request);
};

export const updateRequestStatus = async (
  requestId: string,
  status: RequestStatus,
  note?: string
): Promise<DocumentRequest> => {
  const response = await fetch(`${API_BASE_URL}/requests.php?id=${requestId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status, note }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update request status');
  }
  
  const request = await response.json();
  return mapRequestFromBackend(request);
};

export const markRequestAsPaid = async (requestId: string): Promise<DocumentRequest> => {
  const response = await fetch(`${API_BASE_URL}/requests.php?id=${requestId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ hasPaid: true }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to mark request as paid');
  }
  
  const request = await response.json();
  return mapRequestFromBackend(request);
};

export const markReceiptUploaded = async (requestId: string): Promise<DocumentRequest> => {
  const response = await fetch(`${API_BASE_URL}/requests.php?id=${requestId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ hasUploadedReceipt: true }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to mark receipt as uploaded');
  }
  
  const request = await response.json();
  return mapRequestFromBackend(request);
};

export const searchRequests = async (query: string): Promise<DocumentRequest[]> => {
  const response = await fetch(`${API_BASE_URL}/search.php?query=${encodeURIComponent(query)}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to search requests');
  }
  
  const requests = await response.json();
  return requests.map(mapRequestFromBackend);
};

export const getRequestStatistics = async (): Promise<{
  total: number;
  pending: number;
  processing: number;
  approved: number;
  completed: number;
  rejected: number;
}> => {
  const response = await fetch(`${API_BASE_URL}/statistics.php`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch statistics');
  }
  
  return await response.json();
};

// Helper function to map backend response format to frontend format
const mapRequestFromBackend = (backendRequest: any): DocumentRequest => {
  return {
    id: backendRequest.id,
    userId: backendRequest.user_id,
    documentType: backendRequest.document_type,
    documentTypeName: backendRequest.document_type_name,
    purpose: backendRequest.purpose,
    additionalDetails: backendRequest.additional_details,
    copies: parseInt(backendRequest.copies),
    status: backendRequest.status as RequestStatus,
    createdAt: backendRequest.created_at,
    updatedAt: backendRequest.updated_at,
    fee: parseFloat(backendRequest.fee),
    hasPaid: backendRequest.has_paid === '1' || backendRequest.has_paid === true,
    hasUploadedReceipt: backendRequest.has_uploaded_receipt === '1' || backendRequest.has_uploaded_receipt === true,
    timeline: backendRequest.timeline.map((item: any): RequestTimelineItem => ({
      id: item.id,
      step: item.step,
      status: item.status as 'completed' | 'current' | 'pending',
      date: item.date,
      note: item.note
    }))
  };
};
```

2. **Update the AuthContext to use the API for authentication**

```typescript
// Modify src/contexts/AuthContext.tsx to use the loginUser function
import { loginUser } from '../services/api';

// Inside the login function:
const login = async (email: string, password: string) => {
  try {
    const user = await loginUser(email, password);
    setUser(user);
    return user;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
```

3. **Update your components to use the API functions instead of mock data**

For example, in your dashboard components:

```typescript
import { getUserRequests, getRequestStatistics } from '../services/api';

// Replace current data fetching code with API calls
```

## Testing the Connection

1. **Start your PHP server** (XAMPP, WAMP, etc.)
2. **Start your React development server**
3. **Try to log in** with one of the demo accounts:
   - Student: student@school.edu / password
   - Registrar: registrar@school.edu / password
   - Admin: admin@school.edu / password
4. **Create a test document request** and verify it appears in the database
5. **Test other functions** like updating status, uploading receipts, etc.

## Security Considerations

1. **Password Security**
   - The example uses plain text passwords for simplicity
   - In production, use PHP's `password_hash()` and `password_verify()` functions

2. **Add JWT Authentication**
   - Implement JSON Web Token (JWT) for secure authentication
   - Create a `jwt.php` file for token generation and verification

3. **Implement HTTPS**
   - Always use HTTPS in production
   - Configure your web server with an SSL certificate

4. **SQL Injection Protection**
   - The example uses `real_escape_string()` for basic protection
   - Consider using prepared statements for better security

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure your `.htaccess` file is properly configured
   - Add the CORS headers to all PHP files
   - Make sure your server allows `.htaccess` overrides

2. **Database Connection Issues**
   - Verify database credentials in `config.php`
   - Check that MySQL service is running
   - Ensure your database user has proper permissions

3. **API Call Failures**
   - Check browser console for errors
   - Verify API endpoint URLs are correct
   - Test API endpoints directly using Postman or similar tools

4. **Authentication Problems**
   - Clear browser storage/cookies
   - Verify user credentials in the database
   - Check for any typos in email or password comparisons

### Debugging Tips

1. Add error logging to your PHP files:
   ```php
   error_log('Debug message', 0);
   ```

2. Test API endpoints directly using tools like Postman or cURL

3. Enable PHP error display for development:
   ```php
   ini_set('display_errors', 1);
   ini_set('display_startup_errors', 1);
   error_reporting(E_ALL);
   ```

4. Check server error logs:
   - Apache: /var/log/apache2/error.log
   - XAMPP: /xampp/apache/logs/error.log
