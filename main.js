//load the 4 libraries
const express = require('express')
const handlebars = require('express-handlebars')
const fetch = require('node-fetch')
const withQuery = require('with-query').default

//configure the PORT
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000
const API_KEY = process.env.API_KEY || "";      //API key is only set in cmd
const giphyURL = "https://api.giphy.com/v1/gifs/search"

//create an instance of express
const app = express()

//configure handlebars
app.engine('hbs', handlebars({defaultLayout: 'default.hbs'}))
app.set('view engine', 'hbs')

//configure app
app.get('/', 
    (req, resp) => {
        resp.status(200)
        resp.type('text/html')
        resp.render('index')
    }    
)

/*
https://api.giphy.com/v1/gifs/search
?api_key=n8DmtEqUOXPqAPVPIhcw05H18sDukBBv       //can clearly see the keys to used for the url query
&q=
&limit=25
&offset=0
&rating=g
&lang=en
*/
// const fullUrl = 'https://api.giphy.com/v1/gifs/search?api_key=n8DmtEqUOXPqAPVPIhcw05H18sDukBBv&q=&limit=25&offset=0&rating=g&lang=en'


app.get('/search', 
    async (req, resp) => {      //tag on the app.get function to make it an async function
        const search = req.query['search-term'] //use a square bracket for json objects and to access arrays. req.query is a json object. Anything within the square brackets are converted into key
        console.info('search-term: ', search)
        const url = withQuery(
            giphyURL,
            {
                api_key: API_KEY,           
                q: search,                  
                limit: 10                   
            }       
        )
        //search GIPHY, use await
        const result = await fetch(url)
        const giphy = await result.json()

        //HOMEWORK 28 OCT 2020
        //pull out URL in fixed height, use handlebars
        //for every object in the search result, look for images.fixed_height.url
        //filter out the url out before passing to handlebars

        //create an array to hold all the URL
        const searchResults = []
        for (let index = 0; index < 10; index++) {
            searchResults.push(giphy.data[index].images.fixed_height.url)   //url of fixed_height images
        }
        console.info(searchResults)
        resp.status(200)
        resp.type('text/html')
        resp.render('search', {search, searchResults})
        // resp.end()  //don't send anything
    }
)

//application will not run unless there is a valid API key
if (API_KEY)    //don't need {} if only one statement
    app.listen(PORT, () => {
        console.info(`Application started on port ${PORT} on ${new Date()}`)
        console.info(`with API key: ${API_KEY}`)
    })
else
    console.error('API_KEY is not set.')