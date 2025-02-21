
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require("mongoose");
const x = require('../server/utills');
const Article = require('./models/Article')
require('dotenv').config();

const wellnessTopics = [
  "Obesity",
  "Diabetes",
  "Gym",
  "Fitness",
  "Surgery",
  "Protein",
  "HeartHealth",
  "MedicalResearch",
  "CancerCare",
  "HealthyFood",
  "WomensHealth",
  "Vitamins",
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

// end point to clear DB
app.get('/delete',async(req,res)=>{
  const resp  =await Article.deleteMany()
  res.json({success:true})
})

// function for NEWS api call returning array of Articles
const getArticles = async()=>{
  try {
    var arr = [];
    for (const topic of wellnessTopics) {
      try {
        const resp = await axios.get(`https://newsapi.org/v2/everything`, {
          params: {
              q: topic,
              pageSize: 20,
              apiKey: process.env.API_KEY,
              language: 'en'  
          }
      });
        const data = resp.data.articles; 
         
        const modifiedData = data.map(article => ({
          ...article,             // Spread existing object properties
          category: topic   // Add new field
        }));

        arr.push(...modifiedData);
        // console.log(`Fetched articles for topic: ${topic}`);
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

// endpoint for testing NEWS api call
app.get('/callapi',async(req,res)=>{
  try {
    const arr = await getArticles();
    res.json({data:arr});
  } catch (error) {
    console.log(error);
  }
})

// endpoint for getting articles stored at DB
app.get('/',async(req,res)=>{
  try {

    const art1 = await Article.findOne();
    var hours = 0;

    // if articles exist on DB check their time of creation
    if(art1!= null)
    {
      const currentTime = new Date(); 
      const diffInMilliseconds = currentTime - art1.storeTime;
      const SEC = 1000;
      const MIN = 60*SEC;
      const HRS = 60*MIN;

      hours = Math.floor(diffInMilliseconds/HRS);
      const minutes = Math.floor((diffInMilliseconds % HRS) / MIN);
      const seconds = Math.floor((diffInMilliseconds % MIN) / SEC);

      const formattedDiff = `${Math.abs(hours)} hours, ${Math.abs(minutes)} minutes, ${Math.abs(seconds)} seconds`;
      console.log(`Difference: ${formattedDiff}`);
    }
    
    // IF ARTICLES DO NOT EXIST, OR ARE MORE THAN 24HRS OLD, RECALL THE API AND STORE FRESH DATA IN DB
    if(art1 == null || Math.abs(hours)>=24)
    {
      await Article.deleteMany();

      var p = await getArticles(); // real API call 
      // var p = x.message; // static data for testing
     
      for(const i of p)
      {
        const art = {};
        art.source = i.source.name;
        art.author = i.author;
        art.title = i.title;
        art.description = i.description;
        art.category = i.category;
        art.url = i.url;
        art.image =  i.urlToImage;
        art.publishedAt = i.publishedAt;
        art.content = i.content;

        await Article.create(art);
      }
    }

    const art_50 = await Article.find().limit(50);
    
    res.json({success:true,message:art_50}); // static data for testing
  } catch (error) {
    console.log(error);
  }
})


app.listen(5001, () => {
    console.log(`App running at 5001`);
});