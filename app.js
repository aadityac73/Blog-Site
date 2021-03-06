require('dotenv').config();
var bodyParser = require('body-parser'),
	expressSanitizer = require('express-sanitizer'),
	methodOverride = require('method-override'),
	mongoose = require('mongoose'),
	express = require('express'),
	app = express();

// MONGODB CONNECTION

const URI = process.env.DATABASEURL || 'mongodb://127.0.0.1:27017/blog_site';
const PORT = process.env.PORT || 3000;

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

// mongodb schema
var blogSchema = mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: { type: Date, default: Date.now }
});

var Blog = mongoose.model('Blog', blogSchema);

// Manual creation of blog
// Blog.create({
//     title: "Cat Blog",
//     image: "https://pixabay.com/get/53e0dc4b4351ac14f1dc84609620367d1c3ed9e04e5074417d277ddd9644c0_340.jpg",
//     body: "My first blog about cat."
// }, function(err, blog){
//     if(err) {
//         console.log(err);
//     }
//     else {
//         console.log(blog);
//     }
// });

// root route
app.get('/', function(req, res) {
	res.redirect('/blogs');
});

// index route
app.get('/blogs', function(req, res) {
	Blog.find({}, function(err, blogs) {
		if (err) {
			console.log(err);
		} else {
			res.render('index', { blogs: blogs });
		}
	});
});

// create route
app.post('/blogs', function(req, res) {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/blogs');
		}
	});
});

// new route
app.get('/blogs/new', function(req, res) {
	res.render('new');
});

// show route
app.get('/blogs/:id', function(req, res) {
	Blog.findById(req.params.id, function(err, foundBlog) {
		if (err) {
			res.redirect('/blogs');
		} else {
			res.render('show', { blog: foundBlog });
		}
	});
});

// edit route
app.get('/blogs/:id/edit', function(req, res) {
	Blog.findById(req.params.id, function(err, foundBlog) {
		if (err) {
			res.redirect('/blogs');
		} else {
			res.render('edit', { blog: foundBlog });
		}
	});
});

// update route
app.put('/blogs/:id', function(req, res) {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
		if (err) {
			res.redirect('/blogs');
		} else {
			res.redirect('/blogs/' + updatedBlog._id);
		}
	});
});

// delete route
app.delete('/blogs/:id', function(req, res) {
	Blog.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.redirect('/blogs');
		} else {
			res.redirect('/blogs');
		}
	});
});

// connection to server
app.listen(PORT, function() {
	console.log('Server is running');
});
