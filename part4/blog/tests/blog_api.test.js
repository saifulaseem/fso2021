const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const bcrypt = require("bcrypt");

// jest.setTimeout(10000);
const Blog = require("../models/blog");
const User = require("../models/user");

let testUserId;

const loginWithTestUser = async () => {
	const credentials = {
		username: helper.initialUsers[0].username,
		password: helper.initialUsers[0].password,
	};
	const response = await api
		.post("/api/login")
		.send(credentials)
		.expect(200)
		.expect("Content-Type", /application\/json/);

	return response.body.token;
};
beforeEach(async () => {
	await Blog.deleteMany({});
	await User.deleteMany({});
	const passwordHash = await bcrypt.hash(helper.initialUsers[0].password, 10);
	let user = new User({
		username: helper.initialUsers[0].username,
		name: helper.initialUsers[0].username,
		passwordHash: passwordHash,
	});

	user = await user.save();

	for (let blog of helper.initialBlogs) {
		let newBlog = new Blog(blog);
		newBlog.user = user.toJSON().id.toString();
		newBlog = await newBlog.save();
		user.blogs.push(newBlog.toJSON().id.toString());
	}
	user = await user.save();
	testUserId = user.toJSON().id;
});

describe("check when there are some blogs", () => {
	test("blogs are returned as JSON", async () => {
		await api
			.get("/api/blogs/")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	}, 100000);

	test("all blogs are returned", async () => {
		const response = await api.get("/api/blogs/");
		expect(response.body).toHaveLength(helper.initialBlogs.length);
	}, 10000);

	test("check the unique identifier propriety", async () => {
		const response = await api.get("/api/blogs");

		for (const blog of response.body) {
			expect(blog.id).toBeDefined();
		}
	}, 10000);
});

describe("addition of a new blog", () => {
	test("succeeds with valid data", async () => {
		const token = await loginWithTestUser();

		const newBlog = {
			title: "Vue patterns",
			author: "Michael Vaughanan",
			url: "https://vuepatterns.com/",
			likes: 2,
		};

		await api
			.post("/api/blogs")
			.send(newBlog)
			.set("Authorization", `bearer ${token}`)
			.expect(200)
			.expect("Content-Type", /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();
		expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1);

		const titles = blogsAtEnd.map((n) => n.title);
		expect(titles).toContain("Vue patterns");
	});

	test("likes set to 0 if not specified", async () => {
		const token = await loginWithTestUser();

		const newBlog = {
			title: "Angular patterns",
			author: "Michael Vaughanan",
			url: "https://angularpatterns.com/",
		};

		const response = await api
			.post("/api/blogs")
			.send(newBlog)
			.set("Authorization", `bearer ${token}`)
			.expect(200)
			.expect("Content-Type", /application\/json/);
		expect(response.body.likes).toBe(0);
	});
	test("Error on input without title and url", async () => {
		const newBlog = {
			author: "Michael Vaughanan",
		};
		const token = await loginWithTestUser();

		await api.post("/api/blogs")
			.set("Authorization", `bearer ${token}`)
			.send(newBlog).expect(400);
	});
});

describe("updating of a blog", () => {
	test("Updating like of a blog", async () => {
		const blogsAtStart = await helper.blogsInDb();
		const blogToUpdate = blogsAtStart[0];
		blogToUpdate.likes *= 3;

		const response = await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(blogToUpdate)
			.expect(200);

		expect(response.body.likes).toBe(blogToUpdate.likes);
	});
});

describe("deletion of a blog", () => {
	test("succeeds with status code 204 if id is valid", async () => {
		const blogsAtStart = await helper.blogsInDb();
		const blogToDelete = blogsAtStart[0];
		const token = await loginWithTestUser();

		await api.delete(`/api/blogs/${blogToDelete.id}`)
			.set("Authorization", `bearer ${token}`)
			.expect(204);
		const blogsAtEnd = await helper.blogsInDb();

		expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1);

		const titles = blogsAtEnd.map((r) => r.title);

		expect(titles).not.toContain(blogToDelete.title);
	});
});
afterAll(() => {
	mongoose.connection.close();
});
