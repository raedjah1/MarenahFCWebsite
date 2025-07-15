# Firebase Setup Guide for Marenah FC Website

This guide will walk you through setting up Firebase for the Marenah FC website, including Authentication, Firestore, and Storage.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Google account
- Firebase CLI (optional but recommended)

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `marenah-fc` (or your preferred name)
4. Enable/disable Google Analytics as needed
5. Wait for project creation to complete

## 2. Enable Firebase Services

### Enable Authentication
1. In Firebase Console, go to **Authentication** > **Get started**
2. Go to **Sign-in method** tab
3. Enable **Email/Password** provider
4. Save changes

### Enable Firestore Database
1. Go to **Firestore Database** > **Create database**
2. Choose **Start in production mode** (we'll update rules later)
3. Select a location (choose closest to your users)
4. Wait for database creation

### Enable Storage
1. Go to **Storage** > **Get started**
2. Start in production mode
3. Choose same location as Firestore
4. Done

## 3. Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click **Add app** > **Web app** (</>)
4. Register app with nickname: `marenah-fc-web`
5. Copy the configuration object

## 4. Configure Environment Variables

1. In your project root, update the `.env` file:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Optional: Enable emulators in development
VITE_USE_FIREBASE_EMULATORS=false

# Application Configuration
VITE_APP_NAME=Marenah FC
VITE_APP_VERSION=1.0.0
```

2. Replace the placeholder values with your actual Firebase config values

## 5. Set Up Firestore Security Rules

1. In Firebase Console, go to **Firestore Database** > **Rules**
2. Replace the default rules with the contents of `firestore.rules` file
3. Click **Publish**

The rules allow:
- Public read access to team members, matches, and products
- Admin-only write access to all collections
- User-specific access to carts and orders

## 6. Set Up Admin Users

### Method 1: Using Firebase Console
1. Go to **Authentication** > **Users**
2. Click **Add user**
3. Enter admin email and password
4. Save the user

### Method 2: Using Firebase Admin SDK (Recommended for production)

Create a Node.js script to set custom claims:

```javascript
const admin = require('firebase-admin');

// Initialize Admin SDK with service account
const serviceAccount = require('./path/to/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setAdminClaim(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true, role: 'admin' });
    console.log(`Admin claims set for ${email}`);
  } catch (error) {
    console.error('Error setting admin claims:', error);
  }
}

// Set admin for your email
setAdminClaim('admin@marenahfc.com');
```

### Method 3: Update Admin Emails in Code
Update the `ADMIN_EMAILS` array in `src/firebase/auth.ts`:

```typescript
const ADMIN_EMAILS = [
  'admin@marenahfc.com',
  'manager@marenahfc.com',
  'your-email@example.com', // Add your email here
];
```

## 7. Install Dependencies

The Firebase SDK should already be installed. If not:

```bash
npm install firebase
```

## 8. Initialize Sample Data (Optional)

Create some sample data to test the application:

### Sample Team Members
```javascript
// Use the admin dashboard or run this in browser console
const samplePlayers = [
  {
    name: "John Doe",
    role: "player",
    position: "Forward",
    jerseyNumber: 10,
    isActive: true
  },
  {
    name: "Jane Smith",
    role: "coach",
    title: "Head Coach",
    isActive: true
  }
];
```

## 9. Development Setup

### Option 1: Use Firebase Emulators (Recommended for development)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init
```

4. Select:
   - Firestore
   - Authentication
   - Storage
   - Emulators

5. Start emulators:
```bash
firebase emulators:start
```

6. Set environment variable:
```env
VITE_USE_FIREBASE_EMULATORS=true
```

### Option 2: Use Production Firebase (Simpler setup)

Just use the production Firebase project with the environment variables set above.

## 10. Test the Setup

1. Start your development server:
```bash
npm run dev
```

2. Try to access the admin sign-in page: `http://localhost:5173/signin`

3. Sign in with your admin credentials

4. Check that you can access the admin dashboard: `http://localhost:5173/admin`

## 11. Production Deployment

### Environment Variables
Set up environment variables in your hosting platform:

**Vercel:**
```bash
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
# ... add all other VITE_FIREBASE_* variables
```

**Netlify:**
Add environment variables in Netlify dashboard or via CLI.

### Security Considerations

1. **Never commit `.env` files** - They're already in `.gitignore`

2. **Use different Firebase projects** for development and production

3. **Restrict API key usage** in Google Cloud Console:
   - Go to Google Cloud Console
   - Navigate to APIs & Services > Credentials
   - Edit your API key
   - Add HTTP referrer restrictions

4. **Set up Firebase App Check** for production (optional but recommended)

## 12. Troubleshooting

### Common Issues

**Error: "Firebase configuration is missing"**
- Check that all environment variables are set correctly
- Ensure variable names start with `VITE_`
- Restart development server after changing `.env`

**Error: "Permission denied"**
- Check Firestore security rules
- Ensure user has admin privileges
- Verify custom claims are set correctly

**Error: "Auth domain not authorized"**
- In Firebase Console, go to Authentication > Settings
- Add your domain to authorized domains

**Error: "Storage bucket not found"**
- Ensure Storage is enabled in Firebase Console
- Check that bucket name matches in environment variables

### Debug Mode

Enable debug logging:

```javascript
// Add to your main.tsx or App.tsx
if (import.meta.env.DEV) {
  console.log('Firebase config:', {
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  });
}
```

## 13. Backup and Monitoring

### Set up Firestore Backups
1. Go to Firebase Console > Firestore > Usage
2. Set up automatic backups (paid feature)

### Monitor Usage
1. Go to Firebase Console > Usage and billing
2. Set up budget alerts
3. Monitor authentication and database usage

## 14. Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [React Firebase Integration](https://firebase.google.com/docs/web/setup)

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify all environment variables are set
3. Check Firebase Console for usage and errors
4. Review Firestore security rules
5. Ensure admin user is properly configured

For additional help, contact the development team or refer to Firebase documentation.