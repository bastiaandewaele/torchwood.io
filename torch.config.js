
module.exports = {

	localhost: false,
	server: {
		port: 9000
	},
	templates: true,
	assets: true,
	misc: true,
	files: {
		"css/main.css": "sass/main.scss",
		"js/main.js": "js/main.js"
	},
	concat: {
		"css/lib.min.css": ["css/test.css", "css/foo.css"],
		"js/lib.min.js": ["main", "js/test.js", "js/foo.js"]
	},
	export: "export",
	data: {
		foo: "fool"
	}
};