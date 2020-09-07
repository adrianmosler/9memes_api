// importamos dependencias
import 'dotenv/config';
import express from 'express';
import { connect } from 'mongoose';
import bodyParser from 'body-parser';

// import routes
import { publicationRoutes } from './routes/publication.route';
import { userRoutes } from './routes/user.route';
import { commentRoutes } from './routes/comment.route';
import { categoryRoutes } from './routes/category.route';

const app = express();
// Importamos variables globales
const mongoDB = process.env.MONGODB_LOCAL || process.env.MONGODB;
const port = process.env.PORT;
const host = process.env.HOST;

//middlewares de body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//ROUTES
app.use('/publication', publicationRoutes);
app.use('/user', userRoutes);
app.use('/comment', commentRoutes);
app.use('/category', categoryRoutes);

app.get('/', function (req, res) {
    res.json({ mensaje: 'Bienvenidos al servidor de 9 MEMES' });
});

// connected to DB
connect(
    mongoDB,
    { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) console.log(err);
        else {
            console.log('\nBases de datos conectada con éxito');
        }
    }
);

// listening server
app.listen(port, () => {
    console.log(`\n9MEMES API listening at http://${host}:${port}`);
});
