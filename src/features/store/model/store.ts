export interface StoresRequest {
  businessRegistrationNumber: string; //'1234567890';
  representativeName: string; //'홍길동';
  openingDate: string; //'2020-01-01';
  businessName: string; //'버거킹';
  storeName: string; //'버거킹 인하대역점';
}

export interface StoreInfoRequest {
  storeName: string; //'버거킹 인하대역점';
  phone: string; //'02-1234-5678';
}
