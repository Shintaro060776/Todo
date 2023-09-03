const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3001;

// MongooseとMongoDBへの接続
const MONGO_URI = 'mongodb+srv://shintaro060776:Shin20090317!@cluster0.awm2tgo.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('データベースに接続しました');
    })
    .catch(err => {
        console.error('データベース接続エラー:', err);
    });

// タスクモデルの定義
const Task = mongoose.model('Task', {
    date: String,
    title: String,
    task: String
});

// JSONを扱うためのミドルウェア
app.use(express.json());
app.use(cors());

// POSTリクエストのエンドポイント
app.post('/tasks', async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.send(tasks);
    } catch (error) {
        res.status(500).send(error);
    }
})

app.get('/', (req, res) => {
    res.send('Welcome to my API');
});

app.put('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

// 削除のエンドポイント
app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});