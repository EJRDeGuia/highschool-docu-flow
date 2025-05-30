
# Local Development Setup Guide

This guide will walk you through setting up the Pinagtongulan Integrated National Highschool Document Request System locally on your machine.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- A **Supabase account** - [Sign up here](https://supabase.com/)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## Step 1: Clone the Repository

1. Open your terminal/command prompt
2. Navigate to the directory where you want to store the project
3. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd document-request-system
   ```

## Step 2: Install Dependencies

1. In the project root directory, install the required packages:
   ```bash
   npm install
   ```
   
   Or if you prefer yarn:
   ```bash
   yarn install
   ```

2. Wait for all dependencies to download and install (this may take a few minutes)

## Step 3: Set Up Supabase Project

### Create a New Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Fill in the project details:
   - **Name**: `document-request-system` (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your location
5. Click "Create new project"
6. Wait for the project to be created (this takes 2-3 minutes)

### Get Your Supabase Credentials

1. Once your project is ready, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-ref.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

### Configure Authentication URLs

1. In your Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Set the following URLs:
   - **Site URL**: `http://localhost:8080`
   - **Redirect URLs**: Add `http://localhost:8080/**` (with the wildcard)

## Step 4: Configure Environment Variables

1. In the project root, locate the file `src/integrations/supabase/client.ts`
2. The file should already be configured with the correct Supabase credentials
3. If you need to update them, replace the values in the `createClient` function:
   ```typescript
   const supabaseUrl = "your-project-url-here"
   const supabaseKey = "your-anon-key-here"
   ```

## Step 5: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query and run the following SQL to set up the database tables:

```sql
-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table for additional user data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT NOT NULL,
  student_id TEXT,
  contact_number TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'registrar', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create document_types table
CREATE TABLE public.document_types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  processing_days INTEGER NOT NULL DEFAULT 3,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default document types
INSERT INTO public.document_types (name, description, fee, processing_days) VALUES
('Transcript of Records', 'Official academic transcript', 200.00, 5),
('Certificate of Enrollment', 'Proof of current enrollment', 50.00, 2),
('Certificate of Good Moral Character', 'Character reference certificate', 50.00, 3),
('Diploma Copy', 'Official copy of diploma', 150.00, 7);

-- Create requests table
CREATE TABLE public.requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_code TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  document_type_id INTEGER REFERENCES public.document_types NOT NULL,
  purpose TEXT NOT NULL,
  copies INTEGER NOT NULL DEFAULT 1,
  additional_details TEXT,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Approved', 'Rejected', 'Completed', 'Cancelled')),
  has_paid BOOLEAN DEFAULT FALSE,
  has_uploaded_receipt BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on requests
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Create policies for requests
CREATE POLICY "Users can view their own requests" ON public.requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own requests" ON public.requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requests" ON public.requests
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to generate reference codes
CREATE OR REPLACE FUNCTION generate_reference_code()
RETURNS TEXT AS $$
BEGIN
  RETURN 'REQ-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate reference codes
CREATE OR REPLACE FUNCTION set_reference_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference_code IS NULL OR NEW.reference_code = '' THEN
    NEW.reference_code := generate_reference_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_reference_code_trigger
  BEFORE INSERT ON public.requests
  FOR EACH ROW
  EXECUTE FUNCTION set_reference_code();

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_requests_updated_at
  BEFORE UPDATE ON public.requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

3. Click "Run" to execute the SQL

## Step 6: Create Test Users

1. In the Supabase dashboard, go to **Authentication** → **Users**
2. Click "Add user" and create test accounts:

### Admin User
- **Email**: `admin@school.edu`
- **Password**: `password123`
- **Email Confirmed**: ✓ (check this box)

### Registrar User
- **Email**: `registrar@school.edu`
- **Password**: `password123`
- **Email Confirmed**: ✓ (check this box)

### Student User
- **Email**: `student@school.edu`
- **Password**: `password123`
- **Email Confirmed**: ✓ (check this box)

3. After creating users, go to **SQL Editor** and run this to set up their profiles:

```sql
-- Insert profiles for test users (replace with actual user IDs from auth.users)
INSERT INTO public.profiles (id, name, student_id, contact_number, role)
SELECT 
  id,
  CASE 
    WHEN email = 'admin@school.edu' THEN 'Admin User'
    WHEN email = 'registrar@school.edu' THEN 'Registrar User'
    WHEN email = 'student@school.edu' THEN 'Student User'
  END as name,
  CASE 
    WHEN email = 'student@school.edu' THEN '2024-0001'
    ELSE NULL
  END as student_id,
  '+63 123 456 7890' as contact_number,
  CASE 
    WHEN email = 'admin@school.edu' THEN 'admin'
    WHEN email = 'registrar@school.edu' THEN 'registrar'
    WHEN email = 'student@school.edu' THEN 'student'
  END as role
FROM auth.users 
WHERE email IN ('admin@school.edu', 'registrar@school.edu', 'student@school.edu');
```

## Step 7: Start the Development Server

1. In your terminal, make sure you're in the project root directory
2. Start the development server:
   ```bash
   npm run dev
   ```
   
   Or with yarn:
   ```bash
   yarn dev
   ```

3. The application should start and you'll see output similar to:
   ```
   Local:   http://localhost:8080
   Network: http://192.168.x.x:8080
   ```

4. Open your web browser and navigate to `http://localhost:8080`

## Step 8: Test the Application

### Login with Test Accounts

1. **Student Account**:
   - Email: `student@school.edu`
   - Password: `password123`
   - Can create and view requests

2. **Registrar Account**:
   - Email: `registrar@school.edu`
   - Password: `password123`
   - Can manage and process requests

3. **Admin Account**:
   - Email: `admin@school.edu`
   - Password: `password123`
   - Has full access to all features

### Test Basic Functionality

1. **As a Student**:
   - Create a new document request
   - View your requests
   - Upload a receipt

2. **As a Registrar**:
   - View all pending requests
   - Update request status
   - Verify payments

3. **As an Admin**:
   - Access all areas
   - Manage users
   - View system settings

## Step 9: Enable Email Features (Optional)

To test forgot password and email notifications:

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Configure SMTP settings or use the built-in email service
3. Update the site URL and redirect URLs as needed

## Troubleshooting

### Common Issues and Solutions

1. **"Cannot connect to Supabase"**
   - Check that your Supabase project URL and anon key are correct
   - Ensure your Supabase project is active (not paused)

2. **"Access denied" errors**
   - Verify that Row Level Security policies are set up correctly
   - Check that test users have the correct roles in the profiles table

3. **Page not loading**
   - Make sure the development server is running
   - Check the browser console for any JavaScript errors
   - Verify that all dependencies are installed

4. **Authentication issues**
   - Check that redirect URLs are configured correctly in Supabase
   - Ensure users have confirmed email addresses

5. **Database errors**
   - Verify all SQL commands ran successfully
   - Check the Supabase logs for any database errors

### Getting Help

If you encounter issues:

1. Check the browser console (F12) for error messages
2. Check the terminal where you're running the dev server for errors
3. Look at the Supabase dashboard logs
4. Refer to the [Supabase documentation](https://supabase.com/docs)
5. Check the [Vite documentation](https://vitejs.dev/) for build issues

## Development Tips

1. **Hot Reload**: The development server supports hot reload, so changes will appear automatically
2. **Database Changes**: If you modify the database schema, restart the dev server
3. **Environment**: Always use the development environment for testing
4. **Backup**: Regularly backup your Supabase project data during development

## Next Steps

Once you have the application running locally:

1. Explore the codebase structure
2. Make your desired modifications
3. Test thoroughly with different user roles
4. Consider setting up additional features like file storage
5. Deploy to production when ready

---

**Happy coding!** 🚀

For additional questions or support, refer to the project documentation or contact the development team.
