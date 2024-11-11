import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch('https://examenbazar.azurewebsites.net/api/Sales/sales');
        const salesData = await response.json();

        // Crear un nuevo array de ventas con el precio total calculado
        const updatedSales = await Promise.all(salesData.map(async (sale) => {
          // Obtener el producto por ID para acceder al precio
          const productResponse = await fetch(`https://examenbazar.azurewebsites.net/api/Products/${sale.productId}`);
          const productData = await productResponse.json();

          return {
            ...sale,
            totalPrice: productData.price, // Usar el precio del producto como el total
            product: productData.title,
          };
        }));

        setSales(updatedSales);
      } catch (error) {
        console.error('Error fetching sales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);
  
  const goToSales = () => {
    navigate('/');
  };


  if (loading) return <p>Loading sales...</p>;

  return (
    <div className="sales-list">
<button onClick={goToSales} style={salesButtonStyle}>Volver al Inicio</button>
      <h2>Compras Registradas</h2>
      {sales.length > 0 ? (
        <ul>
          {sales.map((sale) => (
            <li key={sale.id} className="sale-item">
              <h3>{sale.productTitle}</h3>
              <h3>{sale.product}</h3>
              <p>Fecha de Compra: {new Date(sale.saleDate).toLocaleDateString()}</p>
              <p>Total: ${sale.totalPrice}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay compras registradas.</p>
      )}
    </div>
  );
};

const salesButtonStyle = {
    position: 'fixed',
    top: '94%',
    left: '70%',
    padding: '8px 16px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    zIndex: 1000,
  };

export default SalesList;