const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.json({
        message: 'Nurupo!'
    })
});
isValidTweet = (tweet) => {
    return tweet.name  && tweet.name.toString().trim()  !== '' &&
        tweet.content && tweet.content.toString().trim() !== '';
}

app.post('/nurupo', (req, res) => {
    if(isValidTweet(req.body)){
        const tweet = {
            name: req.body.name.toString(),
            content: req.body.content.toString()
        };
        console.log(tweet);
    }else{
        res.status(422);
        res.json({message: 'Specify name and content'});
    }
});

app.listen(5000, () => {
    console.log('Listening on http://localhost:5000');
});