const API_URL = 'https://api.jsonbin.io/v3/b/YOUR_BIN_ID';
const API_KEY = '$2a$10$YOUR_API_KEY';

export const savePosts = async (posts) => {
  localStorage.setItem('forumPosts', JSON.stringify(posts));
  
  try {
    await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY
      },
      body: JSON.stringify({ posts })
    });
  } catch (error) {
    console.error('Sync error:', error);
  }
};

export const loadPosts = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: { 'X-Master-Key': API_KEY }
    });
    const data = await response.json();
    const posts = data.record.posts || [];
    localStorage.setItem('forumPosts', JSON.stringify(posts));
    return posts;
  } catch (error) {
    const saved = localStorage.getItem('forumPosts');
    return saved ? JSON.parse(saved) : [];
  }
};
