const express = require("express");
const app = express();
const Joi = require("joi");
app.use(express.json()); // Allow the parsin of json

function validate(input) {

    // input will be the object. Probably the body of the request
    const schema = {
        about: Joi.string().min(3).required()
    };

   // input used to be request.body
   const result = Joi.validate(input, schema);

   return result;
}

function findCourse(courses, id) {
    // id used to be request.params.id

    // array.find calls predicate for every element of the array
    return courses.find((object) => object.id === parseInt(id));

}

const courses = [
    {id: 1, about: "math"},
    {id: 2, about: "love"}
]

app.get("/", (request, response) => {
    return response.send("Hello there");
})

app.get("/courses/:id", (request, response) => {
    const course = findCourse(courses, request.params.id);

    if(!course) {
        return response.status(404).send("No course with that id");
    }

    response.send(course);
});


app.post("/courses", (request, response) => {

    const result = validate(request.body); // Validate input with joi

    if(result.error) {
        return response.status(400).send(result.error.details[0].message); // Get just the message
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
    const course = findCourse(courses, request.params.id);

    if(!course) return response.status(404).send("No such course");

    const result = validate(request.body); // Validate input with joi 
    
    if(result.error) {
        return response.status("400").send(result.error.details[0].message);
    }

    // Update the values
    course.about = request.body.about;

    return response.send(course);
});


app.delete("/courses/:id", (request, response) => {
    const course = findCourse(courses, request.params.id);

    if(!course) response.status(404).send("Course does not exist");
    
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    return response.send(course);
});

// console.log(process.env.PORT); -- To read environment variable

app.listen(3000);
console.log("listening on 3000");