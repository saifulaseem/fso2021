module.exports = {
	"env": {
		"commonjs": true,
		"es2021": true,
		"node": true,
		"jest":true,
	},
	"extends": "eslint:recommended",
	"parserOptions": {
		"ecmaVersion": 13
	},
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"windows"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		]
	}
};
