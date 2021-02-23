const express = require('express');
const cors = require('cors');
const monk = require('monk');
const path = require("path");
const formidable = require('formidable');
const fs = require('fs');
const app = express();
const db = monk('localhost/nurupo');
const nurupos = db.get('nurupos');
app.use(cors());

app.get('/', (req, res) => {
    res.json({
        message: 'Nurupo!'
    })
});

app.post('/nurupos', (req, res) => {
    var form = new formidable.IncomingForm(),
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
    nurupos
        .count({})
        .then(count => {
            if(count>10){
                nurupos
                .find({}, {limit: 1, sort: {"_id": +1}})
                .then(last => {
                    fs.unlink(last[0].file.toString(), (err) =>{
                        if(err) throw err;
                    })
                    nurupos.remove({"_id":last[0]._id});
                })
            }
        })
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
        .find({'_id': req.query.id})
        .then(foundNurupo => {
            res.sendFile(path.resolve(foundNurupo[0].file));
        });
});

app.listen(5001, () => {
    console.log('Listening on http://localhost:5001');
});
