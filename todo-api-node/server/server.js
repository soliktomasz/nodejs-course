var mongoose = require('mongoose');

mongoose.PromiseProvider = global.Promise;
mongoose.connect('mongodb://localhost:27017/Todos');

var Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

// var newTodo = new Todo({
//     text: 'Cook Dinner'
// });

// newTodo.save().then((doc) => {
//     console.log('Saved todo', doc);
// }, (e) => {
//     console.log('Unable to save todo');
// });

var myTodo = new Todo({
    text: 'Clean kitchen',
    completed: true,
    completedAt: Date.now()
})

myTodo.save().then((doc) => {
    console.log('Saved todo', doc);
}, (e) => {
    console.log('Unable to save todo');
});