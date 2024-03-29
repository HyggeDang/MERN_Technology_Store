// Library
import { clsx } from 'clsx';

// Local
import style from './customerOrder.module.scss';
import images from 'assets/images';

// React
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Api
import orderApi from 'api/modules/order.api';

// Antd
import { Col, Row } from 'antd';

// Icon
import {AiOutlineRollback} from 'react-icons/ai';

const CustomersOrder = () => {
    const status = ['pending-Đang xử lý', 'processing-Đang giao', 'delivered-Đã giao', 'cancel-Hủy đơn hàng'];
    const idUser = useParams();
    const [orders, setOrders] = useState([]);
    const handlePercent = (price, discount) => {
        return price - (price * (discount / 100));
    }
    const handleString = (str) => {
        const newStr = str.slice(0, str.indexOf("T"));
        return newStr;
    }
    const getApiOrders = async () => {
        try {
            const response = await orderApi.searchCart({
                idUser: idUser.id
            });
            setOrders(response.order);
        }
        catch (err) {
            console.log(err);
        }
    }
    const handleStatus = (str) => {
        const newStr = str.slice(str.indexOf("-") + 1, str.length);
        return newStr;
    }
    const convertStatus = (statusOrder) => {
        const result = status.filter((item, index) => {
            return item.includes(statusOrder);
        });
        return handleStatus(result[0]);
    }
    useEffect(() => {
        getApiOrders();
    }, []);
    return (
        <main className={clsx(style.main)}>
            <section className={clsx(style.customerOrder)}>
                {
                    orders.length > 0 ?
                        (
                            <>
                                <section className={clsx(style.customerOrder__head)}>
                                    <h1>Quản lý đơn hàng</h1>
                                    <Link to="/dashboard/customers">
                                        <button>
                                            <AiOutlineRollback className={clsx(style.icon)} />
                                            <span>Trở về</span>
                                        </button>
                                    </Link>
                                </section>
                                <section className={clsx(style.customerOrder__body)}>
                                    {
                                        orders.map((item, index) => {
                                            return (
                                                <section key={index} className={clsx(style.inforOrder)}>
                                                    <Row
                                                        gutter={[{ xl: 20 }, { xl: 20 }]}
                                                        align={"middle"}
                                                    >
                                                        <Col xl={24}>
                                                            <section className={clsx(style.inforOrder__head)}>
                                                                <h1>{`Ngày mua: ${handleString(item.cart.createdAt)}`}</h1>
                                                            </section>
                                                        </Col>
                                                        {
                                                            item.cart.product.map((item2, index) => {
                                                                return (
                                                                    <Col xl={12} key={index}>
                                                                        <section className={clsx(style.inforOrder__body)}>
                                                                            <img src={`data:image/png;base64,${item2.idRef.img}`} alt="" />
                                                                            <p>{`Tên sản phẩm: ${item2.idRef.name}`}</p>
                                                                            <p className={clsx(style.price)}>{`Giá sản phẩm: ${handlePercent(Number(item2.idRef.price), Number(item2.idRef.discount)).toLocaleString()} đ`}</p>
                                                                            <p>{`Số lượng: ${item2.quantity}`}</p>
                                                                            <p className={clsx(style.finish)}>{convertStatus(item.status)}</p>
                                                                            <Link to={`/product/detail/${item2.idRef._id}`} target='_blank'>
                                                                                Xem chi tiết
                                                                            </Link>
                                                                        </section>
                                                                    </Col>
                                                                )
                                                            })
                                                        }

                                                    </Row>
                                                </section>
                                            )
                                        })
                                    }
                                </section>
                            </>

                        )
                        :
                        (
                            <section className={clsx(style.customerOrder__empty)}>
                                <img src={images.account.emptyOrder} alt="emptyProduct" />
                                <p>Khách hàng chưa mua sản phẩm nào !</p>
                                <Link to="/dashboard/customers">
                                    <button>
                                        <AiOutlineRollback className={clsx(style.icon)} />
                                        <span>Trở lại</span>
                                    </button>
                                </Link>
                            </section>
                        )
                }
            </section>
        </main>
    )
}

export default CustomersOrder;