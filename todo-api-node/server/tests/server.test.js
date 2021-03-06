const expect = require('expect');
const requst = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('Should create a new todo', (done) => {
        var text = 'Test todo';

        requst(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('Should not create todo with invalid body data', (done) => {
        requst(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('Should get all todos', (done) => {
        requst(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('Should return todo doc', (done) => {
        requst(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('Should not return todo doc created by other user', (done) => {
        requst(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('Should return 404 if todo not found', (done) => {
        requst(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('Should return 404 for non-object ids', (done) => {
        requst(app)
            .get('/todos/123')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('Should remove a todo', (done) => {
        var id = todos[1]._id.toHexString();
        requst(app)
            .delete(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(id);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(id).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done());
            });
    });

    it('Should not remove a todo of another user', (done) => {
        var id = todos[0]._id.toHexString();
        requst(app)
            .delete(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(id).then((todo) => {
                    expect(todo).toExist();
                    done();
                }).catch((e) => done());
            });
    });

    it('Should return 404 if todo not found', (done) => {
        requst(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    });

    it('Should return 404 for non-object ids', (done) => {
        requst(app)
            .delete('/todos/123')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('Should update the todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        var text = 'New text';

        requst(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)            
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.text).toBe(text);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done)
    });

    it('Should not update the todo of another user', (done) => {
        var hexId = todos[0]._id.toHexString();
        var text = 'New text';

        requst(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)            
            .send({
                completed: true,
                text
            })
            .expect(404)
            .end(done)
    });

    it('Should clear completedAt when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString();
        var text = 'This should be the new text!!';

        requst(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)   
            .send({
                completed: false,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
            })
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('Should return user if authenticated', (done) => {
        requst(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            }).end(done);
    });

    it('Should return 401 if not authenticated', (done) => {
        requst(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            }).end(done);
    });
});

describe('POST /users', () => {
    it('Should create a user', (done) => {
        var email = 'example@example.com';
        var password = '123mnb!';

        requst(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            }).end((err) => {
                if (err) {
                    return done(err);
                }

                User.findOne({ email }).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('Should return validation errors if request is invalid', (done) => {
        requst(app)
            .post('/users')
            .send({
                email: '1234',
                password: '123'
            })
            .expect(400)
            .end(done);
    });

    it('Should not create user if email is in use', (done) => {
        requst(app)
            .post('/users')
            .send({ email: users[0].email, password: 'password' })
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('Should login a user', (done) => {
        requst(app)
            .post('/users/login')
            .send({ email: users[1].email, password: users[1].password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.toObject().tokens[1]).toMatchObject({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            });
    });

    it('Should return error when auth token is not returned', (done) => {
        requst(app)
            .post('/users/login')
            .send({ email: users[1].email, password: users[1].password + 'add' })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e) => done(e));
            });
    })

    it('Should return incorrect password for existing user', (done) => {
        requst(app)
            .post('/users/login')
            .send({ email: users[0].email, password: 'pwd123' })
            .expect(400)
            .end(done);
    });

    it('Should return error for non existing user', (done) => {
        requst(app)
            .post('/users/login')
            .send({ email: 'nonexisting@test.com', password: 'pwd123' })
            .expect(400)
            .end(done);
    });
});

describe('DELETE /users/me/token', () => {
    it('Should remove auth token on logout', (done) => {
        requst(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});