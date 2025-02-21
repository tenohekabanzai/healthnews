const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    author: {
        type: String,
        default: null // Default value set to null
    },
    title: {
        type: String,
        default: null // Default value set to null
    },
    description: {
        type: String,
        default: null // Default value set to null
    },
    category : {
        type: String,
        default : null
    },
    url: {
        type: String,
        default: null, // Default value set to nul
    },
    image: { // Changed from urlToImage to image
        type: String,
        default: null, // Default value set to null
    },
    publishedAt: {
        type: Date,
        default: null, // Default value set to null
    },
    content: {
        type: String,
        default: null // Default value set to null
    },
    storeTime: {
        type: Date,
        default: Date.now // Keep this as it is; it defaults to the current date/time
    }
});

const Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;