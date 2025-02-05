
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require("mongoose");
const x = require('../server/utills');
const Article = require('./models/Article')
require('dotenv').config();

const wellnessTopics = [
  "Health",
  "Obesity",
  "Diabetes",
  "Yoga",
  "HeartHealth",
  "Healthy Foods",
  "Hygiene",
  "Vitamins",
  "Workout",
  "Diet",
];

const app = express();
app.use(cors());

mongoose.connect(process.env.MONGO_URL).then(i=>console.log("DB connected"));

function shuffleArray(array) {
  for (let i= array.length-1; i>0;i--) {
      const j= Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; 
  }
  return array;
}

// app.get('/generate',async(req,res)=>{
//   try {

//     for (const topic of wellnessTopics) {
//       try {
//         const resp = await axios.get(`https://newsapi.org/v2/everything`, {
//           params: {
//               q: topic,
//               apiKey: process.env.API_KEY,
//               language: 'en'  
//           }
//       });
//         const data = resp.data.articles; 
        
//         arr.push(...data); 
  
//         console.log(`Fetched articles for topic: ${topic}`);
//       } catch (error) {
//         console.error(`Error fetching topic ${topic}:`, error.message);
//       }
//     }
    
//     arr = shuffleArray(arr)
//     res.json({data:arr})
//   } catch (error) {
//     res.json({error: error})
//   }
// })

const getArticles = async()=>{
  try {
    var arr = [];
    for (const topic of wellnessTopics) {
      try {
        const resp = await axios.get(`https://newsapi.org/v2/everything`, {
          params: {
              q: topic,
              pageSize: 15,
              apiKey: process.env.API_KEY,
              language: 'en'  
          }
      });
        const data = resp.data.articles; 
        arr.push(...data); 
        console.log(`Fetched articles for topic: ${topic}`);
      } catch (error) {
        console.error(`Error fetching topic ${topic}:`, error.message);
      }
    }
    
    arr = shuffleArray(arr)
    return arr;
  } catch (error) {
    console.log(error)
  }
}

app.get('/callapi',async(req,res)=>{
  try {
    const arr = await getArticles();
    console.log(arr);
  } catch (error) {
    console.log(error);
  }
})

app.get('/',async(req,res)=>{
  try {
    const art1 = await Article.findOne();
    const currentTime = new Date(); 

    const diffInMilliseconds = currentTime - art1.storeTime;
    const SEC = 1000;
    const MIN = 60*SEC;
    const HRS = 60*MIN;

    const hours = Math.floor(diffInMilliseconds/HRS);
    const minutes = Math.floor((diffInMilliseconds % HRS) / MIN);
    const seconds = Math.floor((diffInMilliseconds % MIN) / SEC);

    // Format the result
    const formattedDiff = `${Math.abs(hours)} hours, ${Math.abs(minutes)} minutes, ${Math.abs(seconds)} seconds`;
    console.log(`Difference: ${formattedDiff}`);

    if(art1 == null || Math.abs(hours)>=24)
    {
      await Articles.deleteMany();

      // var p = getArticles(); // real API call 
      var p = x.message; // static data for testing
      for(const i of p)
      {
        // console.log(i.source.name)

        const art = {};
        art.source = i.source.name;
        art.author = i.author;
        art.title = i.title;
        art.description = i.description;
        art.url = i.url;
        art.image =  i.urlToImage;
        art.publishedAt = i.publishedAt;
        art.content = i.content;

        await Article.create(art);
      }
    }
    
    res.json({success:true,message:p}); // static data for testing
  } catch (error) {
    console.log(error);
  }
})

app.listen(5001, () => {
    console.log(`App running at 5001`);
});