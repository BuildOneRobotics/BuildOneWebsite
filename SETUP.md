# Setup Instructions for Cross-Device Forum Posts

## Option 1: JSONBin (Recommended - Free & Easy)

1. Go to https://jsonbin.io/
2. Sign up for free account
3. Create a new bin
4. Copy your Bin ID and API Key
5. Update `src/utils/storage.js`:
   - Replace `YOUR_BIN_ID` with your Bin ID
   - Replace `YOUR_API_KEY` with your API Key

## Option 2: Firebase (More Features)

1. Go to https://firebase.google.com/
2. Create a new project
3. Enable Firestore Database
4. Get your config and update storage.js

## Current Status

Posts are saved to localStorage (device-only). Once you add API credentials above, posts will sync across all devices automatically.

## Security Notes

### Admin Credentials
- Passwords are hashed in `src/utils/auth.js`
- Not stored in plain text
- For production, use a backend authentication service

### Comment Auto-Deletion
- Comments older than 3 months are automatically deleted
- Announcement posts are kept permanently
- Cleanup happens on page load
