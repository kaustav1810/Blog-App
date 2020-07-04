var express = require("express"),
	app		= express(),
	bodyParser = require("body-parser"),
	sanitizer	   = require("express-sanitizer"),
	mongoose = require("mongoose"),
	methodOverride = require("method-override");
	

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(sanitizer());
app.use(express.static('public'));
app.use(methodOverride("_method"));


mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/Blog_App", {useNewUrlParser: true});

var blogSchema = mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date,default:Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

app.get("/",(req,res)=>{
	res.redirect("/blogs");
});

//INDEX - displays all blogs
app.get("/blogs",(req,res)=>{
	Blog.find({},(err,blogs)=>{
		if(err)
			console.log("error!!!");
		else
			res.render("index",{blogs});		
	})
});

//NEW - write a new blog
app.get("/blogs/new",(req,res)=>{
	res.render("new");
});

//CREATE - add newly created blog to database
app.post("/blogs",(req,res)=>{
	req.body.blog.body=req.sanitize(req.body.blog.body)
	Blog.create(req.body.blog,(err,newBlog)=>{
		if(err)
			console.log(err);
		else
			res.redirect("/blogs");
	});
});

//SHOW - show a particular blog
app.get("/blogs/:id",(req,res)=>{
	Blog.findById(req.params.id,(err,foundBlog)=>{
		if(err)
			console.log(err);
		else
			res.render("show",{blog:foundBlog});
	});
});

//EDIT - edit a particular blog
app.get("/blogs/:id/edit",(req,res)=>{
	Blog.findById(req.params.id,(err,foundBlog)=>{
		if(err)
			console.log(err)
		else
			res.render("edit",{blog:foundBlog});		
	});
});

//UPDATE - show the edited blog
app.put("/blogs/:id",(req,res)=>{
	req.body.blog.body=req.sanitize(req.body.blog.body)
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updatedBlog)=>{
		if(err)
			console.log(err);
		else
			res.render("show",{blog:updatedBlog});
	});
});

//DELETE - delete a particular blog
app.delete("/blogs/:id",(req,res)=>{
		Blog.findByIdAndRemove(req.params.id,(err)=>{
			res.redirect("/blogs");
		});
});

app.listen(3000,()=>{
	console.log("servar restarted!!");
})