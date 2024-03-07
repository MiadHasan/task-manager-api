require('./db/mongoose')
const express = require('express');
const userRouter = require('../src/routers/user');
const taskRouter = require('../src/routers/task');

const app = express();

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app;