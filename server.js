const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT;
const user = process.env.MONGO_USER;
const password = process.env.MONGO_PW;
mongoose.connect(`mongodb+srv://${user}:${password}@bs-projects-auzep.mongodb.net/test?retryWrites=true`, {useNewUrlParser: true});
const schema = new mongoose.Schema({ content: 'string', date: 'string', created_at: 'string' });
const List = mongoose.model('List', schema);

app.get('/', (req, res) => {
    List.find({}, (err, lists) => {
        if(err) console.log(err);
        let links = [];
        lists.reverse().forEach(li => links.push(li.date));
        let uniq = [ ...new Set(links) ];
        links = uniq.map(li => {
            return `<a href="/${li}">Listen vom ${li}</a>`;
        });
        res.send(links.join('<br>'));
    });
});

app.get('/:date', (req, res) => {
    List.find({ date: req.params.date }, (err, lists) => {
        if(err) console.log(err);
        let html = '';
        lists.reverse().forEach(li => {
            html += `<h1>${li.created_at}</h1><br>`;
            html += li.content.replace('\n', '<br>');
            html += '<br><hr><br>';
        });
        res.send(html);
    });
});

app.listen(port, () => console.log('Listening on Port ' + port));
