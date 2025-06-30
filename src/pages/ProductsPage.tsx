import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { productService, Product } from '../services';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartIcon from '../components/Cart/CartIcon'
import './styles/ProductsPage.css';

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);    

    // Price filter states
    const [priceRange, setPriceRange] = useState<{min: number, max: number}>({min: 0, max: 0});
    const [selectedPriceRange, setSelectedPriceRange] = useState<{min: number, max: number}>({min: 0, max: 0});
    const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);

    // Sort state
    const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

    // Cart state
    const { addToCart, loading: cartLoading } = useCart();
    const [addingToCart, setAddingToCart] = useState<number | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        const dropdown = document.getElementById('category-dropdown');
        const priceDropdown = document.getElementById('price-filter-dropdown');
        const sortDropdown = document.getElementById('sort-dropdown');
        
        if (dropdown && !dropdown.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        }

        if (priceDropdown && !priceDropdown.contains(event.target as Node)) {
            setIsPriceFilterOpen(false);
        }

        if (sortDropdown && !sortDropdown.contains(event.target as Node)) {
            setIsSortDropdownOpen(false);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getAllProducts();
      
      if (response.data) {
        // Handle the response
        // structure { Message: string, Data: Products[] }
        if (response.data.data && Array.isArray(response.data.data)) {
            setProducts(response.data.data);
        } else   {
            console.error("Unexpected response strcuture:", response.data)
            setProducts([])
        }
        
      } else {
        setError(response.error || 'Failed to fetch products');
      }
    } catch (err) {
      setError('An error occurred while fetching products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

   const handleAddToCart = async (productId: number) => {
        try {
            setAddingToCart(productId);
            await addToCart(productId, 1);
            // You could add a success notification here
        } catch (error) {
            console.error('Failed to add to cart:', error);
            // You could add an error notification here
        } finally {
            setAddingToCart(null);
        }
    };


  // Helper function to split categories
  const splitCategories = (categoryString: string): string[] => {
    if(!categoryString) return [];
    return categoryString.split(',').map(cat => cat.trim()).filter(cat => cat.length > 0); // trim white spaces and empty cats
  };

  // Extract unique categories from products
  const categories = useMemo(() => { 
    const allCategories = new Set<string>();

    products.forEach(product => {
        const productCategories = splitCategories(product.productCategory);
        productCategories.forEach(cat => allCategories.add(cat));
    })
    return Array.from(allCategories).sort();
  }, [products])


  // Filter products - a product matches if ANY of their categories is selected
  // Also filtering products by price range
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by categories first
    if (selectedCategories.size > 0) {
        filtered = filtered.filter(product =>  {
            const productCategories = splitCategories(product.productCategory);
            return productCategories.some(cat => selectedCategories.has(cat));
        })
    }


    // Then Filter by price
    filtered = filtered.filter(product => 
        product.productPrice >= selectedPriceRange.min && 
        product.productPrice <= selectedPriceRange.max
    );

    // Now apply sorting
    if (sortBy === 'price-asc') {
        filtered = [...filtered].sort((a,b) => a.productPrice - b.productPrice);
    } else if (sortBy == 'price-desc') {
        filtered = [...filtered].sort((a,b) => b.productPrice - a.productPrice);
    }

    return filtered;
  }, [products, selectedCategories, selectedPriceRange, sortBy]);


  // Sort Options
  const sortOptions = [
    {value: 'default', label: 'Default'},
    {value: 'price-asc', label: 'Price: Low to High'},
    {value: 'price-desc', label: 'Price: High to Low'}
  ];


  // Get current sorting
  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortBy);
    return option ? option.label : 'Default';
  }

  // Handle price ranges change
  const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
    setSelectedPriceRange(prev => ({
        ...prev,
        [type]: value
    }));
  }

  // Reset the price filter 
  const resetPriceFilter = () => {
    setSelectedPriceRange({min: priceRange.min, max: priceRange.max});
  }

  // Check if price filter is active
  const isPriceFilterActive = selectedPriceRange.min !== priceRange.min || selectedPriceRange.max !== priceRange.max;

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
        const newSet = new Set(prev);
        if(newSet.has(category)) {
            newSet.delete(category);
        } else {
            newSet.add(category)
        }

        return newSet;
    })
  }

  // Clear all selections
  const clearAllCategories = () => {
    setSelectedCategories(new Set());
  };

  // Select all categories
  const selectAllCategories = () => {
    setSelectedCategories(new Set(categories));
  };


  // Price filtering
  
  // Calculate min and max prices from the products
  useEffect(() => {
    if(products.length > 0) {
        const prices = products.map(p => p.productPrice);
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
        setPriceRange({min: minPrice, max: maxPrice});
        setSelectedPriceRange({min: minPrice, max: maxPrice});
    }
  }, [products]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculatePercentage = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 100;
  }

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading-spinner">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchProducts} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

