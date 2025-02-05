import React, { useState, useEffect } from "react";
import axios from "axios";

const NewsList = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:5001/generate");
                console.log(response.data.data);
                setArticles(response.data.data);
            } catch (error) {
                console.error("Error fetching news:", error);
                setError("Failed to fetch news articles.");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Health and Wellness Articles</h1>

            {loading ? (
                <p>Loading articles...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : articles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {articles.map((article, index) => (
                        <div key={index} className="bg-white rounded shadow-md overflow-hidden">
                            {article.urlToImage && (
                                <img 
                                    src={article.urlToImage} 
                                    alt={article.title} 
                                    className="w-full h-48 object-cover" 
                                />
                            )}
                            <div className="p-4">
                                <h2 className="text-xl font-semibold">{article.title}</h2>
                                <p className="text-gray-600">{article.author || "Unknown Author"}</p>
                                <p className="text-gray-700 my-2">{article.description}</p>
                                <a 
                                    href={article.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-blue-500 hover:underline"
                                >
                                    Read More
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No articles found.</p>
            )}
        </div>
    );
};

export default NewsList;
