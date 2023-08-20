# review-scrapper
The main aim of this application is to scrap review data from the amazon site for a particular product

To run:

1.Create a constants.js file

2.Add your amazon login credentials

            module.exports = Object.freeze({
            email: "email@gmail.com",
            password: "password",
          });
          
3.Then install all the required node modules

      npm i 
      
4.Then start the app.js file

      node app.js

## Thus the reviews of the product will be stored in the reviews.xlsx
