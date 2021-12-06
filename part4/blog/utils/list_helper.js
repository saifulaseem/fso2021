// const _ = require("lodash.maxby");
const dummy = () => {
	// console.log(blogs);
	return 1;
};

const totalLikes = (blogs) => {
	return blogs.reduce((sum, blog) => {
		return sum + blog.likes;
	}, 0);
};

const favouriteBlog = (blogs) => {
	return blogs.reduce(
		(favBlog, blog) => {
			return favBlog.likes > blog.likes ? favBlog : blog;
		},
		{ likes: 0 }
	);
};

const mostAuthored = (blogs) => {
	let authors = {};
	blogs.forEach((blog) => {
		if (authors[blog.author] !== undefined) {
			authors = { ...authors, [blog.author]: authors[blog.author] + 1 };
		} else {
			authors = { ...authors, [blog.author]: 1 };
		}
	});
	var authorName = Object.keys(authors).reduce((max, author) => {
		return authors[max] > authors[author] ? max : author;
	}, Object.keys(authors)[0]);
	return {
		author: authorName,
		blogs: authors[authorName],
	};
};

const mostLiked = (blogs) => {
	let authors = {};
	blogs.forEach((blog) => {
		if (authors[blog.author] !== undefined) {
			authors = {
				...authors,
				[blog.author]: authors[blog.author] + blog.likes,
			};
		} else {
			authors = { ...authors, [blog.author]: blog.likes };
		}
	});
	const authorName =  Object.keys(authors).reduce((max, author) => {
		return authors[max] > authors[author] ? max : author;
	}, Object.keys(authors)[0]);
	return {
		author: authorName,
		likes: authors[authorName],
	}; 
};
module.exports = {
	dummy,
	totalLikes,
	favouriteBlog,
	mostAuthored,
	mostLiked,
};
