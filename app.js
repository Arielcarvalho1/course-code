const { json } = require("body-parser");
const express = require("express");
const app = express();
const Joi = require("joi");
app.use(express.json()); // Allow the parsin of json


const courses = [
    {id: 1, about: "math"},
    {id: 2, about: "love"}
]

// Get requests
app.get("/", (request, response) => {
    response.send("Hello there");
})

app.get("/courses/:id", (request, response) => {
    const course = courses.find(function(c) {
        return c.id === parseInt(request.params.id);
    })

    if(!course) {
        response.status(404).send("No course with that id");
    }

    response.send(course);
});


// Post requests
app.post("/courses", (request, response) => {
   const schema = {
    about: Joi.string().min(3).required()
   };

   const result = Joi.validate(request.body, schema);

   if(result.error){
    response.status(400).send(result.error.details[0].message);
   } 

   const course = {
    id: courses.length + 1,
    about: request.body.about
   }; 

   courses.push(course);

   // By convention we return the object we created on post requests
   response.send(course);

});

app.put("/courses/:id", (request, response) => {
    const course = courses.find((c) => c.id === parseInt(request.params.id));
    if(!course) response.status(404).send("Course does not exist");

    const schema = {
        about: Joi.string().min(3).required()
    }

    const result = Joi.validate(request.body, schema);
    
    if(result.error) {
        return response.status(400).send(result.error.details[0].message);
    }

    // Update the values
    course.about = request.body.about;

    return response.send(course);
});

app.delete("/courses/:id", (request, response) => {
    const course = courses.find((c) => c.id === parseInt(request.params.id));
    if(!course) response.status(404).send("Course does not exist");
    
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    response.send(course);
})

// console.log(process.env.PORT); -- To read environment variable
app.listen(3000);
console.log("listening on 3000");