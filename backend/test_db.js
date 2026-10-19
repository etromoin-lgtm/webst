

async function testSystem() {
  console.log("Testing POST /api/admin/blogs...");
  const postRes = await fetch('http://localhost:5000/api/admin/blogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Test SQLite Blog',
      content: '<p>This is a rich text test.</p>',
      author_id: 'Admin',
      image_url: ''
    })
  });
  const postData = await postRes.json();
  console.log('POST Result:', postData);

  console.log("\nTesting GET /api/admin/blogs...");
  const getRes = await fetch('http://localhost:5000/api/admin/blogs');
  const getData = await getRes.json();
  console.log('GET Result:', getData.blogs.map(b => b.title));
}

testSystem();
