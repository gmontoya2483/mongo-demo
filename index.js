const mongoose = require('mongoose');

//Connection to mongoDB
mongoose.connect('mongodb://localhost/playground',{ useNewUrlParser: true, useUnifiedTopology: true } )
    .then (() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB', err));


//Schemas
const coursesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        //match: /pattern/
        set: (v) => `TITLE: ${v}`
    },
    category: {
        type: String,
        enum: ['web', 'mobile', 'network'],
        required: true,
        lowercase: true
    },
    author: String,
    tags: {
        type: Array,
        validate:{
            validator:(v) => new Promise((resolve, reject)=>{
                //Do some async work - Simulated
                setTimeout(() => {

                    if (v.length === 2){
                        reject(new Error('Oops!'))
                    }

                    const result = v && v.length > 0;
                    console.log(v);
                    resolve(result);

                }, 2000);

            }),
            message: 'A course should have at least one tag.'
        }

    },
    date: {
        type: Date,
        default: Date.now
    },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function () {
            return this.isPublished;
        },
        min: 10.00,
        max: 200.00,
        set: (v) => Math.round(v),
    }

});

//Model - Class
const Course = mongoose.model('Course', coursesSchema);

async function createCourse() {
    //Object
    const course = new Course({
        name: 'Angular 9 Course',
        category: 'WEB',
        tags: ['frontend'],
        author: 'Mosh',
        isPublished: true,
        price: 15.87
    });

    try {
        const result = await course.save();
        console.log(result);
    } catch (ex) {
        //console.log(ex.errors)
        //console.log(ex.message);
         for ( field in ex.errors){
             console.log(ex.errors[field].message);
         }
    }
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

async function updateCourseQueryFirst(id){
    // findVyId()
    const course = await Course.findById(id);
    if (!course) return;

    // Modify its properties
    course.set({
        isPublished: true,
        author: 'Another Author'
    });

    // idem to:
    // course.isPublished = true;
    // course.author = 'Another Author';

    // save()
    const result = await course.save();
    console.log(result);
}

async function updateCourseFindAndUpdate(id){
    // Update directly
    const course = await Course.findOneAndUpdate(
        {_id: id},
        {
            $set: {
                author: 'Gabriel Hernan',
                isPublished: false
            }
        },
        {new: true} //new = true gets the new version of the updated document
    );

    console.log(course);
}

async function updateCourseUpdateFirst(id){
    // Update directly
    const result = await Course.updateOne(
        {_id: id},
        {
            $set: {
                author: 'Gabriel',
                isPublished: false
            }
        }
    );

    console.log(result);
}

async function deleteCourseFindAndDelete(id){
    // Update directly
    const course = await Course.findOneAndDelete({_id: id} );
    console.log(course);
}


async function deleteCourseDeleteOne(id){
    // Update directly
    const result = await Course.deleteOne({_id: id} );
    console.log(result);
}


createCourse();
//getCourses();
//updateCourseQueryFirst('5e6ecd6f103a5b15d868dba4');
//updateCourseFindAndUpdate('5e6ecd6f103a5b15d868dba4');
//updateCourseUpdateFirst('5e6ecd6f103a5b15d868dba4');
//deleteCourseFindAndDelete('5e7156b4bbab8332b8e225bd');
//deleteCourseDeleteOne('5e7156b4bbab8332b8e225bd');






