const mongoose = require('mongoose');

//Connection to mongoDB
mongoose.connect('mongodb://localhost/playground',{ useNewUrlParser: true, useUnifiedTopology: true } )
    .then (() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB', err));


//Schemas
const coursesSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: {
        type: Date,
        default: Date.now
    },
    isPublished: Boolean
});

//Model - Class
const Course = mongoose.model('Course', coursesSchema);

async function createCourse() {
    //Object
    const course = new Course({
        name: 'Angular Course',
        tags: ['angular', 'frontend'],
        author: 'Mosh',
        isPublished: false
    });

    const result = await course.save();
    console.log(result);
}

async function getCourses(){

    // api/courses?pageNumber=2&pageSize=10
    const pageNumber = 2;
    const pageSize = 10;


    const courses = await Course
        .find({author: 'Mosh', isPublished: false})
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({ name: 1})
        .select({ name: 1, tags: 1 });

    console.log(courses);
}

//createCourse();
getCourses();






