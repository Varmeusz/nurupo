const express = require('express');
const cors = require('cors');
const monk = require('monk');
const app = express();
var path = require("path");
const db = monk('localhost/nurupo');
const nurupos = db.get('nurupos');

const fs = require('fs');
const stream = require('stream');

const formidable = require('formidable');
const { time } = require('console');
const { create } = require('domain');
app.use(cors());

app.get('/', (req, res) => {
    res.json({
        message: 'Nurupo!'
    })
});
isValidRequest = (req) => {
    return tweet.name  && tweet.name.toString().trim()  !== '' &&
        tweet.content && tweet.content.toString().trim() !== '';
}

app.post('/nurupos', (req, res) => {
    var form = new formidable.IncomingForm(),//.parse(req, (err, fields, files) => {
    files = [],
    fields = [];
    form.on('fileBegin', (name, file) => {
        file.path = __dirname + '/uploads/' + file.name
    });
    form.on('field', (field, value) => {
        fields.push([field, value]);
    });
    form.on('file', (field, file) => {
        console.log(file.path);
        files.push([field, file]);
    })
    form.on('end', () => {
        //do something with files and fields

        //save to db
        
        res.status(201);
        res.end();
    });
    form.parse(req);
});
app.post('/nurupo', (req, res) => {
    var form = new formidable.IncomingForm(),
    files = [],
    fields = [];
    form.maxFileSize = 10000000;
    form.on('fileBegin', (name, file) => {
        file.path = __dirname + '/uploads/images/' + file.name
    });
    form.on('field', (field, value) => {
        fields.push([field, value]);
    });
    form.on('file', (field, file) => {
        files.push([field, file]);
    })
    form.on('end', () => {
        //do something with files and fields

        //save to db
        const nurupo = {
            name : fields[0][1],
            file : files[0][1].path,
            created : new Date()
        }
        nurupos
            .insert(nurupo)
            .then(createdNurupo => {
                res.json(createdNurupo._id);
            })
    });
    form.parse(req);
});

app.get("/nurupos", (req,res) => {
    nurupos
        .find({}, {limit: 10, sort: {"_id":-1}})
        .then(nuruposFound => {
            var ids = nuruposFound.reduce((r,e) => {
                r.push([e.name, e._id, e.created]);
                return r;
            }, []);
            res.json(ids);
        })
});
app.get("/uploads", (req, res) => {
    nurupos
        .find( {'_id': req.query.id})
        .then(foundNurupo => {
            // console.log(foundNurupo[0].file);
            // console.log(req.query.id);
            res.sendFile(path.resolve(foundNurupo[0].file));
        })
});
// app.get('/hutaogears.png', (req, res) => {
//     console.log(path.resolve("uploads/images/hutaogears.png"));
//     res.sendFile(path.resolve("uploads/images/hutaogears.png"));
// });
// app.use(express.static('uploads'));

app.listen(5000, () => {
    console.log('Listening on http://localhost:5000');
});