export type T_Province = {
    id: string;
    name: string;
}

export type T_City = {
    id: string;
    name: string;
    provinceId: string;
}

export type T_District = {
    id: string;
    name: string;
    cityId: string;
}