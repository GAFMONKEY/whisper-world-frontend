// Utility to setup Alice user with correct UUID
export const setupAliceUser = () => {
    const aliceUser = {
        id: '00000000-0000-0000-0000-000000000000',
        firstName: 'Alice',
        lastName: 'Anderson',
        email: 'alice.anderson@example.com',
        gender: 'male', // Backend hat diese Daten
        birthDate: '1998-02-14'
    };

    localStorage.setItem('user', JSON.stringify(aliceUser));
    console.log('🔧 Setup Alice user with correct UUID:', aliceUser.id);

    return aliceUser;
};

// Check if user is properly set up
export const getCurrentUser = () => {
    let user = JSON.parse(localStorage.getItem('user') || '{}');

    // If no valid user or old user ID, setup Alice
    if (!user.id || user.id === 'alice-smith-id' || typeof user.id !== 'string' || user.id.length < 10) {
        user = setupAliceUser();
    }

    return user;
};
