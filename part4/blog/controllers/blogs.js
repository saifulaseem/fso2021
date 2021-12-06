const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const { userExtractor } = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({});
	response.json(blogs.map((note) => note.toJSON()));
});

blogsRouter.get("/:id", async (request, response) => {
	const blog = await Blog.findById(request.params.id);
	if (blog) {
		response.json(blog);
	} else {
		response.status(404).end();
	}
});

blogsRouter.post("/", userExtractor ,async (request, response) => {
	const token = request.token;
	const user = request.user;
	if (!token || !user) {
		return response.status(401).json({ error: "token missing or invalid" });
	}
	const body = request.body;
	if (!(body.title && body.url)) {
		return response.status(400).end();
	}
	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes ? body.likes : 0,
		user:user.id
	});

	const savedBlog = await blog.save();
	
	user.blogs = user.blogs.concat(savedBlog._id);
	await user.save();

	response.json(savedBlog);
});

blogsRouter.delete("/:id",userExtractor, async (request, response) => {
	const blogToRemove = await Blog.findById(request.params.id);
	const user = request.user ;

	if(blogToRemove.user.toString() !== user._id.toString()) {
		response.status(401).json({error: "User does not have permission to remove this blog!"}).end();
		return;
	}
	await Blog.findByIdAndRemove(request.params.id);
	response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
	const body = request.body;

	const blog = {
		likes: body.likes,
	};

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
		new: true,
	});
	if (updatedBlog) {
		response.json(updatedBlog);
	}
});

module.exports = blogsRouter;
