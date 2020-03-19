# Mongo/ Mongoose

## Connection to the database

```javascript
//Connection to mongoDB
mongoose.connect('mongodb://localhost/playground',{ useNewUrlParser: true, useUnifiedTopology: true } )
    .then (() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB', err));
```

## Comparison Query Operators

* **eq:** equal
* **ne:** equal
* **gt:** grater than
* **gte:** grater than or equal to
* **lt:** less than
* **lte:** less than or equal to
* **in:**  in
* **nin:** not in

```javascript
async function getCourses(){

    //.find({author: 'Mosh', isPublished: false})
    //.find({ price: { $gt: 10 , $lte: 20 }})

    const courses = await Course
        .find( { price: { $in: [ 10, 15, 20 ] }} )
        .limit(10)
        .sort({ name: 1})
        .select({ name: 1, tags: 1 });
    console.log(courses);
}

```

## Logical Query Operators

* **or:** Or
* **and:** and

```javascript
async function getCourses(){
    const courses = await Course
        .find()
        .or( [{ author: 'Mosh' }, { isPublished: true }] )
        .limit(10)
        .sort({ name: 1})
        .select({ name: 1, tags: 1 });
    console.log(courses);
}
```

## Regular Expressions

* **/pattern/:** Regular expresion key sensitive
* **/pattern/i:** Regular expresion key insensitive
* **/^Mosh/:** starts with Mosh
* **/Hamedani$/:** ends with Hamedani
* **/.\*Mosh.\*/:** contains Mosh

## Counting

* **countDocuments():** count documents

```javascript
async function getCourses(){
    const courses = await Course
        .find({author: 'Mosh', isPublished: false})
        .limit(10)
        .sort({ name: 1})
        //.select({ name: 1, tags: 1 })
        .countDocuments();
    console.log(courses);
}
```

## Pagination

```javascript

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

```


## Updating Documents

### Query First Approach

```javascript
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

```

### Update first approach


[Mongo Update Operators](https://docs.mongodb.com/manual/reference/operator/update/)

#### findOneAndUpdate

It returns a Document. It could be the original Document or the updated one (``option new = true``) 

```javascript
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
```

**NOTE:** It could be possible to use the the ``findByIdAndUpdate`` function as well.


#### Update

It returns a Result with the following format:

```
   { n: 1, nModified: 1, ok: 1 } 
```
 

```javascript
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
```

**NOTE:** It could be possible to use the the ``updateMany`` method for updating multiple Documents.

## Deleting Documents

### find and Delete

It return the deleted Document or null in case it was not found.

```javascript
async function deleteCourseFindAndDelete(id){
    // Update directly
    const course = await Course.findOneAndDelete({_id: id} );
    console.log(course);
}
```

**NOTE:** Similar it can be used the ``findByIdAndDelete`` Method.


### delete

it returns a result object with the following format:

```
{ n: 0, ok: 1, deletedCount: 0 }
```

```javascript
async function deleteCourseDeleteOne(id){
    // Update directly
    const result = await Course.deleteOne({_id: id} );
    console.log(result);
}
```

**NOTE:** It could be possible to use the the ``deleteMany`` method for deleting multiple Documents.

## Validators

[Mongoose Validation](https://mongoosejs.com/docs/validation.html#built-in-validators)

### Built-in Validators

```javascript

//Schemas
const coursesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
        //match: /pattern/
    },
    category: {
        type: String,
        enum: ['web', 'mobile', 'network'],
        required: true
    },
    author: String,
    tags: [String],
    date: {
        type: Date,
        default: Date.now
    },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function(){ return this.isPublished; },
        min: 10,
        max:200
    }

});
```

#### String validators
+ **required**
+ **enum**
+ **minlength**
+ **maxlength**
+ **match**

#### Number validators
+ **required**
+ **min**
+ **max**

### Custom Validators

```javascript
//Schemas
const coursesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
        //match: /pattern/
    },
    category: {
        type: String,
        enum: ['web', 'mobile', 'network'],
        required: true
    },
    author: String,
    tags: {
        type: Array,
        validate:{
            validator: function(v){
                return v && v.length > 0;
            },
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
        min: 10,
        max: 200
    }

});
```

### Async Validators

Custom validators can also be asynchronous. If your validator function returns a promise (like an ``async`` function).
Previous versions of ``Mogoose`` used to implement the async validators as callbacks, however that approach is deprecated in current versions of ``Monngoose``

```javascript
//Schemas
const coursesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
        //match: /pattern/
    },
    category: {
        type: String,
        enum: ['web', 'mobile', 'network'],
        required: true
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
        min: 10,
        max: 200
    }

});
```
