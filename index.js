import  express from "express";
import mongoose, {Schema} from "mongoose";

const app = express();
const port = 3000;


// mongodb connections
mongoose.connect("mongodb://localhost:27017/Gourab")
.then(()=>{
    console.log("mongodb is connected");
}).catch((err) => {
    console.log(err.message, "connection failed");
})



app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        upperCase: true,
    },
    author: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
}, {timestamps: true});

const Blog =  mongoose.model("Blog",blogSchema);

const commentsSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String, 
        required: true
    },
    comment:{
        type: String,
        required: true,
    }
}, {timestamps: true});

const Comments = mongoose.model("Comments",commentsSchema);


app.get("/",async(req, res)=>{
    try {
        const blogPost = await Blog.find({});
        res.status(200).render("index.ejs", {Blog:blogPost});
    } catch (error) {
        console.log(error.message);
    }
});


app.get('/post/:id', (req, res) => {
    const postId = req.params.id;
    const post = Blog.find(post => post.id == postId);
    if (!post) {
        res.status(404).send('Post not found');
    } else {
        res.render('post.ejs', { post });
    }
});

app.get("/contact",(req,res)=>{
    res.render("contact.ejs");
});

app.post("/submit",  async(req, res) => { 
   const result = await Comments.create({
        name: req.body.name,
        email: req.body.email,
        comment: req.body.comment
    });

    console.log(result);

    return res.status(200).redirect("index.ejs")
});

app.get("/createBlog",(req, res)=>{ 
    res.render("create_blog.ejs")
});

app.post('/createBlog', async(req, res) => {
   const blogs = await Blog.create({
    title : req.body.title,
    author: req.body.author,
    content: req.body.content,
    time: new Date()
   });
   console.log(blogs);

   res.status(200).redirect("index.ejs")
});

app.listen(port, ()=>{
    console.log("listning on port 3000");
})