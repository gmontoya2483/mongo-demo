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


