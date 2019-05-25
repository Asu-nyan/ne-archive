const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT;
const user = process.env.MONGO_USER;
const password = process.env.MONGO_PW;
mongoose.connect(`mongodb+srv://${user}:${password}@bs-projects-auzep.mongodb.net/test?retryWrites=true`, {useNewUrlParser: true});
const schema = new mongoose.Schema({ content: 'string', date: 'string', created_at: 'string' });
const List = mongoose.model('List', schema);
app.use(express.static('public'));

app.get('/', (req, res) => {
    List.find({}, (err, lists) => {
        if(err) console.log(err);
        let links = [];
        lists.reverse().forEach(li => links.push(li.date));
        let uniq = [ ...new Set(links) ];
        links = uniq.map(li => {
            return `<a href="/${li}">Listen vom ${li}</a>`;
        });
        res.send(style(links.join('<br>')));
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
        res.send(style(html));
    });
});

app.listen(port, () => console.log('Listening on Port ' + port));

function style(content) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="/style.css">
        <title>WebCC</title>
        <style>
        * {
            cursor: default !important;
        }
        a {
            text-decoration: none;
        }
        </style>
    </head>
    <body>
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <a class="navbar-brand" href="/">WebCC</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01"
                aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarColor01">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <a class="nav-link" href="/">Home</a>
                    </li>
                </ul>
            </div>
        </nav>
        <br>
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    ${content}
                </div>
                <div class="col-md-8"></div>
            </div>
        </div>
    </body>
    </html>
    `;
}
