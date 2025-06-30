import React, { useState, useEffect } from 'react';
import { productService, Product, ProductRequest } from '../../services';
import './styles/ProductManagement.css';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<ProductRequest>({
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getAllProducts();
      
      if (response.data?.data) {
        setProducts(response.data.data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('An error occurred while fetching products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        // Update existing product
        const response = await productService.updateProduct(editingProduct.productId, formData);
        if (response.data) {
          await fetchProducts();
          setEditingProduct(null);
          resetForm();
        } else {
          setError(response.error || 'Failed to update product');
        }
      } else {
        // Create new product
        const response = await productService.createProduct(formData);
        if (response.data) {
          await fetchProducts();
          setShowAddForm(false);
          resetForm();
        } else {
          setError(response.error || 'Failed to create product');
        }
      }
    } catch (err) {
      setError('An error occurred while saving the product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.productName,
      description: product.productDescription,
      category: product.productCategory,
      price: product.productPrice,
      stock: product.productStock
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      price: 0,
      stock: 0
    });
    setEditingProduct(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="product-management">
      <div className="management-header">
        <h2>Product Management</h2>
        <button
          className="add-product-button"
          onClick={() => {
            setShowAddForm(true);
            resetForm();
          }}
        >
          Add New Product
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="product-form-container">
          <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Electronics, Clothing"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock Quantity</label>
                <input
                  type="number"
                  id="stock"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.productId}>
                <td>{product.productId}</td>
                <td>{product.productName}</td>
                <td>{product.productCategory}</td>
                <td>{formatPrice(product.productPrice)}</td>
                <td>
                  <span className={`stock-badge ${product.productStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.productStock}
                  </span>
                </td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;