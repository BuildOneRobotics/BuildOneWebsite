# API Documentation

## Base URL
`https://your-vercel-domain.vercel.app/api`

## CORS
All endpoints allow requests from: `https://admin-dashboard-phi-green-90.vercel.app`

## Endpoints

### GET /api/posts
Get all forum posts.

**Response:**
```json
{
  "posts": [
    {
      "id": 1234567890,
      "title": "Post title",
      "description": "Post description",
      "author": "username",
      "date": "1/1/2024",
      "pinned": false,
      "isAnnouncement": true
    }
  ]
}
```

### DELETE /api/delete-post?id={postId}
Delete a specific post.

**Query Parameters:**
- `id` - Post ID to delete

**Response:**
```json
{
  "success": true,
  "message": "Post {id} deleted"
}
```

### POST /api/announcements
Create a new announcement.

**Request Body:**
```json
{
  "title": "Announcement title",
  "description": "Optional description",
  "imageUrl": "Optional image URL",
  "author": "username"
}
```

**Response:**
```json
{
  "success": true,
  "post": { /* new post object */ }
}
```

### GET /api/stats
Get forum statistics.

**Response:**
```json
{
  "totalPosts": 10,
  "announcements": 5,
  "pinnedPosts": 2,
  "totalComments": 25
}
```
