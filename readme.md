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


## Updatating Documents

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
