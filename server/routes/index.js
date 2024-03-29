module.exports = (app) => {
    // connect routes to controllers
    app.post('/post', (req, res) => {
        console.log("Connected to Front-end");
        res.redirect('/');
    })

    app.get('/', (req, res) => {
        console.log('server is running')
    });
}