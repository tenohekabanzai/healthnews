import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import './App.css'

function App() {

  const [cardData, setCardData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try { // Added try...catch for error handling
        const resp = await axios.get("http://localhost:5001");
        console.log(resp.data.message);
        setCardData(resp.data.message);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold text-center my-6 text-green-600">Health & Wellness</h1>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData && cardData.length > 0 ? cardData.map((card) => (
          
          <div
            key={card.id}
            className="bg-green-50 rounded-lg shadow-md p-6 pb-12 hover:shadow-lg transition-shadow duration-300 relative"
          >
            <img
              src={card.image ? card.image : "https://thumbs.dreamstime.com/b/health-most-imortnat-related-keywords-39672626.jpg"}
              alt=""
              className="w-full h-32 object-cover mb-3 rounded-md"
            />
            <h2 className="text-xl font-semibold text-green-700 mb-3">{card.title}</h2>
            <p className="text-gray-700">{card.description}</p>
            <p className="text-gray-600">{card.author}</p>

            <div className="absolute bottom-4 right-4 p-6 pb-6">
              <a
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-center"
              >
                Read More
              </a>
            </div>
          </div>


        )) : <h1>Loading...</h1>}
      </div>
    </>
  );
}

export default App;
