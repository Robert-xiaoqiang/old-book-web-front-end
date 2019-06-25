import { Table, Button, Row, Col, Card, Divider } from 'antd';
import React from 'react';

import './index.css';

const data = [
  {
    key: 1,
    bookName: 'Java Programming Language',
    sellPrice: 16.0,
    sellerName: 'Bruce anc',
    tradePlace: '浙江杭州',
    tradeTimestamp: '2019-09-09'
  },
  {
    key: 2,
    bookName: 'Haskell Programming Language',
    sellPrice: 16.0,
    sellerName: 'Xiaoqiang',
    tradePlace: '浙江宁波',
    tradeTimestamp: null
  }
];

export default class ShoppingTable extends React.Component {
    constructor(props) {
        super(props);
        const columns = [
            { title: 'Book Name', dataIndex: 'bookName', key: 'bookName' },
            { title: 'Price for Sale', dataIndex: 'sellPrice', key: 'sellPrice', sorter: (a, b) => a.sellPrice - b.sellPrice},
            { title: 'Seller Name', dataIndex: 'sellerName', key: 'sellerName' },
            { title: 'Trading Approach', dataIndex: 'tradingApproach', key: 'tradingApproach', width: 50,
              render: (text, record) => record.tradeTimestamp === null ? <a>off-line</a> : <a>on-line</a>
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => {
                    return (
                      <span>
                        <Button type="danger" onClick={ () => this.handleDeleteOne(record) }>Delete the Book</Button>
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

    handleCancel = () => {
        // post
        // updata state
    }

    handleConfirm = () => {
        // post
        // updata state
        // generate an order timestamp
        // a buyer from the current user name
    }

    render() {
        return (
            <div>
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
                            <Col span = { 8 }>
                                <Card title = 'Trading Timestamp'>
                                    { record.tradeTimestamp }
                                </Card>
                            </Col>
                        </Row>)
                    );
                }
            }
            dataSource={data}/>
            <Row type="flex" justify="end">
                <Col span={6}>
                    <Button type = "primary" onClick = { this.handleConfirm }>Confirm</Button>
                    <Divider type="vertical" />
                    <Button type = "danger" onClick = { this.handleDeleteAll }>Cancel it</Button>
                </Col>
            </Row>
            </div>
        );
    }
}