// Library
import clsx from 'clsx';

// Local
import style from './selectSpeed.module.scss';
import images from 'assets/images/index';

// React
import { useEffect, useState, useRef } from 'react';

// Variables Global
const datasocialNetwork = [
    { icon: images.socialNetWork.phone, path: 'tel: 0369880010'},
    { icon: images.socialNetWork.fB, path: 'https://www.facebook.com/hiepdang.fb/' },
    { icon: images.socialNetWork.mess, path: 'https://www.facebook.com/hiepdang.fb/' },
    { icon: images.socialNetWork.map, path: 'https://maps.app.goo.gl/8ycWAxnLpDP9MLmRA'}, 
    { icon: images.socialNetWork.youtube, path: 'https://www.youtube.com/@hiepdang.yt' },
    { icon: images.socialNetWork.email, path: 'mailto: thihiepdang.bh@gmail.com' },
];

const SelectSpeed = () => {
    const [show, setShow] = useState(false);
    var goToTopRef = useRef();
    useEffect(() => {
        const handleScroll = () => {
            setShow(window.scrollY >= 300);
        }
        window.removeEventListener('scroll', handleScroll);
        window.addEventListener('scroll', handleScroll, {passive: true});
        return () => window.removeEventListener('scroll', handleScroll);
    },[show]);
    const handleClick = () => {
        goToTopRef.current.style = 'animation: smoothBack 1.5s linear 1; transform: translateX(150%);';
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    return (
        <main className={clsx(style.selectSpeed)}>
            <ul className={clsx(style.navList)}>
                {
                    datasocialNetwork.map((item, index) => {
                        return (
                            <li key={index} className={clsx(style.navItem)}>
                                <a href={item.path} target='_blank'>
                                    <img src={item.icon} alt="icon"/>
                                </a>
                            </li>
                        )
                    })
                }
            </ul>
            {
                <button 
                    style={{transform: `${!show ? 'translateX(150%)' : 'translateX(0)'}`}} ref={goToTopRef} 
                    onClick={handleClick} className={clsx(style.btn, style.btnGoToTop)}
                >
                    <img src={images.socialNetWork.goToTop} alt="alt"/>
                </button>
            }
        </main>
    )
}
export default SelectSpeed;