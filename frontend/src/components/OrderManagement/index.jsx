import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { getAllOrders } from '../../services/sale';
import './style.scss';
import { formatPrice } from '../../utils';

function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async() => {
            const response = await getAllOrders();
            setOrders(response.data);
            setLoading(false);
        })()
    }, [])

    return ( 
        <div className="orderMan container">
            {
                !loading ? (
                    <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Khách hàng</TableCell>
                                        <TableCell>Ngày đặt hàng</TableCell>
                                        <TableCell>Tổng tiền</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        orders.map(item => (
                                            <TableRow key={item._id}>
                                                <TableCell>{item.customer.name}</TableCell>
                                                <TableCell>{item.orderDate}</TableCell>
                                                <TableCell>{formatPrice(item.totalPrice)}</TableCell>
                                                <TableCell>{item.status}</TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                ) : (
                    <CircularProgress />
                )
            }
        </div>
     );
}

export default OrderManagement;