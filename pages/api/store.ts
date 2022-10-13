import { basicRequest } from './base';

const SERVICE = '/store-service';

export const getStoreList = async (latitude: number, longitude: number) => {
  const res = await basicRequest.get(`${SERVICE}/store/search/${latitude}/${longitude}`);
  return res;
};