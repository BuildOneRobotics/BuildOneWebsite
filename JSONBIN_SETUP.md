# JSONBin.io Setup for Forum Sync

## Steps to Connect Admin Dashboard to Main Website

### 1. Create JSONBin Account
1. Go to https://jsonbin.io/
2. Sign up for free account
3. Create a new bin (name it "buildone-forum")
4. Initialize with: `{"posts": []}`

### 2. Get Your Credentials
- Copy your **Bin ID** (looks like: `65abc123def456789`)
- Copy your **API Key** (looks like: `$2a$10$abc123...`)

### 3. Add to Vercel (Main Website)
In your BuildOne website Vercel project:
```
JSONBIN_URL=https://api.jsonbin.io/v3/b/YOUR_BIN_ID
JSONBIN_KEY=$2a$10$YOUR_API_KEY
REACT_APP_JSONBIN_URL=https://api.jsonbin.io/v3/b/YOUR_BIN_ID
REACT_APP_JSONBIN_KEY=$2a$10$YOUR_API_KEY
```

### 4. How It Works
- Admin creates announcement → Saves to JSONBin
- Forum loads posts → Reads from JSONBin
- Both sites stay in sync automatically
- Comments also saved to JSONBin

### 5. Test It
1. Login to admin dashboard
2. Create announcement
3. Check main website forum
4. Announcement should appear instantly!
