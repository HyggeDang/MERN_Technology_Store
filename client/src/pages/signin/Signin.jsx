// Validate
import { useFormik } from "formik";
import * as Yup from 'yup';

// Library
import clsx from 'clsx';

// Icon
import { FaUserAlt, FaLock, FaFacebook, FaGoogle } from 'react-icons/fa';

// Antd
import { Row, Col } from 'antd';

// React
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

// Local
import images from "assets/images";
import style from './signin.module.scss';

// Component
import SelectSpeed from "component/selectSpeed/SelectSpeed";

// Api
import userApi from "api/modules/user.api";

// Module
import toastNotification from "handler/toast.handler";
import { QuantityCart } from "layouts/AppLayout/AppLayout";

// Authentication with google and facebook
import { auth, fbProvider, ggProvider } from '../../firebase/config';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'

const Signin = () => {
    let navi = useNavigate();
    const updateQuantityCart = useContext(QuantityCart);
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Tên tài khoản không được để trống"),
            password: Yup.string().required("Mật khẩu không thể để trống"),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await userApi.signIn({ username: values.username, password: values.password });
                if (response.admin === true) {
                    localStorage.setItem("admin", JSON.stringify(response.admin));
                    toastNotification('success', 'Đăng nhập vào tài tài khoản quản trị thành công !', 1500);
                    setTimeout(() => {
                        resetForm();
                        updateQuantityCart();
                        navi('/dashboard');
                    }, 1500);
                }
                else {
                    localStorage.setItem("userName", JSON.stringify(response.username));
                    localStorage.setItem("idUser", JSON.stringify(response._id));
                    toastNotification('success', 'Đăng nhập thành công trở về trang chủ mua hàng nhé!', 1500);
                    setTimeout(() => {
                        resetForm();
                        updateQuantityCart();
                        navi('/');
                    }, 1500);
                }

            }
            catch (err) {
                if (err === "notUsername") {
                    toastNotification('error', 'Đăng nhập thất bại sai tên tài khoản hãy thử lại !', 1500);
                }
                else {
                    toastNotification('error', 'Đăng nhập thất bại, sai mật khẩu, hãy thử lại !', 1500);
                }
                console.log(err);
            }
        }
    });

    const handleLoginWithFacebook = async () => {
        try {
            const result = await signInWithPopup(auth, fbProvider);
            toastNotification('success', 'Đăng nhập với Facebook thành công !', 1000);
        }
        catch (err) {
            console.log(`Error: ${err}`);
        }
    }

    auth.onAuthStateChanged((user) => {
        console.log({ user });
        if (user) {
            localStorage.setItem("userAuth", JSON.stringify(user));
            updateQuantityCart();
            navi('/');
        }
    })

    const handleLoginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, ggProvider);
            toastNotification('success', 'Đăng nhập với Google thành công !', 1000);
        }
        catch (err) {
            console.log(`Error: ${err}`);
        }
    }

    const handleLogoutWith = async (type) => {
        try {
            const logout = await signOut(auth);
            toastNotification('success', 'Tài khoản của bạn đã được đăng xuất !', 1000);
        }
        catch (err) {
            console.log(`Error: ${err}`);
        }
    }
    return (
        <section className={clsx(style.signin)}>
            <SelectSpeed />
            <Row gutter={[{ lg: 60, md: 40, xs: 0 }, { lg: 60, md: 40, xs: 0 }]} className={clsx(style.row)}>
                <Col xl={15} lg={12} xs={0}>
                    <section className={clsx(style.signin__introduce)}>
                        <img src={images.signin.login} alt="logo" />
                    </section>
                </Col>
                <Col xl={9} lg={12} xs={24}>
                    <form action="#" className={clsx(style.signin__formSignin)} onSubmit={formik.handleSubmit}>
                        <section className={clsx(style.formTitle)}>
                            <h1>Đăng nhập</h1>
                        </section>
                        <section className={clsx(style.formGroup, style.formGroupUsername)} >
                            <input
                                type="text"
                                name="username"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                placeholder="Tên tài khoản"
                            />
                            <FaUserAlt className={clsx(style.icon)} />
                            {formik.errors.username && (<p className={clsx(style.errorMessage)}>{formik.errors.username}</p>)}
                        </section>
                        <section className={clsx(style.formGroup)} >
                            <input
                                type="password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                placeholder="Mật khẩu"
                            />
                            <FaLock className={clsx(style.icon)} />
                            {formik.errors.password && (<p className={clsx(style.errorMessage)}>{formik.errors.password}</p>)}
                        </section>
                        <section className={clsx(style.formGroup)}>
                            <input
                                type="submit"
                                name="inputSubmit"
                                value="Đăng nhập"
                                className={clsx(style.submit)}
                            />
                        </section>
                        <section className={clsx(style.signup)}>
                            <Link to="/signup">
                                Bạn chưa có tài khoản ?
                            </Link>
                            <a href="#">Quên mật khẩu ?</a>
                        </section>
                        <section className={clsx(style.signinWith)}>
                            <div className={clsx(style.signinWith__title)}>
                                <h1>Hoặc đăng nhập với</h1>
                            </div>
                            <div className={clsx(style.signinWith__wrapper)}>
                                <div
                                    className={clsx(style.facebook)}
                                    onClick={handleLoginWithFacebook}
                                >
                                    <FaFacebook className={clsx(style.icon)} />
                                    <span>facebook</span>
                                </div>
                                <div
                                    className={clsx(style.google)}
                                    onClick={handleLoginWithGoogle}
                                >
                                    <FaGoogle className={clsx(style.icon)} />
                                    <span>google</span>
                                </div>
                            </div>
                        </section>
                    </form>
                </Col>
            </Row>
        </section>
    )
}

export default Signin;