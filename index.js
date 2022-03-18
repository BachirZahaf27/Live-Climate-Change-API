const PORT = 9000
const express = require('express') //calling express
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()
const { response } = require('express')
const { request } = require('express')
//creating the array of newspapers publisher that we can screap data from it
const newspapers = [
    {
        id:1,
        name: "cityam",
        website: "https://www.cityam.com/",
        address: "https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action/",
        base: ""
    },
    {
        id:2,
        name: "thetimes",
        website: "https://www.thetimes.com/",
        address: "https://www.thetimes.co.uk/environment/climate-change",
        base: ""
    },
    {
        id:3,
        name: "theguardian",
        website: "https://www.theguardian.com/",
        address: "https://www.theguardian.com/environment/climate-crisis",
        base: ""
    },
    {
        id:4,
        name: "the new york times",
        website: "https://www.nytimes.com/",
        address: "https://www.nytimes.com/international/section/climate",
        base: ""
    },
    {
        id:5,
        name: "latimes",
        website: "https://www.latimes.com/",
        address: "https://www.latimes.com/environment",
        base: ""
    },
    {
        id:6,
        name: "smh",
        website: "https://www.smh.com.au/",
        address: "https://www.smh.com.au/environment/climate-change",
        base: "https://www.smh.com.au"
    },
    {
        id:7,
        name: "un",
        website: "https://www.un.org/",
        address: "https://www.un.org/climatechange",
        base: ""
    },
    {
        id:8,
        name: "bbc",
        website: "https://www.bbc.co.uk",
        address: "https://www.bbc.co.uk/news/science_and_environment",
        base: "https://www.bbc.co.uk"
    },
    {
        id:9,
        name: "es",
        website: "https://www.standard.co.uk",
        address: "https://www.standard.co.uk/topic/climate-change",
        base: "https://www.standard.co.uk"
    },
    {
        id:10,
        name: "sun",
        website: "https://www.thesun.co.uk/",
        address: "https://www.thesun.co.uk/topic/climate-change-environment/",
        base: ""
    },
    {
        id:11,
        name: "dm",
        website: "https://www.dailymail.co.uk/",
        address: "https://www.dailymail.co.uk/news/climate_change_global_warming/index.html",
        base: ""
    },
    {
        id:12,
        name: "nyp",
        website: "https://nypost.com/",
        address: "https://nypost.com/tag/climate-change/",
        base: ""
    },
    {
        id:13,
        name: "telegraph",
        website: "https://www.telegraph.co.uk/",
        address: "https://www.telegraph.co.uk/climate-change",
        base: "https://www.telegraph.co.uk/"
    }

] 
const jornales= []//array of newspapers (id,website,source)
const articles = []//array of news (id,title,url,newspaperId,source)

let count=1;//counter of newsID
//Function of getting data about climate change and then putting it in the articles array
newspapers.forEach(newspaper => {
    //Using Axios to get data from the news publication
    axios.get(newspaper.address)
    .then((response) => {//Creating the respons that we apear in the feed
        const html = response.data //saving the response
        const $ = cheerio.load(html) //pickup element
        //Search for anything that talks about the climate change
            $('a:contains("climate")', html).each(function (){
                //Grabing the text in the A tag
                const title = $(this).text()//Picking the text
                const url = $(this).attr('href')//Picking the Url
                articles.push({id:count,title, url:newspaper.base + url, newspaperId:newspaper.id, source: newspaper.name})//Pushing the titles and the url in the array articles
                count++;
            })               
})
}) 

newspapers.forEach(newspaper => {
    //Pushing the titles and the url in the array articles    
    jornales.push({id:newspaper.id, Website:newspaper.website, source: newspaper.name})
    })

app.get('/', (req,res) => {
   res.json('Welcome to my Climate Change News API') 
})
//Get all news (newsId,title,url,newspaperId,source) DONE
app.get('/news', (req,res) => {
    //Display the articles
    res.json(articles)    
})
//Get news (newsId,title,url,newspaperId,source) by id DONE
app.get('/news/:newsId', (req,res) => {
    //Display the articles
    console.log(req)
    const newsId = req.params.newsId;
    res.json(articles[newsId-1])//-1 because it start with 0 rathen 1   
})
//Get all newspapers (id,website,source) DONE
app.get('/newspaper', (req,res) => {
    //Display the articles             
    res.json(jornales)    
})
//Get newspapers (id,website,source) by id DONE
app.get('/newspaper/:newspaperId', (req,res) => {
    //Display the newspapers
    console.log(req)
    const newspaperId = req.params.newspaperId;
    res.json(jornales[newspaperId-1])//-1 because it start with 0 rathen 1
    
})
//Start listing
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
