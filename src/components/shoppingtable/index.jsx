import { Table, Button, Row, Col, Card, Divider, message, Modal } from 'antd';
import React from 'react';

import Cards from '../cards/index';
import api from '../../api';
import './index.css';

export default class ShoppingTable extends React.Component {
    constructor(props) {
        super(props);
        const columns = [
            { title: 'Book Name', dataIndex: 'bookName', key: 'bookName',
              render: (text, record) => <a onClick = { () => this.handleBookClick(record) }>{ text }</a> },
            { title: 'Price for Sale', dataIndex: 'sellPrice', key: 'sellPrice', sorter: (a, b) => a.sellPrice - b.sellPrice},
            { title: 'Seller Name', dataIndex: 'sellerName', key: 'sellerName' },
            { title: 'Trading Approach', dataIndex: 'tradingApproach', key: 'tradingApproach', width: 50,
              render: (text, record) => record.tradeTimestamp ? <a>off-line</a> : <a>on-line</a>
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => {
                    return (
                      <span>
                        <Button type="danger" onClick={ () => this.handleDeleteOne(record) }>Remove From Cart</Button>
                      </span>  
                    );
                }
            }
        ];
        this.state = {
            userName: window.localStorage.getItem('userName'),
            buyerName: '',
            key: 0,
            orderState: 0,
            orderTimestamp: '',
            totalPrice: 0,
            orderDetails: [ ],

            columns: columns,
            modalVisible: false,
            modalRecord: { }
        }
    }

    fetchShoppingCart = () => {
          // console.log('Received values of form: ', values);
          const body = {
            userName: this.state.userName,
        }
        console.log(body);
        const bodyEncode = new URLSearchParams();
            Object.keys(body).forEach(key=>{
            bodyEncode.append(key, body[key]);
        });
        
        fetch(api.shoppingcart, {
            method: 'POST',
            body: bodyEncode,
            credentials: 'include',
            mode: 'cors'
        })
        .catch(err => {
            console.log(err);
            message.error('request error!');
        })
        .then(res => res.json())
        .then(res => {
            res = res.httpResponseBody;
            if(res.status) {
                this.setState({
                        orderDetails: res.data.orderDetails.map(ele => {
                                let temp = ele.bookSellResponseBody;
                                delete ele.bookSellResponseBody;
                                delete temp.key;
                                ele = { ...ele, ...temp };
                                
                                temp = ele.bookInfo;
                                delete ele.bookInfo;
                                delete temp.id;
                                return { ...ele, ...temp };
                            }),
                            buyerName: res.data.buyerName,
                            key: res.data.key,
                            orderState: res.data.orderState,
                            orderTimestamp: res.data.orderTimestamp,
                            totalPrice: res.data.totalPrice
                    });
            } else {
                message.error(res.message);
            }
        });     
    }

    componentDidMount() {
        this.fetchShoppingCart();
    }

    handleDeleteOne = record => {
        // console.log('Received values of form: ', values);
        const body = {
            userName: this.state.userName,
            orderDetailKey: record.key
        };
        const bodyEncode = new URLSearchParams();
            Object.keys(body).forEach(key=>{
            bodyEncode.append(key, body[key]);
        });
        
        fetch(api.deleteorderdetail, {
            method: 'POST',
            body: bodyEncode,
            credentials: 'include',
            mode: 'cors'
        })
        .catch(err => {
            console.log(err);
            message.error('request error!');
        })
        .then(res => res.json())
        .then(res => {
            res = res.httpResponseBody;
            if(res.status) {
                message.success('delete successfully');
            } else {
                message.error(res.message);
            }
        })
        .then(() => {
            this.fetchShoppingCart();
        });
    }

    handleCancel = () => {
        const body = {
            userName: this.state.userName,
            orderInfoKey: this.state.key
        };
        const bodyEncode = new URLSearchParams();
            Object.keys(body).forEach(key=>{
            bodyEncode.append(key, body[key]);
        });
        
        fetch(api.cancelorderinfo, {
            method: 'POST',
            body: bodyEncode,
            credentials: 'include',
            mode: 'cors'
        })
        .catch(err => {
            console.log(err);
            message.error('request error!');
        })
        .then(res => res.json())
        .then(res => {
            res = res.httpResponseBody;
            if(res.status) {
                message.success('cancel successfully');
            } else {
                message.error(res.message);
            }
        })
        .then(() => {
            this.fetchShoppingCart();
        });
    }

    handleConfirm = () => {
        const body = {
            userName: this.state.userName,
            orderInfoKey: this.state.key
        };
        const bodyEncode = new URLSearchParams();
            Object.keys(body).forEach(key=>{
            bodyEncode.append(key, body[key]);
        });
        
        fetch(api.confirmorderinfo, {
            method: 'POST',
            body: bodyEncode,
            credentials: 'include',
            mode: 'cors'
        })
        .catch(err => {
            console.log(err);
            message.error('request error!');
        })
        .then(res => res.json())
        .then(res => {
            res = res.httpResponseBody;
            if(res.status) {
                message.success('confirm successfully');
            } else {
                message.error(res.message);
            }
        })
        .then(() => {
            this.fetchShoppingCart();
        });
    }

    handleBookClick = (record) => {
        console.log(record);
        this.setState({
            modalRecord: record,
            modalVisible: true
        });
    }

    handleModalOk = () => {
        this.setState({
            modalVisible: false
        });
    }

    render() {
        return (
            <div>
            <Modal
                title='About This Book'
                visible={this.state.modalVisible}
                onOk={ this.handleModalOk }
                onCancel={ this.handleModalOk }>
                    <Card title={ <a href = { this.state.modalRecord.bookIntroURL } target = '_blank'>Detail About It</a> } bordered={false}>
                      <Card type = 'inner' title = { this.state.modalRecord.bookName }>
                        { this.state.modalRecord.bookIntro }
                      </Card>
                      <Card type = 'inner' title = 'Book Cover'>
                        <img src = { this.state.modalRecord.bookImageURL } alt = '' width = '200' height = '200'></img>
                      </Card>
                    </Card>               
            </Modal>  
            <Table
            columns={this.state.columns}
            expandedRowRender={ record => {
                    return (
                        record.tradeTimestamp === null
                        ?
                        (<Card title = 'Delivery Address'>
                            { record.tradePlace }
                        </Card>)
                        :
                        (<Row futter = { 16 }>
                            <Col span = { 8 }>
                                <Card title = 'Trading Place'>
                                    { record.tradePlace }  
                                </Card>
                            </Col>
                            <Col span = { 8 } offset = { 2 }>
                                <Card title = 'Trading Timestamp'>
                                    { record.tradeTimestamp }
                                </Card>
                            </Col>
                        </Row>)
                    );
                }
            }
            dataSource={this.state.orderDetails}/>
            <Row type="flex" justify="end">
                <Col span={6}>
                    <Button type = "primary" onClick = { this.handleConfirm }>Confirm All</Button>
                    <Divider type="vertical" />
                    <Button type = "danger" onClick = { this.handleCancel }>Cancel All</Button>
                </Col>
            </Row>
            </div>
        );
    }
}