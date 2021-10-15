import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import {
  getFirestore,
  collection,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBU5omdfu-3aa04NgmQIhIp4sgzNybUc5U',
  authDomain: 'invoice-generator-cbb07.firebaseapp.com',
  projectId: 'invoice-generator-cbb07',
  storageBucket: 'invoice-generator-cbb07.appspot.com',
  messagingSenderId: '648307851518',
  appId: '1:648307851518:web:4587ad24f312af8e1d65af',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const getProducts = async () => {
  const productsCol = collection(db, 'products');
  const productSnapshot = await getDocs(productsCol);
  const productList = productSnapshot.docs.map((doc) => doc.data());
  return productList;
};

const productCard = ({ id, product, src, price }) => {
  const container = document.createElement('div');
  const body = document.createElement('div');
  const footer = document.createElement('div');
  const imageContainer = document.createElement('figure');
  const image = document.createElement('img');
  const nameContainer = document.createElement('p');
  const name = document.createElement('strong');
  const priceEl = document.createElement('p');
  const cta = document.createElement('button');

  container.className = 'ProductCard';
  body.className = 'ProductCard__body';
  footer.className = 'ProductCard__footer';
  imageContainer.className = 'ProductCard__image';
  nameContainer.className = 'single-line';
  cta.className = 'btn-outline';

  image.src = src;
  image.alt = product;
  image.loading= 'lazy';

  name.innerText = product;
  priceEl.innerHTML = `Price: $${price}`;
  cta.type = 'button';
  cta.innerText = 'Comprar';

  imageContainer.appendChild(image);
  nameContainer.appendChild(name);
  body.appendChild(nameContainer);
  body.appendChild(priceEl);
  footer.appendChild(cta);
  container.appendChild(imageContainer);
  container.appendChild(body);
  container.appendChild(footer);

  return container;
};

const list = document.getElementById('List');

const products = getProducts();

products.then((data) => {
  if (Array.isArray(data)) {
    data.map((item) => {
      list.appendChild(productCard({
        id: item.id,
        src: item.image,
        price: item.price,
        product: item.name,
      }));
      return item;
    });
  } else {
    list.innerHTML = 'No hay elementos'
  }
});

