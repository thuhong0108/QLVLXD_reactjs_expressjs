
import { MenuItem, Select } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useRef, useState } from 'react';
import { getAllCategories } from '../../services/category';
import { getAllProducts, getProductsByCategory } from '../../services/product';
import Product from '../Product';
import './style.scss';

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);

    const elementRef = useRef(null);

    const getAllProductsFn = async () => {
        setLoading(true);
        const response = await getAllProducts();
        setProducts(response.data);
        setLoading(false);
        elementRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const getProductsByCategoryFn = async (categoryId) => {
        setLoading(true);
        const response = await getProductsByCategory(categoryId);
        setProducts(response.data);
        setLoading(false);
        elementRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    useEffect(() => {
        (async() => {
            const response = await getAllCategories();
            const categories = response.data;
            categories.unshift({ _id: 'all', name: 'All' });
            setCategories(categories);

            getAllProductsFn();
        })()
    }, []);

    const onSelectedCategoryChange = async (value) => {
        setSelectedCategory(value);
        if (value === 'all') {
            getAllProductsFn();
        } else {
            getProductsByCategoryFn(value);
        }
    }

    return ( 
        <div className="products container" ref={elementRef}>
            {
                !loading ? (
                    <>
                        <h2 className="products__heading">SẢN PHẨM TẠI SHOP</h2>
                        <div className='products__category'>
                            <Select value={selectedCategory} onChange={(e) => onSelectedCategoryChange(e.target.value)}>
                                {
                                    categories.map(category => (
                                        <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </div>
                        <div className='products__list'>
                            {
                                products.map(item => (
                                    <Product key={item._id} product={item} />
                                ))
                            }
                        </div>
                    </>
                ) : (
                    <CircularProgress />
                )
            }

        </div>
     );
}

export default Products;