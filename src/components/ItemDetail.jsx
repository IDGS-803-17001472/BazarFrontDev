import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../assets/ItemDetail.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Swal from 'sweetalert2';

const ItemDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isBuying, setIsBuying] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://examenbazar.azurewebsites.net/api/Products/${id}`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        setError('Error al obtener el detalle del producto.');
      }
    };
    fetchProduct();
  }, [id]);

  const handleBuy = async () => {
    setIsBuying(true);
    try {
      const response = await fetch('https://examenbazar.azurewebsites.net/api/Sales/addSale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      const result = await response.json();
      setPurchaseSuccess(result);
      if (result) {
        Swal.fire({
          title: 'Compra registrada',
          text: '¡La compra se ha realizado exitosamente!',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
      }
    } catch (error) {
      console.error('Error buying product:', error);
      setPurchaseSuccess(false);
    } finally {
      setIsBuying(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.length > 0) {
      navigate(`/?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!product) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="item-detail">
      {/* Header con logo y cuadro de búsqueda */}
      <header className="header">
  <img 
    src="./../assets/th.jpg" 
    alt="Logo de la tienda"
    style={{ width: '80px', height: 'auto' }}
  />
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <h1>Buscar Productos</h1>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Buscar</button>
    </div>
  </div>
</header>

      {/* Detalle del producto */}
      <button onClick={() => navigate('/')} style={salesButtonStyle}>Inicio</button>
      <h2>{product.title}</h2>
      <div className="detail-container">
        <div className="image-gallery">
          <Carousel showThumbs={true} dynamicHeight={true}>
            {product.images && product.images.length > 0 ? (
              product.images.map((img, index) => (
                <div key={index}>
                  <img src={img} alt={`Producto ${index + 1}`} className="detail-image" />
                </div>
              ))
            ) : (
              <div className="image-container">
                <img src={product.thumbnail} alt={product.title} className="detail-image" />
              </div>
            )}
          </Carousel>
        </div>
        <div className="product-details">
          <p><strong>Precio:</strong> ${product.price}</p>
          <p><strong>Descripción:</strong> {product.description}</p>
          <p><strong>Marca:</strong> {product.brand}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          <p><strong>Categoría:</strong> {product.category}</p>
          <p><strong>Puntuación:</strong> {product.rating}</p>
          <button onClick={handleBuy} disabled={isBuying}>
            {isBuying ? 'Procesando...' : 'Comprar'}
          </button>
          {purchaseSuccess === true && <p>Compra realizada exitosamente!</p>}
          {purchaseSuccess === false && <p>Hubo un error en la compra. Inténtalo de nuevo.</p>}
        </div>
      </div>
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

export default ItemDetail;
