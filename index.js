import express from "express";
import mongoose, { Schema } from "mongoose";

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/Gourab")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log("MongoDB connection failed:", err.message);
    });

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const blogSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
        uppercase: true,
    },
    author: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);


const commentsSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Comments = mongoose.model("Comments", commentsSchema);

app.get("/", async (req, res) => {
    try {
        const blogPost = await Blog.find({});
        res.status(200).render("index.ejs", { Blog: blogPost });
    } catch (error) {
        console.log("Error:", error.message);
    }
});

app.get('/post/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Blog.findById(postId); // Use findById with _id field
        if (!post) {
            res.status(404).send('Post not found');
        } else {
            res.render('post.ejs', { post });
        }
    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).send('Internal Server Error');
    }
});


app.get("/contact", (req, res) => {
    res.render("contact.ejs");
});

app.post("/submit", async (req, res) => {
    try {
        const result = await Comments.create({
            name: req.body.name,
            email: req.body.email,
            comment: req.body.comment
        });
        console.log("Comment created:", result);
        res.status(200).redirect("/");
    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).send("Error submitting comment");
    }
});

app.get("/createBlog", (req, res) => {
    res.render("create_blog.ejs");
});

app.post('/createBlog', async (req, res) => {
    try {
        const blog = await Blog.create({
            title: req.body.title,
            author: req.body.author,
            content: req.body.content,
        });

        console.log("Blog created:", blog);
        res.status(200).redirect("/");
    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).send("Error creating blog post");
    }
});



app.listen(port, () => {
    console.log("Listening on port", port);
});
