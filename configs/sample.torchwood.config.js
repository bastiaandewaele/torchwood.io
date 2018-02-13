
module.exports = {
	localhost: true,
	server: {
		port: 9000
	},
	templates: true,
	assets: true,
	misc: true,
	files: {
		assets: {
			"css/main.css": "main.scss",
			"js/main.js": "main.js"
		},
		concat: {
			"css/lib.min.css": ["test.css", "foo.css"],
			"css/lib.min.js": ["test.js", "foo.js"],
		},
	},
	export: "export",
	data: {}
};