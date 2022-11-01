import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames/bind';
import Image from 'next/image';

import styles from '../../styles/pages/categoryPage.module.scss';
import CategoryContent from './categoryContent';
import { getMenuCategory } from '../store/api/category';
import { categorySIdState } from '../store/atom/categoryState';
import { getPopularMenu } from '../store/api/popularMenu';
import { getCount, getCartMenuData } from '../store/api/cart';
import { useRecoilState, useRecoilValue } from 'recoil';
import { cartCntState, loginState, tokenState } from '../store/atom/userStates';
import { addComma } from '../store/utils/function';
import { getSessionCartCount } from '../store/utils/cart';
import { selectedStoreState } from '../store/atom/orderState';
import { IStore } from '../types/store';
import { IPopularMenuList } from '../types/popularMenu';
import MenuItem from './ui/menuItem';

const cx = classNames.bind(styles);
interface IDrinkList {
  index: number;
  menuId: number;
  menuTemperatureId: number;
  menuName: string;
  menuEngName: string;
  menuImg: string;
  price: number;
}
interface ITemp {
  query: number;
}

function categoryListContent({
  categoryName,
  setCategoryName,
}: {
  categoryName: string;
  setCategoryName: any;
}) {
  const router = useRouter();
  const isLogin = useRecoilValue(loginState);
  const token = useRecoilValue(tokenState);
  const [categorySId, setCategorySId] = useRecoilState(categorySIdState);
  const [selectedStoreTemp, setSelectedStoreTemp] = useState<IStore>({
    index: 0,
    storeId: 0,
    name: '',
    mainImg: '',
    address: '',
    businessOpenHours: '',
    businessCloseHours: '',
    isOpen: false,
    isParking: false,
    isEcoStore: false,
    isDriveThrough: false,
    distance: '',
    contactNumber: '',
  });
  const selectedStore = useRecoilValue(selectedStoreState);
  const [cartCount, setCartCount] = useRecoilState(cartCntState);
  const [menuList, setMenuList] = useState<IDrinkList[]>([]);
  const [popularMenuInfo, setPopularMenuInfo] = useState<IPopularMenuList[]>(
    [],
  );
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setSelectedStoreTemp(selectedStore);
  }, []);

  useEffect(() => {
    if (categorySId === 2) {
      getPopularMenu().then(res => {
        setPopularMenuInfo(res.data.data);
      });
    } else {
      getMenuCategory(categorySId).then(res => {
        console.log(
          'getMenuCategory',
          res.data.data,
          'categorySId',
          categorySId,
        );
        setMenuList(res.data.data);
      });
    }

    if (isLogin) {
      getCount(token).then(res => {
        const resData = res.data.data === null ? 0 : res.data.data;
        setCartCount(resData);
      });
    } else {
      setCartCount(getSessionCartCount());
    }
  }, [categorySId]);

  const handleClickSelectStore = () => {
    router.push(
      {
        pathname: '/selectStore',
        query: {
          isStoreSelect: false,
          backPage: '/category',
        },
      },
      '/selectStore',
    );
  };

  return (
    <>
      <CategoryContent
        setCategoryName={setCategoryName}
        setCategorySId={setCategorySId}
        cartCount={cartCount}
      />
      <ul className={cx('product-list')}>
        {categorySId !== 2
          ? menuList.map(item => (
              <Link
                href={{
                  pathname: `/product/${item.menuId}`,
                }}
                key={item.index}
              >
                <a>
                  <li key={item.menuTemperatureId} className={cx('menu-item')}>
                    <div className={cx('menu-img')}>
                      <img src={item.menuImg} alt='' />
                    </div>
                    <div className={cx('menu-detail')}>
                      <div className={cx('item-name')}>{item.menuName}</div>
                      <div className={cx('item-english-name')}>
                        {item.menuEngName}
                      </div>
                      <div className={cx('item-price')}>
                        {addComma(item.price)}원
                      </div>
                    </div>
                  </li>
                </a>
              </Link>
            ))
          : popularMenuInfo.map(item => (
              <MenuItem
                key={`popular-${item.index}`}
                item={item}
                isFetching={isFetching}
                setIsFetching={setIsFetching}
              />
            ))}
      </ul>
      <div className={cx('select-store-wrap')}>
        <button
          type='button'
          className={cx('select-store')}
          onClick={handleClickSelectStore}
        >
          <span className={cx('tit')}>
            {selectedStoreTemp.distance === ''
              ? '주문할 매장을 선택하세요'
              : selectedStoreTemp.name}
          </span>
          <Image
            src='/assets/svg/icon-down-arrow-white.svg'
            width={12}
            height={10}
          />
        </button>{' '}
      </div>
    </>
  );
}

export default categoryListContent;
