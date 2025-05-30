
# 🚀 Local Development Setup Guide

This guide will help you set up the **Pinagtongulan Integrated National Highschool Document Request System** on your local machine.

## 📋 Prerequisites

Make sure you have these installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Supabase account** - [Sign up here](https://supabase.com/)

## 🛠️ Quick Setup

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repository-url>
cd document-request-system

# Install dependencies
npm install
```

### 2. Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: `document-request-system`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your location
4. Click **"Create new project"** and wait 2-3 minutes

### 3. Configure Supabase

#### Get Your Credentials
1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy these values:
   - **Project URL** (e.g., `https://xyz.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

#### Update Authentication URLs
1. Go to **Authentication** → **URL Configuration**
2. Set:
   - **Site URL**: `http://localhost:8080`
   - **Redirect URLs**: `http://localhost:8080/**`

#### Update Client Configuration
Replace the values in `src/integrations/supabase/client.ts`:
```typescript
const supabaseUrl = "your-project-url-here"
const supabaseKey = "your-anon-key-here"
```

### 4. Set Up Database

In your Supabase **SQL Editor**, run this script:

```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT NOT NULL,
  student_id TEXT,
  contact_number TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'registrar', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create document types table
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

-- Create request policies
CREATE POLICY "Users can view own requests" ON public.requests
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own requests" ON public.requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own requests" ON public.requests
  FOR UPDATE USING (auth.uid() = user_id);

-- Create functions and triggers
CREATE OR REPLACE FUNCTION generate_reference_code()
RETURNS TEXT AS $$
BEGIN
  RETURN 'REQ-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

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

### 5. Create Test Users

#### In Supabase Dashboard
1. Go to **Authentication** → **Users**
2. Click **"Add user"** and create these accounts:

**Student Account:**
- Email: `student@school.edu`
- Password: `password123`
- ✅ Email Confirmed

**Registrar Account:**
- Email: `registrar@school.edu`
- Password: `password123`
- ✅ Email Confirmed

**Admin Account:**
- Email: `admin@school.edu`
- Password: `password123`
- ✅ Email Confirmed

#### Set User Profiles
Run this in **SQL Editor** after creating users:

```sql
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

### 6. Start Development Server

```bash
npm run dev
```

Your app will be available at: **http://localhost:8080**

## 🧪 Test the Application

### Login Credentials

| Role | Email | Password | Access |
|------|-------|----------|---------|
| **Student** | `student@school.edu` | `password123` | Create/view requests |
| **Registrar** | `registrar@school.edu` | `password123` | Manage/process requests |
| **Admin** | `admin@school.edu` | `password123` | Full system access |

### Test Features

1. **As Student**: Create document requests, upload receipts
2. **As Registrar**: Process pending requests, update statuses  
3. **As Admin**: Access all areas, manage users

## 🚨 Troubleshooting

### Common Issues

**Build Errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Database Connection Issues:**
- Verify Supabase URL and API key
- Check if project is active (not paused)
- Ensure RLS policies are properly set

**Authentication Problems:**
- Confirm redirect URLs in Supabase settings
- Check email confirmation status for test users

### Getting Help

- Check browser console (F12) for error messages
- Review Supabase logs in dashboard
- Ensure all SQL scripts ran successfully

## 🎯 Next Steps

Once running locally:
1. Explore the codebase structure
2. Test all user roles and features
3. Make your desired modifications
4. Deploy to production when ready

---

**Ready to code!** 🎉

Need help? Check the [Supabase docs](https://supabase.com/docs) or [Vite docs](https://vitejs.dev/).
