import { Table, Button, Divider, Tag, Modal, Row, Col } from 'antd';
import React from 'react';
import Card from '../card/index';
import QueryBookForm from '../querybookform/index';

import './index.css';

const data = [
  {
    key: 1,
    bookName: 'Java Programming Language',
    categories: [ 'CS', 'Mathematics', 'Physics'],
    originPrice: 32.0,
    sellPrice: 16.0,
    sellerName: 'Bruce Anc',
    bookIntro: 'Java is not C++',
    bookIntroURL: '',
    bookImageURL: '/static/imgs/b1.png'
  },
  {
    key: 2,
    bookName: 'Haskell Programming Language',
    categories: [ 'CS', 'Mathematics', 'Biology'],
    originPrice: 32.0,
    sellPrice: 16.0,
    sellerName: 'Xiaoqiang',
    bookIntro: 'FP is futher',
    bookIntroURL: '',
    bookImageURL: '/static/imgs/b2.png'
  }
];

export default class BooksTable extends React.Component {
    constructor(props) {
        super(props);
        const columns = [
            { title: 'Book Name', dataIndex: 'bookName', key: 'bookName' },
            {
              title: 'Categories',
              dataIndex: 'categories',
              key: 'categories',
              width: 100,
              render: categories => (
                <span>
                  {categories.map(category => {
                    let color = 'green';
                    return (
                      <Tag color={color} key={category}>
                        {category.toUpperCase()}
                      </Tag>
                    );
                  })}
                </span>
              ),
            },
            { title: 'Origin Price', dataIndex: 'originPrice', key: 'originPrice', width: 100, sorter: (a, b) => a.originPrice - b.originPrice},
            { title: 'Price for Sale', dataIndex: 'sellPrice', key: 'sellPrice', width: 100, sorter: (a, b) => a.sellPrice - b.sellPrice},
            { title: 'Seller Name', dataIndex: 'sellerName', key: 'sellerName' },
          ];
          this.state = {
            data: data,
            columns: columns,
            orderModalTitle: 'Conform Order',
            orderModalVisible: false,
            orderModalLoading: false,
          }
          this.state.columns.push({
              title: 'Action',
              key: 'action',
              render: (text, record) => {
                  return (
                    <span>
                      <Button type="primary" onClick={ () => this.handleBuy(record) }>Buy It</Button>
                      <Modal
                        title={this.state.orderModalTitle}
                        visible={this.state.orderModalVisible}
                        confirmLoading={this.state.orderModalLoading}
                        onOk={ () => this.handleOrderModalOk(record) }
                        onCancel={this.handleOrderModalCancel}>
                        <Row gutter={16}>
                          <Col span={8}>
                            <Card title="Current Shopping" bordered={false}>
                              <p>Book Name: { record.bookName }</p>
                              <p>Price: { record.sellPrice }</p>
                              <p>Seller Name: { record.sellerName } </p>
                              <p>Buyer Name: { 'HAHA..' } </p>
                            </Card>
                          </Col>
                        </Row>
                      </Modal>
                      <Divider type="vertical" />
                      <Button type="primary" onClick={ () => this.handleChat(record) }>Chat with the Seller</Button>
                    </span>  
                  );
              }
            });
    }

    handleBuy = record => {
      this.setState({
        orderModalVisible: true
      });
    }

    handleChat = record => {

    }

    handleQuery = formFieldValues => {

    }

    handleOrderModalOk = (record) => {
      this.setState({
        orderModalTitle: 'Processing, Please Wait A Moment',
        orderModalLoading: true,
      });
      window.setTimeout(() => {
        this.setState({
          orderModalVisible: false,
          orderModalLoading: false,
        });
      }, 2000);
    }

    handleOrderModalCancel = () => {
      this.setState({
        orderModalVisible: false,
      });
    }

    handleOrderModalSubmit = () => {
      
    }

    render() {
        return (
            <div>
            <QueryBookForm handleQueryByParent = { this.handleQuery } />
            <Table
            columns={this.state.columns}
            expandedRowRender={ record => {
                    return (
                        <Card bookImageURL = { record.bookImageURL }
                              bookIntro = { record.bookIntro }
                              bookIntroURL = { record.bookIntroURL } />
                    );
                }
            }
            dataSource={data}/>
            </div>);
    }
}