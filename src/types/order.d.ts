export interface IProps {
  isClickPaymentBtn: boolean;
  isClickSubmitBtn: boolean;
  setIsClickPaymentBtn: React.Dispatch<React.SetStateAction<boolean>>;
  setIsClickSubmitBtn: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IPurchaseData {
  storeId: number;
  storeName: string;
  storeAddress: string;
  storeContactNumber: string;
  userAge: number;
  userSex: string;
  purchaseTotalPrice: number;
  cardCorp: string;
  cardPaymentPrice: number;
  menuList: IMenuList[];
}

export interface IMenuList {
  sizeId: number;
  cartId: number;
  menuFullName: string;
  menuShortName: string;
  imgUrl: string;
  qty: number;
  menuTotalPrice: number;
  cupType: string | string[] | undefined;
  optionList?: [];
}

export interface IPayment {
  cardCorp: string;
  cardNumber: string;
  cardPaymentPrice: number;
}

// 주문 정보
export interface IOrderInfo {
  storeId: number;
  purchaseId: number;
}

export interface ICardInfo {
  company: string;
  card: string;
}
