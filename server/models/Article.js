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
    url: {
        type: String,
        default: null, // Default value set to null
        validate: {
            validator: function(v) {
                return /^(http|https):\/\/[^ "]+$/.test(v); // Basic URL validation
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },
    image: { // Changed from urlToImage to image
        type: String,
        default: null, // Default value set to null
        validate: {
            validator: function(v) {
                return /^(http|https):\/\/[^ "]+$/.test(v); // Basic URL validation
            },
            message: props => `${props.value} is not a valid image URL!`
        }
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