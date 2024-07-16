import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    CardActions,
    Button,
    Badge,
    Box,
    Chip,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from 'axios';

const BASE_URL = 'https://json-server-c67opnddza-el.a.run.app';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [topN, setTopN] = useState(10);
    const [minPrice, setMinPrice] = useState(1);
    const [maxPrice, setMaxPrice] = useState(10000);

    useEffect(() => {
        axios.get(`${BASE_URL}/categories`)
        .then((res) => {
            const categories = res.data.map(categoriesname => categoriesname.name);
            setCategories(["All", ...categories]);
        })
        axios.get(`${BASE_URL}/companies`)
        .then((res) => {
            const companies = res.data.map(companiesName => companiesName.name);
            setCompanies(["All", ...companies]);
        })
        fetchProducts();
    }, [selectedCompany, selectedCategory, topN, minPrice, maxPrice]);

    const fetchProducts = () => {
        if (selectedCompany === 'All' && selectedCategory !== 'All') {
            axios.get(`${BASE_URL}/categories/${selectedCategory}/products?top=${topN}&minPrice=${minPrice}&maxPrice=${maxPrice}`)
            .then((res) => {
                setProducts(res.data);
            })
        } else if (selectedCompany === 'All' && selectedCategory === 'All') {
            axios.get(`${BASE_URL}/products`)
            .then((res) => {
                console.log(res.data);
                setProducts(res.data);
            })
        } else if (selectedCompany !== 'All' && selectedCategory !== 'All') {
            axios.get(`${BASE_URL}/companies/${selectedCompany}/categories/${selectedCategory}/products?top=${topN}&minPrice=${minPrice}&maxPrice=${maxPrice}`)
            .then((res) => {
                console.log(res.data);
                setProducts(res.data);
            })
        } else if (selectedCompany !== 'All' && selectedCategory === 'All') {
            axios.get(`${BASE_URL}/companies/${selectedCompany}/products?top=${topN}&minPrice=${minPrice}&maxPrice=${maxPrice}`)
            .then((res) => {
                console.log(res.data);
                setProducts(res.data);
            })
        }
        // else {
        //     axios.get(`${BASE_URL}/${company}/categories/${category}/products`).then((res) => {
        //         console.log(res.data);
        //         setProducts(res.data);
        //     })
        // }

    };

    return (
        <div
        id='productPage'>
            <h1>All Products</h1>
            <FormControl 
            id="companyLabel">
                <InputLabel
                id="companyField"
                >
                Company
                </InputLabel>
                <Select
                id='selectCompany'
                label="Company"
                onChange={(CompanyNameEvent) => setSelectedCompany(CompanyNameEvent.target.value)}
                style={{ width: '100px' }}
                value={selectedCompany}
                >
                    {companies?.map((company) => (
                        <MenuItem key={company} value={company}>
                            {company}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl
            id="categoryForm">
                <InputLabel
                id="categoryLabel"
                style={{ width: '100px',marginLeft:'10px' }}
                >
                Category
                </InputLabel>
                <Select
                    id="selectCategory"
                    label="Category"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ width: '100px',marginLeft:'10px' }}
                    value={selectedCategory}
                    >
                    {categories?.map((category) => (
                        <MenuItem
                            id="menuItems" 
                            key={category}
                            value={category}
                           >
                            {category}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
            id='topN'
            inputProps={{ min: 1, max: 100 }}
            label="Top N"
            onChange={(e) => setTopN(e.target.value)}
            style={{ margin: '0 10px' }}
            type="number"
            value={topN}
            />
            <TextField
            id='minPrice'
            inputProps={{ min: 1 }}
            label="Min Price"
            onChange={(e) => setMinPrice(e.target.value)}
            style={{ margin: '0 10px' }}
            type="number"
            value={minPrice}   
            />
            <TextField
            id='maxPrice'
            inputProps={{ min: 1 }}
            label="Max Price"
            onChange={(e) => setMaxPrice(e.target.value)}      
            style={{ margin: '0 10px' }}
            type="number"
            value={maxPrice}    
            />
            <br/>
            <br/>
            <br/>
            <Grid 
            container spacing={2}
            >
                {products.map(({ availability, category, company, discount, price, productName, rating, id }) => (
                    <Card
                        key={id}
                        sx={{ maxWidth: 345, m: 2, position: 'relative', cursor: 'pointer' }}
                        // onClick={() => navigate(`/product/${id}`)}
                    >
                        <Badge
                        badgeContent="Unavailable"
                        color="error"
                        invisible={availability !== "no"}
                        sx={{ position: 'absolute', top: 20, left: 50 }}
                        />
                        <CardMedia
                        alt={productName}
                        component="img"
                        height="140"
                        image={`https://fastly.picsum.photos/id/20/3670/2462.jpg?hmac=CmQ0ln-k5ZqkdtLvVO23LjVAEabZQx2wOaT4pyeG10I`}
                        loading="lazy"
                        />
                        <CardContent>
                            <Typography
                            component="div"
                            gutterBottom
                            variant="h5"  
                            >
                            {productName}
                            </Typography>
                            <Typography
                            color="text.secondary"
                            variant="body2"   
                            >
                            {category} by {company}
                            </Typography>
                            <Box
                            sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
                            >
                                <StarIcon sx={{ color: 'gold' }} 
                                />
                                <Typography 
                                color="text.secondary"
                                sx={{ ml: 0.5 }}
                                variant="body2"                                 
                                >
                                {rating}
                                </Typography>
                            </Box>
                            <Typography
                            component="div"
                            sx={{ mt: 1 }} 
                            variant="h6" 
                            >
                                ${price}
                                {discount > 0 && (
                                    <Chip
                                    color="success"
                                    label={`${discount}% OFF`}
                                    size="small"
                                    sx={{ ml: 1 }}
                                    />
                                )}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                            color="primary"
                            disabled={availability === "no"}
                            size="small"
                            startIcon={<ShoppingCartIcon />}
                            >
                            Add to Cart
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </Grid>
        </div>
    );
};

export default AllProducts;
