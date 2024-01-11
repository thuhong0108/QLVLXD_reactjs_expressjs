import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog,
    DialogTitle, DialogContent, TextField, DialogActions, Select, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { addProduct, editProduct, getAllProducts, uploadImage } from '../../services/product';
import { formatPrice } from '../../utils';
import './style.scss';
import CircularProgress from '@mui/material/CircularProgress';
import { getAllCategories } from '../../services/category';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(true);

    const [image, setImage] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const form = useFormik({
        initialValues: { _id: '', name: '', description: '', price: '', category: '' }
    });

    useEffect(() => {
        getAllProductsFn();
    }, []);

    const getAllProductsFn = async () => {
        setLoading(true);
        const response = await getAllProducts();
        setProducts(response.data);
        setLoading(false);
    }

    const handleImageChange = (e) => {
        const files = e.target.files;
        setSelectedFile(files[0]);
    }

    const handleOpenDialog = async (item) => {
        setOpenDialog(true);
        const response = await getAllCategories();
        setCategories(response.data);
        if (item) {
            const { _id, name, description, price, category } = item;
            form.setValues({ _id, name, description, price, category: category._id });
            setImage(item.image)
        }
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
        form.resetForm();
        setSelectedFile(null);
        setImage('');
    }

    const onSubmit = async () => {    
        if (validationForm()) {
            // upload image to cloud
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('upload_preset', 'instagramimages');
                var file = await uploadImage(formData); 
            }

            const { name, description, price, category } = form.values;
            const data = { name, description, price, image: selectedFile ? file.secure_url : image };

            if (form.values._id) {
                data.category = category;
                await editProduct(form.values._id, data);
                toast.success('Cập nhật sản phẩm thành công');
            } else {
                await addProduct(category, data);
                toast.success('Thêm sản phẩm thành công');
            } 
            handleCloseDialog();
            getAllProductsFn();
        } else {
            toast.error('Hãy nhập đầy đủ thông tin');
        }
    }

    const handleCategoryChange = (e) => { 
        form.setFieldValue('category', e.target.value);
    }

    const validationForm = () => {
        const { name, description, price, category } = form.values;
        return !!(name && description && price && category && (selectedFile || image ));
    }

    return ( 
        <div className="productMan container">
            {
                !loading ? (
                    <>
                        <Button variant="contained" onClick={() => handleOpenDialog(null)}>Thêm mới</Button>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell>Sản phẩm</TableCell>
                                        <TableCell>Loại sản phẩm</TableCell>
                                        <TableCell>Giá</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        products.map(item => (
                                            <TableRow key={item._id}>
                                                <TableCell>
                                                    <img className='productMan__image' src={item.image} />
                                                </TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.category.name}</TableCell>
                                                <TableCell>{formatPrice(item.price)}</TableCell>
                                                <TableCell>
                                                    <div className='productMan__action'>
                                                        <EditIcon onClick={() => handleOpenDialog(item)} />
                                                        <DeleteIcon />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Thêm sản phẩm mới */}
                        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
                            <DialogTitle>{ image ? 'Sửa sản phẩm': 'Thêm sản phẩm' }</DialogTitle>
                            <DialogContent>
                                <div className='productMan__row'>
                                    <label>Tên</label>
                                    <TextField id="name" fullWidth value={form.values.name} onChange={form.handleChange} />
                                </div>
                                <div className='productMan__row'>
                                    <label>Mô tả</label>
                                    <TextField id="description" fullWidth value={form.values.description} onChange={form.handleChange} multiline rows={3} />
                                </div>
                                <div className='productMan__group'>
                                    <div>
                                        <label>Giá</label>
                                        <TextField id="price" fullWidth value={form.values.price} onChange={form.handleChange} type='number' />
                                    </div>
                                    <div>
                                        <label >Loại sản phẩm</label>
                                        <Select value={form.values.category} onChange={handleCategoryChange}>
                                            {
                                                categories.map(category => (
                                                    <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </div>
                                </div>
                                <div className='productMan__row'>
                                    <label>Hình ảnh</label>
                                    <TextField id="file" type="file" fullWidth onChange={handleImageChange} />
                                    { image && <img src={image} /> }
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog}>Hủy</Button>
                                <Button onClick={onSubmit}>Lưu</Button>
                            </DialogActions>
                        </Dialog>
                    </>
                ) : (
                    <CircularProgress />
                )
            }
        </div>
     );
}

export default ProductManagement;