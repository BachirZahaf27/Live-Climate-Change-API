const PORT = process.env.PORT || 8000
const express = require('express') //calling express
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')
const { request } = require('express')

const app = express()
//creating the array of newspapers publisher that we can screap data from it
const newspapers = [
    {
        name: 'cityam',
        address: 'https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action/',
        base: ''
    },
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: '',
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk',
    },
    {
        name: 'nyt',
        address: 'https://www.nytimes.com/international/section/climate',
        base: '',
    },
    {
        name: 'latimes',
        address: 'https://www.latimes.com/environment',
        base: '',
    },
    {
        name: 'smh',
        address: 'https://www.smh.com.au/environment/climate-change',
        base: 'https://www.smh.com.au',
    },
    {
        name: 'un',
        address: 'https://www.un.org/climatechange',
        base: '',
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.co.uk/news/science_and_environment',
        base: 'https://www.bbc.co.uk',
    },
    {
        name: 'es',
        address: 'https://www.standard.co.uk/topic/climate-change',
        base: 'https://www.standard.co.uk'
    },
    {
        name: 'sun',
        address: 'https://www.thesun.co.uk/topic/climate-change-environment/',
        base: ''
    },
    {
        name: 'dm',
        address: 'https://www.dailymail.co.uk/news/climate_change_global_warming/index.html',
        base: ''
    },
    {
        name: 'nyp',
        address: 'https://nypost.com/tag/climate-change/',
        base: ''
    }

] 

const articles = []

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
                articles.push({title, url:newspaper.base + url, source: newspaper.name})//Pushing the titles and the url in the array articles
            })
        
})
})

app.get('/', (req,res) => {
   res.json('Welcome to my Climate Change News API') 
})

//Getting Data
app.get('/news', (req,res) => {
    //Display the articles
    res.json(articles)
    
})

//Searching by name of the newspaper
app.get('/news/:newspaperId', (req,res) => {
    //getting the the name of the newspaper from the keyboard and put it into params
    const newspaperId = req.params.newspaperId
    //Test if the name exist in my newspaper array we fillter it and get the address
    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)//select them
    .then(response => {
        const html = response.data//select the html
        const $ = cheerio.load(html)//put it to $
        const specificArticles = []//put it in the array

        $('a:contains("climate")',html).each(function () {
         //Grabing the text in the A tag
         const title = $(this).text()//Picking the text
         const url = $(this).attr('href')//Picking the Url
         specificArticles.push({title, url:newspaperBase + url, source: newspaperId})//Pushing the titles and the url in the array articles
      })
      res.json(specificArticles)//Displaying the result

    }).catch(err => console.log(err))
})
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
