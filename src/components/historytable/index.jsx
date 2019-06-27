import { Table, Button, Row, Col, Tag, List, Icon, message } from 'antd';
import React from 'react';
import api from '../../api';
import './index.css';

const IconText = ({ type, text }) => (
    <span>
      <Icon type={type} style={{ marginRight: 8 }} />
      {text}
    </span>
  );

export default class HistoryTable extends React.Component {
    constructor(props) {
        super(props);
        const columns = [
            { title: 'Order Timestamp', dataIndex: 'orderTimestamp', key: 'orderTimestamp' },
            { title: 'Buyer Name', dataIndex: 'buyerName', key: 'buyerName' },
            { title: 'Total Price', dataIndex: 'totalPrice', key: 'totalPrice' },
            { title: 'Order State', dataIndex: 'orderState', key: 'orderState',
              render: (text, record) => {
                  if(record.orderState === 0) {
                      return <Tag color = 'red'>Shopping</Tag>
                  } else if(record.orderState === 1) {
                    return <Tag color = 'cyan'>Canceled</Tag>
                  } else {
                    return <Tag color = 'lime'>Finished</Tag>
                  }
              }
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => {
                    return (
                      <span>
                        <Button disabled = { record.orderState === 0 } type="danger" onClick={ () => this.handleDeleteOne(record) }>Delete the History</Button>
                      </span>  
                    );
                }
            }
        ];
        this.state = {
            userName: localStorage.getItem('userName'),
            data: [ ],
            columns: columns
        }
    }

    fetchHistory = () => {
        // console.log('Received values of form: ', values);
        const body = {
            userName: this.state.userName,
        };
        const bodyEncode = new URLSearchParams();
            Object.keys(body).forEach(key=>{
            bodyEncode.append(key, body[key]);
        });
        
        fetch(api.userorderinfos, {
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
                    data: res.data
                });
            } else {
                message.error(res.message);
            }
        });
    }
    componentDidMount() {
        this.fetchHistory();
    }
    handleDeleteOne = record => {
        const body = {
            orderInfoKey: record.key
        };
        const bodyEncode = new URLSearchParams();
            Object.keys(body).forEach(key=>{
            bodyEncode.append(key, body[key]);
        });
        
        fetch(api.deleteorderinfo, {
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
                message.success('delete successfully!');
            } else {
                message.error(res.message);
            }
        })
        .then(() => {
            this.fetchHistory();
        });
    }

    handleDeleteAll = () => {
        const body = {
            userName: this.state.userName
        };
        const bodyEncode = new URLSearchParams();
            Object.keys(body).forEach(key=>{
            bodyEncode.append(key, body[key]);
        });
        
        fetch(api.deleteuserorderinfos, {
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
                message.success('delete successfully!');
            } else {
                message.error(res.message);
            }
        })
        .then(() => {
            this.fetchHistory();
        });
    }

    render() {
        return (
            <div>
            <Table
            columns={this.state.columns}
            expandedRowRender={ record => {
                    return (
                        <List
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                          onChange: page => {
                            console.log(page);
                          },
                          pageSize: 3,
                        }}
                        dataSource={record.orderDetails}
                        footer={
                          <div>
                            <b>Detail</b> for the Order
                          </div>
                        }
                        renderItem={item => {
                            const {
                                sellerName,
                                sellPrice
                            } = item.bookSellResponseBody;
                            const {
                                bookName, bookImageURL, bookIntroURL
                            } = item.bookSellResponseBody.bookInfo;
                            return (<List.Item
                                key={bookName}
                                extra={
                                <img
                                    width={272}
                                    alt=''
                                    src={ bookImageURL }/>
                                }>
                                <List.Item.Meta
                                title={<a href={bookIntroURL}>{bookName}</a>}/>
                                <p>Sell Price: { sellPrice } </p>
                                <p>Seller Name: { sellerName } </p>

                                {item.tradeTimestamp === null
                                ?
                                (<p>Delivery Address(on-line): { item.tradePlace } </p>)
                                :
                                (<div><p>Trading Place(off-line): { item.tradePlace } </p>
                                <p>Trading Timestamp(off-line): { item.tradeTimestamp } </p></div>)
                                }
                            </List.Item>) }
                        } />
                    );
                }
            }
            dataSource={this.state.data}/>
            <Row type="flex" justify="end">
                <Col span={4}>
                    <Button type = "danger" onClick = { this.handleDeleteAll }>Delete All History</Button>
                </Col>
            </Row>
            </div>
        );
    }
}