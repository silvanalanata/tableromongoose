
const myexpress = require('express')

const myapp = myexpress()
// solicita el body-parser
var bodyParser = require('body-parser');
myapp.use(bodyParser.urlencoded({extended: true}));
myapp.use(myexpress.static(__dirname + "/static"));
myapp.set('views', __dirname + '/views'); 
myapp.set('view engine', 'ejs');


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/animales_db', {useNewUrlParser: true});

const UserSchema = new mongoose.Schema({
    nombre: {type: String, require: [true, 'nombre obligatorio']},
    edad:   {type: String, require: [true, 'edad obligatorio']},
    tipo:   {type: String, require: [true, 'tipo obligatorio']}
})
   // crea un objeto que contenga métodos para que Mongoose interactúe con MongoDB
   const Animal = mongoose.model('Animal', UserSchema); // se crea la coleccion, siempre va en singular y mongoose se crea en plural


myapp.get('/', (request, response) => {
    Animal.find()
    .then(animal  => { 
       /* if(animal.length === 0){
            console.log("no hay animales")
        }*/
        {response.render("index", {animales: animal})} 
    })
    .catch(err => response.json(err));
})


myapp.get('/mongoose/nuevo', function(request, response) {
    response.render('nuevo',{mensaje: ""}); 
  })

  myapp.post('/mongoose/nuevo', function(request, response) {
    console.log(request.body)
    const {introducir_nombre, introducir_edad, introducir_tipo} = request.body
    const animal = new Animal();
    animal.nombre = introducir_nombre
    animal.edad = introducir_edad
    animal.tipo = introducir_tipo
    animal.save() //hace inser
    .then(
        () => response.render('nuevo',{mensaje: "agregado con exito"})
    )
    
    .catch(
       (error) =>{ console.log(error)
       },
    )
})


myapp.get('/detalle/:id', (request, response) => {
    let id = request.params.id
   // let gato_id=gatos_array[id]
     
Animal.findOne({_id: id})
    .then(animal => {
        // lógica con un solo resultado de objeto de usuario
{response.render("detalle", {animales: animal})} 
    })
    .catch(err => response.json(err));


})

myapp.get('/destruir/:id', function(request, response) {

    let id = request.params.id

Animal.remove({_id: id})
    .then(animal => {
 
{response.redirect("/")} 
    })
    .catch(err => response.json(err));


})

myapp.get('/editar/:id', function(request, response) {
    let id = request.params.id

    Animal.findOne({_id: id})
        .then(animal => {
            // lógica con un solo resultado de objeto de usuario
    {response.render("editar", {animales: animal})} 
        })
        .catch(err => response.json(err));

  })

  
myapp.post('/editar/:id', function(request, response) {
    let id = request.params.id

    // ...actualiza un documento que coincida con el criterio de objeto de la consulta
Animal.updateOne({_id: id},{nombre: request.body.introducir_nombre, edad: request.body.introducir_edad, tipo: request.body.introducir_tipo})
      
        .then(animal => {
        response.redirect("/")
            // lógica con resultado -- este será el objeto original por defecto
        })
        .catch(err => response.json(err));

  })



  myapp.listen(8000, function() {
    console.log('servidor ejecutandose en  http://localhost:8000');
});
