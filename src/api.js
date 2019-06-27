const httpHost = 'http://localhost:8080'
const wsHost = 'ws://localhost:8080'
const api = {
    websocket: wsHost + '/api/websocket',

    register: httpHost + '/api/register',
    login: httpHost + '/api/login',
    allcategories: httpHost + '/api/allcategories',
    uploadbooksell: httpHost + '/api/uploadbooksell',
    querybooksell: httpHost + '/api/querybooksell',
    uploadbookbuy: httpHost + '/api/uploadbookbuy',
    allbookbuys: httpHost + '/api/allbookbuys',

    uploadorderdetail: httpHost + '/api/uploadorderdetail',
    deleteorderdetail: httpHost + '/api/deleteorderdetail',
    confirmorderinfo: httpHost + '/api/confirmorderinfo',
    cancelorderinfo: httpHost + '/api/cancelorderinfo',
    shoppingcart: httpHost + '/api/shoppingcart',
    userorderinfos: httpHost + '/api/userorderinfos',
    deleteuserorderinfos: httpHost + '/api/deleteuserorderinfos',
    deleteorderinfo: httpHost + '/api/deleteorderinfo',

    userbooksells: httpHost + '/api/userbooksells',
    deleteuserbooksells: httpHost + '/api/deleteuserbooksells',
    deletebooksell: httpHost + '/api/deletebooksell',
    userbookbuys: httpHost + '/api/userbookbuys',
    deleteuserbookbuys: httpHost + '/api/deleteuserbookbuys',
    deletebookbuy: httpHost + '/api/deletebookbuy',

    avatar: httpHost + '/api/avatar',
};

export default api