return (
  <div className="products-container">
    <header className="products-header">
      <h1>Products</h1>
      <div className="header-actions">
        <Link to="/" className="back-link">← Back to Home</Link>
        <CartIcon /> {/* Add the cart icon here */}
      </div>
    </header>

    {/* Filters Section */}
    <div className="filters-section">
      {/* Category filter dropdown */}
      {categories.length > 0 && (
        <div className="category-dropdown-section">
          <div id="category-dropdown" className="category-dropdown">
            <button 
              className="dropdown-toggle"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedCategories.size === 0 
                  ? 'All Categories' 
                  : selectedCategories.size === 1
                  ? Array.from(selectedCategories)[0]
                  : `${selectedCategories.size} Categories Selected`}
              </span>
              <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-actions">
                  <button 
                    className="dropdown-action-btn"
                    onClick={selectAllCategories}
                  >
                    Select All
                  </button>
                  <button 
                    className="dropdown-action-btn"
                    onClick={clearAllCategories}
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="dropdown-items">
                  {categories.map(category => {
                    const count = products.filter(p => {
                      const productCategories = splitCategories(p.productCategory);
                      return productCategories.includes(category);
                    }).length;
                    
                    const isSelected = selectedCategories.has(category);
                    return (
                      <label 
                        key={category} 
                        className={`dropdown-item ${isSelected ? 'selected' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleCategory(category)}
                        />
                        <span className="category-name">{category}</span>
                        <span className="category-count">({count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Price filter */}
      {products.length > 0 && (
        <div className="price-filter-section">
          <button 
            className="price-filter-toggle"
            onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
          >
            <span>
              Price: {formatPrice(selectedPriceRange.min)} - {formatPrice(selectedPriceRange.max)}
              {isPriceFilterActive && <span className="filter-active-indicator">•</span>}
            </span>
            <span className={`dropdown-arrow ${isPriceFilterOpen ? 'open' : ''}`}>▼</span>
          </button>

          {isPriceFilterOpen && (
            <div id="price-filter-dropdown" className="price-filter-dropdown">
              <div className="price-inputs">
                <div className="price-input-group">
                  <label htmlFor="min-price">Min Price</label>
                  <input
                    id="min-price"
                    type="number"
                    min={priceRange.min}
                    max={selectedPriceRange.max}
                    value={selectedPriceRange.min}
                    onChange={(e) => handlePriceRangeChange('min', Number(e.target.value))}
                    className="price-input"
                  />
                </div>
                <div className="price-input-group">
                  <label htmlFor="max-price">Max Price</label>
                  <input
                    id="max-price"
                    type="number"
                    min={selectedPriceRange.min}
                    max={priceRange.max}
                    value={selectedPriceRange.max}
                    onChange={(e) => handlePriceRangeChange('max', Number(e.target.value))}
                    className="price-input"
                  />
                </div>
              </div>

            <div 
                className="price-range-slider"
                style={{
                    '--range-min': `${calculatePercentage(selectedPriceRange.min, priceRange.min, priceRange.max)}%`,
                    '--range-max': `${100 - calculatePercentage(selectedPriceRange.max, priceRange.min, priceRange.max)}%`
                } as React.CSSProperties}
                >
                <input
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    value={selectedPriceRange.min}
                    onChange={(e) => {
                    const newMin = Number(e.target.value);
                    if (newMin <= selectedPriceRange.max) {
                        handlePriceRangeChange('min', newMin);
                    }
                    }}
                    className="range-slider range-min"
                />
                <input
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    value={selectedPriceRange.max}
                    onChange={(e) => {
                    const newMax = Number(e.target.value);
                    if (newMax >= selectedPriceRange.min) {
                        handlePriceRangeChange('max', newMax);
                    }
                    }}
                    className="range-slider range-max"
                />
            </div>

              <div className="price-filter-actions">
                <button 
                  className="price-action-btn"
                  onClick={resetPriceFilter}
                  disabled={!isPriceFilterActive}
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      )}

        {/* Sort dropdown */}
        {products.length > 0 && (
            <div className="sort-section">
                <div id="sort-dropdown" className="sort-dropdown">
                    <button 
                        className="sort-toggle"
                        onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                    >
                        <span>Sort: {getCurrentSortLabel()}</span>
                        <span className={`dropdown-arrow ${isSortDropdownOpen ? 'open' : ''}`}>▼</span>
                    </button>

                    {isSortDropdownOpen && (
                        <div className="sort-menu">
                            {sortOptions.map(option => (
                                <button
                                    key={option.value}
                                    className={`sort-option ${sortBy === option.value ? 'active' : ''}`}
                                    onClick={() => {
                                        setSortBy(option.value as typeof sortBy);
                                        setIsSortDropdownOpen(false);
                                    }}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )}

    </div>

    {/* Active filters summary */}
    {(selectedCategories.size > 0 || isPriceFilterActive) && (
      <div className="active-filters-summary">
        <span className="filter-label">Active filters:</span>
        
        {selectedCategories.size > 0 && (
          <>
            {Array.from(selectedCategories).map(category => (
              <span key={category} className="filter-tag">
                {category}
                <button 
                  className="remove-filter"
                  onClick={() => toggleCategory(category)}
                >
                  ×
                </button>
              </span>
            ))}
          </>
        )}
        
        {isPriceFilterActive && (
          <span className="filter-tag price-filter-tag">
            Price: {formatPrice(selectedPriceRange.min)} - {formatPrice(selectedPriceRange.max)}
            <button 
              className="remove-filter"
              onClick={resetPriceFilter}
            >
              ×
            </button>
          </span>
        )}

        {sortBy !== 'default' && (
            <span className="filter-tag sort-filter-tag">
                Sort: {getCurrentSortLabel()}
                <button 
                    className="remove-filter"
                    onClick={() => setSortBy('default')}
                >
                    ×
                </button>
            </span>
        )}
        
        <button 
            className="clear-all-filters"
            onClick={() => {
                clearAllCategories();
                resetPriceFilter();
                setSortBy('default');
            }}
        >
            Clear All
        </button>
      </div>
    )}

    {/* Products Grid */}
    {filteredProducts.length === 0 ? (
      <div className="no-products">
        <p>
          {selectedCategories.size > 0 || isPriceFilterActive
            ? 'No products found matching your filters.' 
            : 'No products available at the moment.'}
        </p>
      </div>
    ) : (
      <div className="products-grid">
        {filteredProducts.map((product) => {
          const productCategories = splitCategories(product.productCategory);
          return (
            <div key={product.productId} className="product-card">
              <div className="product-header">
                <h3 className="product-name">{product.productName}</h3>
                <div className="product-categories">
                  {productCategories.map((cat, index) => (
                    <span key={index} className="product-category">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              
              <p className="product-description">{product.productDescription}</p>
              
              <div className="product-details">
                <div className="product-price">
                  {formatPrice(product.productPrice)}
                </div>
                <div className="product-stock">
                  <span className={`stock-badge ${product.productStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.productStock > 0 ? `${product.productStock} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>
              
              <div className="product-footer">
                <small>Updated: {formatDate(product.updatedAt)}</small>
                <button 
                        className="add-to-cart-button"
                        disabled={product.productStock === 0 || addingToCart === product.productId}
                        onClick={() => handleAddToCart(product.productId)}
                    >
                        {addingToCart === product.productId ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);
};


export default ProductsPage;