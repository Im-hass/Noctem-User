import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames/bind';
import useGeolocation from 'react-hook-geolocation';

import styles from '../../../styles/content/selectStoreContent.module.scss';
import StoreInfo from '../ui/storeInfo';
import ChoiceStoreModal from './choiceStoreModal';
import { BottomSheet } from 'react-spring-bottom-sheet';
import SheetContent from '../common/sheetContent';
import 'react-spring-bottom-sheet/dist/style.css';
import { getStoreList } from '../../../pages/api/store';
import { IStore } from '../../../src/types/store.d';
import { useRouter } from 'next/router';

const cx = classNames.bind(styles);

function selectStoreContent() {
  const geolocation = useGeolocation();
  const [open, setOpen] = useState(false);
  const [storeList, setStoreList] = useState<IStore[]>();
  const [clickStoreId, setClickStoreId] = useState(0);
  const [clickStoreInfo, setClickStoreInfo] = useState<IStore>();
  const router = useRouter();

  function onDismiss() {
    setOpen(false);
  }

  const handleOrder = () => {
    if (clickStoreInfo !== undefined) {
      router.push(
        {
          pathname: '/order',
          query: {
            sizeId: router.query.sizeId,
            qty: router.query.qty,
            optionList: router.query.optionList,
            storeId: clickStoreInfo.storeId,
            storeName: clickStoreInfo.name,
            storeAddress: clickStoreInfo.address,
            storeContactNumber: clickStoreInfo.contactNumber,
          },
        },
        '/order',
      );
    }
  };

  useEffect(() => {
    if (geolocation.latitude && geolocation.longitude) {
      getStoreList(geolocation.latitude, geolocation.longitude).then(res => {
        console.log(res.data.data);
        setStoreList(res.data.data);
      });
    }
  }, [geolocation]);

  useEffect(() => {
    if (storeList) {
      const clickStore = storeList.find(
        store => store.storeId === clickStoreId,
      );
      setClickStoreInfo(clickStore);
    }
  }, [clickStoreId]);

  return (
    <>
      <div className={cx('wrap')}>
        <h1 className={cx('title')}>매장 설정</h1>
        <div className={cx('search-input-wrap')}>
          <input type='text' placeholder='검색' />
          <span className={cx('img-wrap')}>
            <Image
              src='/assets/svg/icon-search.svg'
              alt='search'
              width={14}
              height={13}
            />
          </span>
        </div>
        <div className={cx('filter-wrap')}>
          <button type='button'>DT</button>
          <button type='button'>리저브</button>
          <button type='button'>블론드</button>
          <button type='button'>나이트로 콜드브루</button>
          <button type='button'>주차가능</button>
        </div>
        <div className={cx('tab-wrap')}>
          <button type='button' className={cx('active')}>
            가까운 매장
          </button>
          <button type='button'>자주 가는 매장</button>
        </div>
        <ul>
          {storeList &&
            storeList.map((item: IStore) => (
              <StoreInfo
                key={item.index}
                setOpen={setOpen}
                data={item}
                setClickStoreId={setClickStoreId}
              />
            ))}
        </ul>
        {/* <StoreInfo setOpen={setOpen} />
        <StoreInfo setOpen={setOpen} />
        <StoreInfo setOpen={setOpen} /> */}
      </div>
      <BottomSheet open={open} onDismiss={onDismiss}>
        <SheetContent>
          <div style={{ height: '85vh' }} />

          {clickStoreInfo && (
            <ChoiceStoreModal
              clickStoreInfo={clickStoreInfo}
              handleOrder={handleOrder}
            />
          )}
        </SheetContent>
      </BottomSheet>
    </>
  );
}

export default selectStoreContent;
