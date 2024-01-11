import { Button, MenuItem, Select, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import { getAllProvinces, getDistricts, getWards } from '../../services/checkout';
import { order } from '../../services/sale';
import { formatPrice } from '../../utils';
import './style.scss';

function Checkout() {
    const navigate = useNavigate();

    const [carts, setCarts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const requiredMsg = 'Trường này là bắt buộc';
    const form = useFormik({
        initialValues: { name: '', phone: '', email: '', address: '', province: '', district: '', ward: '' },
        validationSchema: Yup.object({
            name: Yup.string().required(requiredMsg),
            phone: Yup.string().required(requiredMsg).matches(/^[0-9\-\+]{9,15}$/, 'Số điện thoại không hợp lệ'),
            email: Yup.string().required(requiredMsg).email('Trường này phải là email'),
            address: Yup.string().required(requiredMsg),
            province: Yup.string().required(requiredMsg),
            district: Yup.string().required(requiredMsg),
            ward: Yup.string().required(requiredMsg),
        }),
        onSubmit: async (values) => {
            const { name, phone, email, address } = values;
            const customer = { name, phone, email, address };
            const payload = [customer, carts];
            const data = await order(payload);
            if (data.success) {
                localStorage.removeItem('carts');
                setCarts([]);
                toast.success(data.message);
            }
        }
    });

    const user = JSON.parse(localStorage.getItem('user')) || [];
    if (user) {
        form.values.name = user.username;
        form.values.email = user.email;
    }


    useEffect(async () => {
        const cartList = JSON.parse(localStorage.getItem('carts')) || [];
        setCarts(cartList);
        const totalPrice = cartList.reduce((total, item) => total + (item.price * item.quantity), 0);
        setTotalPrice(totalPrice);
    }, []);

    useEffect(async () => {
        const provinces = await getAllProvinces();
        setProvinces(provinces);
    }, []);

    const handleProvinceChange = async (event) => {
        form.handleChange(event);
        const id = event.target.value;
        const districts = await getDistricts(id);
        setDistricts(districts);
    }

    const handleDistrictChange = async (event) => {
        form.handleChange(event);
        const id = event.target.value;
        const wards = await getWards(id);
        setWards(wards);
    }

    const redirectToHomePage = () => {
        navigate('/');
    }

    return ( 
        <div className='checkout container'>
            {
                carts.length > 0 ? (
                    <>
                        <h1 className="checkout__heading">Đặt hàng</h1> 
                        <form className="checkout__infor" onSubmit={form.handleSubmit}>
                            <div className="checkout__infor-person">
                                <h3>Thông tin nhận hàng</h3>
                                <form className="checkout__infor-person-form">
                                    <div className="checkout__infor-person-row">
                                        <label>Họ tên</label>
                                        <TextField
                                            id='name' 
                                            name='name' 
                                            placeholder='Họ tên'
                                            value={form.values.name}
                                            onChange={form.handleChange}
                                        />
                                        <span className='checkout__infor-person-mess'>{ form.errors.name ? form.errors.name : '' }</span>
                                    </div>
                                    <div className="checkout__infor-person-row">
                                        <div>
                                            <label>Số điện thoại</label>
                                            <TextField
                                                placeholder='Số điện thoại' 
                                                id='phone' 
                                                name='phone'
                                                value={form.values.phone}
                                                onChange={form.handleChange} 
                                            />
                                            <span className='checkout__infor-person-mess'>{ form.errors.phone ? form.errors.phone : '' }</span>       
                                        </div>

                                        <div>
                                            <label>Email</label>
                                                <TextField
                                                placeholder='Email' 
                                                id='email' 
                                                name='email' 
                                                value={form.values.email}
                                                onChange={form.handleChange}
                                            /> 
                                            <span className='checkout__infor-person-mess'>{ form.errors.email ? form.errors.email : '' }</span>             
                                        </div>
                                    </div>
                                    <div className="checkout__infor-person-row">
                                        <div className="checkout__infor-person-wrap">
                                            <label>Địa chỉ nhận hàng</label>
                                            <TextField
                                                placeholder='Địa chỉ nhận hàng' 
                                                id='address' 
                                                name='address' 
                                                value={form.values.address}
                                                onChange={form.handleChange}
                                            /> 
                                        </div>
                                        <span className='checkout__infor-person-mess'>
                                            {form.errors.address ? form.errors.address : ''}       
                                        </span>
                                    </div>  
                                    <div className="checkout__infor-person-row">
                                        <div>
                                            <label>Tỉnh / Thành phố</label>
                                            <Select id='province' name='province' value={form.values.province} onChange={handleProvinceChange}>
                                                {
                                                    provinces.map(item => (
                                                        <MenuItem label={item.name} key={item.id} value={item.id}>{item.name}</MenuItem>
                                                    ))
                                                }
                                            </Select>   
                                            <span className='checkout__infor-person-mess'>{form.errors.province ? form.errors.province : '' }</span>     
                                        </div>
                                        <div>
                                            <label>Quận / Huyện</label>
                                            <Select id='district' name='district' value={form.values.district} onChange={handleDistrictChange}>
                                                {
                                                    districts.map(item => (
                                                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                                    ))
                                                }
                                            </Select> 
                                            <span className='checkout__infor-person-mess'>{ form.errors.district ? form.errors.district : '' } </span>        
                                        </div>
                                        <div>
                                            <label>Phường / Xã</label>
                                            <Select id='ward' name='ward' value={form.values.ward} onChange={form.handleChange}>
                                                {
                                                    wards.map(item => (
                                                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                                    ))
                                                }
                                            </Select>   
                                            <span className='checkout__infor-person-mess'>{ form.errors.ward ? form.errors.ward : '' }</span>      
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="checkout__infor-order">
                                <h3>Thông tin đơn hàng</h3>
                                <div className="checkout__infor-order-form">
                                    <div className="checkout__infor-order-list">
                                        {
                                            carts.map(item => (
                                                <div className="checkout__infor-order-item" key={item._id}>
                                                    <div className="checkout__infor-order-basic">
                                                        <p className="checkout__infor-order-name">{item.name} 
                                                            <span>X{item.quantity}</span>
                                                        </p>
                                                    </div>
                                                    <span className="checkout__infor-order-totalitem">{formatPrice(item.price * item.quantity)}</span>
                                                </div>
                                            ))
                                        }    
                                    </div>
                                    <div className="checkout__infor-order-total checkout__infor-order-group">
                                        <h4>TỔNG CỘNG</h4>
                                        <span>{formatPrice(totalPrice)}</span>
                                    </div>
                                    <Button type='submit' variant="contained" className="checkout__infor-order-button" disabled={!form.isValid}>
                                        Đặt hàng
                                    </Button>
                                </div>
                            </div>    
                        </form>
                    </>
                ) : (
                    <div className='checkout__empty'>
                        <h3>Hiện không có sản phẩm nào cần thanh toán</h3>
                        <Button variant="outlined" onClick={redirectToHomePage}>Quay lại cửa hàng</Button>
                    </div>
                )
            }
        </div>
     );
}

export default Checkout;