

export default function Products() {
  const products = [
    {
      id: 1,
      name: 'Auriculares Premium ANC',
      category: 'Audio',
      price: '$299.00',
      rating: 4.8,
      reviews: 124,
      badge: 'Más Vendido',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 0L21 9m-1.5-3v10.5m-3-12.75L6 7.5m0 0L3 9m3-1.5v10.5M6 18H21" />
        </svg>
      )
    },
    {
      id: 2,
      name: 'Teclado Mecánico RGB 75%',
      category: 'Periféricos',
      price: '$149.00',
      rating: 4.9,
      reviews: 86,
      badge: 'Nuevo',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h12A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6ZM6 7.5h12M6 12h12M6 16.5h12" />
        </svg>
      )
    },
    {
      id: 3,
      name: 'Ratón Ergonómico Inalámbrico',
      category: 'Periféricos',
      price: '$89.00',
      rating: 4.7,
      reviews: 215,
      badge: 'Popular',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 9.152c.582.448 1.148.89 1.676 1.345m-1.676-1.345c-.53-.407-1.11-.83-1.74-1.272m3.416 2.617c.502.433.978.887 1.42 1.36m-1.42-1.36a23.953 23.953 0 0 0-4.084-2.846m5.504 4.206c.404.453.774.927 1.104 1.42m-1.104-1.42c-.52-.584-1.1-1.192-1.74-1.817M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    },
    {
      id: 4,
      name: 'Cargador Inalámbrico MagSafe',
      category: 'Accesorios',
      price: '$59.00',
      rating: 4.5,
      reviews: 58,
      badge: null,
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
        </svg>
      )
    }
  ];

  return (
    <div>
      {/* Encabezado */}
      <div className="page-header">
        <h1>Catálogo de Productos</h1>
        <p className="page-subtitle">Administra y previsualiza los productos estrella de tu tienda.</p>
      </div>

      {/* Grid de Productos */}
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {/* Imagen / Icono de producto */}
            <div className="product-img-wrapper">
              {product.badge && <span className="product-badge">{product.badge}</span>}

              <div className="product-action-overlay">
                <button className="overlay-btn">Ver Detalles</button>
              </div>

              {product.icon}
            </div>

            {/* Información del producto */}
            <div className="product-info">
              <div>
                <span className="product-category">{product.category}</span>
                <h3 className="product-name" title={product.name}>{product.name}</h3>
              </div>

              {/* Puntuación */}
              <div className="product-rating">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {product.rating}
                <span>({product.reviews} opiniones)</span>
              </div>

              {/* Precio y Añadir al Carro */}
              <div className="product-footer">
                <span className="product-price">{product.price}</span>
                <button className="add-cart-btn" title="Añadir al carro">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
