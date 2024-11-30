import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); 


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/images'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Products array
const products = [
    { name: 'Product 1', description: 'Description for Product 1', image: '/images/product1.jpg' },
    { name: 'Product 2', description: 'Description for Product 2', image: '/images/product2.jpg' },
    { name: 'Product 3', description: 'Description for Product 3', image: '/images/product3.jpg' },
];

app.get('/', (req, res) => {
    res.render('index', { products });
});


app.get('/upload', (req, res) => {
    res.render('upload');
});

app.post('/upload', upload.single('productImage'), (req, res) => {
    const { productName } = req.body;
    const productImage = req.file;

    const imageUrl = `/images/${productImage.filename}`;
    const newProduct = { name: productName, image: imageUrl, description: 'Newly added product' };

    products.push(newProduct);

    console.log('Product added:', newProduct);

    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
