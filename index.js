import  express from "express";
import bodyParser from "body-parser";
import fs from "fs"

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let Data;

fs.readFile('post.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading post.json:', err);
        return;
    }
     Data = JSON.parse(data);

});

app.get("/",(req, res)=>{
    res.render("index.ejs", {posts:Data} );
});


app.get('/post/:id', (req, res) => {
    const postId = req.params.id;
    const post = Data.find(post => post.id == postId);
    if (!post) {
        res.status(404).send('Post not found');
    } else {
        res.render('post.ejs', { post });
    }
});

app.get("/contact",(req,res)=>{
    res.render("contact.ejs");
});

app.post("/submit", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const comment = req.body.text;
    const data = `\nName:${name}\nEmail:${email}\nComment:${comment}\n`
    fs.appendFile("contact.txt",data, (err)=>{
            if(err){
                res.end(`<h1>Something went wrong, please restart the server</h1>`)
            }
            else{
                res.redirect("/")
            }
    })
});

app.get("/createBlog",(req, res)=>{
    res.render("create_blog.ejs")
});

app.post('/createBlog', (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const content = req.body.content;
    const currentDate = new Date().toISOString().slice(0, 10);

    let Data = [];
    try {
        Data = JSON.parse(fs.readFileSync('post.json'));
    } catch (error) {
        console.error('Error reading posts.json:', error);
    }
    const id = Data.length + 1;
    const newPost = {
        id,
        title,
        author,
        date: currentDate,
        content
    };

    Data.push(newPost);
    fs.writeFileSync('post.json', JSON.stringify(Data, null, 2));
    res.redirect('/');
});

app.listen(3000, ()=>{
    console.log("listning on port 3000");
})