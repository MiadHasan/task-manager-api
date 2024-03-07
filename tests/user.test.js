const request = require('supertest');
const app =  require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
        name: 'Miad',
        email: 'miad@example.com',
        password: 'pass1234'
    }).expect(201)

    //Asser that the database has been changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull()

    //Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Miad',
            email: 'miad@example.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('pass1234')
})

test('Should not log in nonexisting user', async() => {
    await request(app)
    .post('/users/login')
    .send({
        email: 'miad',
        password: userOne.password
    }).expect(400)
})

test('Should log in existing user', async() => {
    const response = await request(app)
        .post('/users/login')
        .send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(response.body.user._id);
    
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Shoulg get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthorizated user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', 'Bearer')
        .send()
        .expect(401)
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for authenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    const user = await User.findById(userOneId);
    expect(user).toBeNull()
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user field', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Hasan'
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toBe('Hasan')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Hasan'
        })
        .expect(400)
})