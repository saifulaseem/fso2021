const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

// jest.setTimeout(10000);
const User = require("../models/user");

describe("when there is initially some user  saved", () => {
	beforeEach(async () => {
		await User.deleteMany({});

		const userObjects = helper.initialUsers
			.map(user => new User(user));
		const promiseArray = userObjects.map(user => user.save());
		await Promise.all(promiseArray);
	});

	test("users are returned as json", async () => {
		await api
			.get("/api/users")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});

	test("all users are returned as json", async () => {
		const response = await api.get("/api/users")
			.expect("Content-Type", /application\/json/);              
		expect(response.body.length).toBe(helper.initialUsers.length);
	});
});

    
test("contains unique identitfier named id", async () => {
	const response = await api.get("/api/users");

	const contents = response.body;
	expect(contents.map(content=>content.id)).toBeDefined();
});

describe("addition of a new user", () => {
	test("succeeds with valid data", async () => {
		const newUser = {
			name:"admin",
			username:"admin",
			password:"Novigo@123"
		};
		await api
			.post("/api/users")
			.send(newUser)
			.expect(200)
			.expect("Content-Type", /application\/json/);


		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd.length).toBe(helper.initialUsers.length + 1);

	});

	test("Fails with invalid username", async () => {
		const newUser = {
			name:"admin",
			username:"ad",
			password:"Novigo@123"
		};
		await api
			.post("/api/users")
			.send(newUser)
			.expect(400);
	});
	
	test("Fails with invalid password", async () => {
		const newUser = {
			name:"admin",
			username:"admin",
			password:"No"
		};
		await api
			.post("/api/users")
			.send(newUser)
			.expect(400);
	});
});

afterAll(() => {
	mongoose.connection.close();
});