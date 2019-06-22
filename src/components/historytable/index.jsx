import { Table, Button, Row, Col, Card, List, Icon, Avatar } from 'antd';
import React from 'react';

import './index.css';

const data = [
  {
    key: 1,
    orderTimestamp: '2019-06-22',
    buyerName: 'Xiaoqiang',
    totalPrice: '10000.233',
    orderDetails: [
        {
            bookSellInfo: {
                bookInfo: {
                    bookName: 'Java Programming Language',
                    categories: [ 'CS', 'Mathematics', 'Physics'],
                    originPrice: 32.0,
                    sellPrice: 16.0,
                    sellerName: 'Bruce Anc',
                    bookIntro: 'Java is not C++',
                    bookIntroURL: '',
                    bookImageURL: '/static/imgs/b1.png'
                },
                sellerName: 'Xiaoqiang',
                sellPrice: 10.0,
            },
            tradePlace: '浙江杭州',
            tradeTimestamp: '2019-09-09'
        }
    ]
  },
  {
    key: 2,
    orderTimestamp: '2019-06-22',
    buyerName: 'Xiaoqiang',
    totalPrice: '10000.233',
    orderDetails: [
        {
            bookSellInfo: {
                bookInfo: {
                    bookName: 'Java Programming Language',
                    categories: [ 'CS', 'Mathematics', 'Physics'],
                    originPrice: 32.0,
                    sellPrice: 16.0,
                    sellerName: 'Bruce Anc',
                    bookIntro: 'Java is not C++',
                    bookIntroURL: '',
                    bookImageURL: '/static/imgs/b1.png'
                },
                sellerName: 'Xiaoqiang',
                sellPrice: 10.0,
            },
            tradePlace: '浙江杭州',
            tradeTimestamp: null
        }
    ]
  }
];

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
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => {
                    return (
                      <span>
                        <Button type="danger" onClick={ () => this.handleDeleteOne(record) }>Delete the Order</Button>
                      </span>  
                    );
                }
            }
        ];
        this.state = {
            data: data,
            columns: columns
        }
    }

    handleDeleteOne = record => {
        // post
        // update state
    }

    handleDeleteAll = () => {
        // post
        // updata state
        // refresh
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
                            } = item.bookSellInfo;
                            const {
                                bookName, bookImageURL, bookIntroURL
                            } = item.bookSellInfo.bookInfo;
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
            dataSource={data}/>
            <Row type="flex" justify="end">
                <Col span={4}>
                    <Button type = "danger" onClick = { this.handleDeleteAll }>Delete All Orders</Button>
                </Col>
            </Row>
            </div>
        );
    }
}