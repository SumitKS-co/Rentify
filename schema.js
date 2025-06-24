const Joi = require('joi');
const review = require('./models/review');

module.exports.listingSchema = Joi.object({
    listing:Joi.object({  

            /*         
            
            We made listingSchema because we need a place to  write all the rules for checking our data.

            Inside that, we wrote listing because the data we are getting looks like this:
            {
              listing: {
                title: "House",
                price: 1000
              }
            }
            So basically:
            🧠 “The whole thing is called listingSchema.”
            📦 “Inside it, there's a box called listing.”
            📝 “And we want to check what's inside that box (like title, price, etc).”

            */
        title: Joi.string().required(),
        description:Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price:Joi.number().min(0),
        image:Joi.string().allow("",null),
        

    }).required()
})

module.exports.reviewSchema = Joi.object({
  review:Joi.object({
    rating:Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required()
})