const GIST_ID = process.env.GIST_ID || 'YOUR_GIST_ID';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || 'YOUR_TOKEN';

export async function loadFromGist() {
  try {
    const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    const data = await response.json();
    const content = data.files['forum-data.json'].content;
    return JSON.parse(content);
  } catch (error) {
    return { posts: [] };
  }
}

export async function saveToGist(data) {
  try {
    await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        files: {
          'forum-data.json': {
            content: JSON.stringify(data, null, 2)
          }
        }
      })
    });
    return true;
  } catch (error) {
    return false;
  }
}
