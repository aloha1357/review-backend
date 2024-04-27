// tests/testConfig.js
const testUsers = {
    user1: {
        email: 'as95630as@gmail.com',
        password: 'asd8899599',
        username: 'aloha'
    },
    // user2: {
    //     email: 'user2@example.com',
    //     password: 'password2',
    //     username: 'user2'
    // }
};
test('it works', () => {
    expect(true).toBe(true);
});
module.exports = {
    testUsers
};