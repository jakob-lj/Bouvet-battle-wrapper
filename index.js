const express = require("express")
const action = require("./handle")
const app = express()

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.get("Origin") || "*"); // This is borrowed from the internet ass all fields had to be set, and we were sick of gitlab and their urls
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
    res.header("Access-Control-Expose-Headers", "Content-Length");
    res.header(
        "Access-Control-Allow-Headers",
        "Accept, Authorization, Content-Type, X-Requested-With, Range"
    );
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    } else {
        return next();
    }
});

app.get("/api/info", (req, res) => {
    res.send({
        "name": "name",
        "team": "team"
    })
})


app.post("/api/command", (req, res) => {
    const command = action(req)
    res.send(command)
})

app.listen(9000, () => {
    console.log("Listening on 9000")
})