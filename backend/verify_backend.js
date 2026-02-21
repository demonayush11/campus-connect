const baseUrl = 'http://localhost:5000/api';

async function testBackend() {
    try {
        console.log('--- Testing Authentication ---');
        // 1. Register Senior (Mentor)
        const mentorRes = await fetch(`${baseUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Alice Mentor',
                email: `mentor_${Date.now()}@test.com`,
                password: 'password123',
                role: 'senior',
                department: 'CSE',
                bio: 'Expert in React'
            })
        });
        const mentor = await mentorRes.json();
        if (!mentor.token) throw new Error('Mentor registration failed: ' + JSON.stringify(mentor));
        console.log('Mentor Registered:', mentor.name);

        // 2. Register Junior
        const juniorRes = await fetch(`${baseUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Bob Junior',
                email: `junior_${Date.now()}@test.com`,
                password: 'password123',
                role: 'junior',
                batch: '2026'
            })
        });
        const junior = await juniorRes.json();
        if (!junior.token) throw new Error('Junior registration failed: ' + JSON.stringify(junior));
        console.log('Junior Registered:', junior.name);

        console.log('\n--- Testing Mentorship Hub ---');
        // 3. Create Session (Mentor)
        const sessionRes = await fetch(`${baseUrl}/mentors/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${mentor.token}`
            },
            body: JSON.stringify({
                title: 'React Basics',
                description: 'Learn React from scratch',
                date: new Date().toISOString(),
                duration: 60,
                link: 'http://meet.google.com/abc'
            })
        });
        const session = await sessionRes.json();
        if (!session.id) throw new Error('Create session failed: ' + JSON.stringify(session));
        console.log('Session Created:', session.title);

        // 4. Join Session (Junior)
        const joinRes = await fetch(`${baseUrl}/mentors/sessions/${session.id}/join`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${junior.token}`
            }
        });
        const joinedSession = await joinRes.json();
        console.log('Junior Joined Session:', joinedSession.id);

        console.log('\n--- Testing Study Groups ---');
        // 5. Create Group (Junior)
        const groupRes = await fetch(`${baseUrl}/groups`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${junior.token}`
            },
            body: JSON.stringify({
                name: 'DSA Group',
                description: 'Practice LeetCode',
                subject: 'Algorithms'
            })
        });
        const group = await groupRes.json();
        console.log('Group Created:', group.name);

        // 6. List Groups
        const groupsRes = await fetch(`${baseUrl}/groups`, {
            headers: { 'Authorization': `Bearer ${junior.token}` }
        });
        const groups = await groupsRes.json();
        console.log('Detailed Groups List:', groups.length);

        console.log('\n--- Testing Q&A Forum ---');
        // 7. Create Post (Junior)
        const postRes = await fetch(`${baseUrl}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${junior.token}`
            },
            body: JSON.stringify({
                title: 'How to center a div?',
                content: 'I am struggling with flexbox.',
                tags: ['css', 'frontend']
            })
        });
        const post = await postRes.json();
        console.log('Post Created:', post.title);

        // 8. Comment on Post (Mentor)
        const commentRes = await fetch(`${baseUrl}/posts/${post.id}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${mentor.token}`
            },
            body: JSON.stringify({
                content: 'Use display: flex; justify-content: center; align-items: center;'
            })
        });
        const comment = await commentRes.json();
        console.log('Comment Added by Mentor:', comment.content);

        console.log('\n✅ All Tests Passed Successfully!');

    } catch (error) {
        console.error('\n❌ Test Failed:', error.message);
        process.exit(1);
    }
}

testBackend();
