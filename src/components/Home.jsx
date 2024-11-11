import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './../assets/Home.css';
import ReactStars from 'react-stars'; // Importar react-stars

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Obtener el parámetro 'q' de la URL
    const queryParam = new URLSearchParams(location.search).get('q');
    if (queryParam) {
      setSearchQuery(queryParam);
      handleSearch(queryParam);
    }
  }, [location.search]);

  const handleSearch = async (query = searchQuery) => {
    if (query.length > 0) {
      try {
        const response = await axios.get(`https://examenbazar.azurewebsites.net/api/Products?q=${query}`);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError('Error al obtener los productos. Verifica que la API esté en funcionamiento.');
        setProducts([]);
      }
    }
  };

  const goToSales = () => {
    navigate('/sales');
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleNavigateSearch = () => {
    // Navegar a la URL con el parámetro de búsqueda
    navigate(`/?q=${searchQuery}`);
  };

  return (
    <div>
      <button onClick={goToSales} style={salesButtonStyle}>Compras</button>
      <header className="header">
        <img 
          src="./assets/th.jpg"  // Cambia esta ruta por la del logo
          alt="Logo de la tienda"
          style={{ width: '150px', height: 'auto', marginRight: '20px' }}
        />
        <h1>Buscar Productos</h1>
      </header>

      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchQuery}
        onChange={handleInputChange}
      />
      <button onClick={handleNavigateSearch}>Buscar</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {products.length > 0 && (
        <div>
          <h2>Resultados ({products.length})</h2>
          <div className="product-list">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <img src={product.thumbnail} alt={product.title} className="product-image" />
                <div className="product-info">
                  <h3>{product.title}</h3>
                  <p className="price">${product.price}</p>
                  <p className="category">{product.category}</p>
                  <p>{product.description}</p>
                  <p className="rating">Rating: {product.rating}</p>
                  <a href={`/item/${product.id}`} className="details-link">Ver detalles</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const salesButtonStyle = {
  position: 'fixed',
  top: '94%',
  left: '80%',
  padding: '8px 16px',
  fontSize: '16px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  zIndex: 1000,
};

export default Home;
