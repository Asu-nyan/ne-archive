const { JSDOM } = require("jsdom");
const axios = require('axios');
const mongoose = require('mongoose');
const password = 'rachel_0603';
mongoose.connect(`mongodb+srv://user:${password}@bs-projects-auzep.mongodb.net/test?retryWrites=true`, {useNewUrlParser: true});
const schema = new mongoose.Schema({ content: 'string', date: 'string', created_at: 'string' });
const List = mongoose.model('List', schema);


save();
setInterval(()=> {
    save();
}, 1000*61);


async function save() {
    const text = await axios.get('https://bs.to/');
    const dom = new JSDOM(text.data, {
        contentType: "text/html",
    });
    const neModule = dom.window.document.querySelector('#newest_episodes');
    const links = neModule.querySelectorAll('a');
    links.forEach(a => a.href="");
    const listContent = neModule.innerHTML.replace(/\t+/g, ' ');
    const d = new Date();
    const hour = fig(d.getHours().toString());
    const minute = fig(d.getMinutes().toString());
    const date = `${ d.getDate() }-${ fig((d.getMonth()+1).toString()) }-${ d.getFullYear() } ${ hour }:${ minute }`;
    const list = new List({content: listContent, date: date.split(' ')[0], created_at: date});
    list.save((err) => {
        if(err) console.log(err);
        console.log(date + ' List saved!');
    });
}

function fig(arg) {
    if(arg.length < 2) {
        return "0"+arg;
    } else return arg;
}