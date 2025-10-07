# 🔧 Environment Variables Setup Guide

## ✅ **Fixed Issues**

### **1. Package.json Security Fix**

- ✅ **Removed hardcoded Supabase project ID** from `db:generate-types` script
- ✅ **Now uses environment variable**: `$SUPABASE_PROJECT_ID`

### **2. Environment Variables Required**

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
# Get these from your Supabase Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_PROJECT_ID=your_supabase_project_id
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Cashfree Configuration
# Get these from Cashfree Dashboard > Developers > API Keys
CASHFREE_CLIENT_ID=your_cashfree_client_id
CASHFREE_CLIENT_SECRET=your_cashfree_client_secret
CASHFREE_BASE_URL=https://payout-gamma.cashfree.com  # Use gamma for sandbox
# CASHFREE_BASE_URL=https://payout-api.cashfree.com  # Use this for production

# Cashfree Configuration (Mock for now)
CASHFREE_ENVIRONMENT=mock
CASHFREE_CLIENT_ID=mock_client_id
CASHFREE_CLIENT_SECRET=mock_client_secret

# Twilio Configuration (if using phone verification)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Other
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=http://localhost:3000
```

## 🔍 **How to Get Your Supabase Values**

### **Step 1: Go to Supabase Dashboard**

1. Visit [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project

### **Step 2: Get API Keys**

1. Go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project Reference ID** → `SUPABASE_PROJECT_ID`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### **Step 3: Create .env.local File**

```bash
# In your project root directory
touch .env.local
```

Then paste the environment variables with your actual values.

## 🚀 **Updated Scripts Usage**

### **Generate Database Types**

```bash
# Now works with environment variable
npm run db:generate-types
```

### **Development**

```bash
# Start development server
npm run dev
```

## 🔒 **Security Best Practices**

### **✅ What's Now Secure**

- ✅ No hardcoded credentials in `package.json`
- ✅ Environment variables in `.env.local` (gitignored)
- ✅ Separate keys for different environments

### **⚠️ Important Notes**

- **Never commit** `.env.local` to git
- **Use different keys** for development/production
- **Rotate keys regularly** for production
- **Keep service role key secret** (server-side only)

## 🛠️ **Next Steps**

1. **Create `.env.local`** with your actual Supabase values
2. **Run database migration**: Use the clean SQL file we created
3. **Generate types**: Run `npm run db:generate-types`

## 📋 **Verification Checklist**

- [ ] `.env.local` file created with actual values
- [ ] `package.json` no longer has hardcoded project ID
- [ ] Database migration completed successfully
- [ ] Type generation works: `npm run db:generate-types`

**Your Supabase configuration is now secure and properly set up!** 🎉
