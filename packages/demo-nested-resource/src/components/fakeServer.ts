import { InstallOptions } from "vue-db"

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

export const fakeRpcProvider: InstallOptions['rpcProvider'] = async (queries) => {
    console.log('queries', JSON.stringify(queries, undefined, '  '));
    queries[0].resolve([{
        id: 'jiangxi',
        name: '江西',
        cities: [{
            id: 'nanchang',
            name: '南昌',
            districts: [{
                id: 'xihu',
                name: '西湖'
            }, {
                id: 'donghu',
                name: '东湖'  
            }, {
                id: 'xinjian',
                name: '新建'
            }]
        }]
    }, {
        id: 'jilin',
        name: '吉林'
    }]);
}