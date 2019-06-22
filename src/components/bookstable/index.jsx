import { Table, Button, Divider, Tag, Modal, Radio, Cascader, Card, Calendar } from 'antd';
import React from 'react';
import Cards from '../cards/index';
import QueryBookForm from '../querybookform/index';
import addressData from './addressdata';

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
    sellerName: 'xiaoqiang',
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
            orderModalSelect: [ ],
            orderModalRadio: 0,
            orderMoadlCalendar: '',
            orderModalTitle: 'Confirm Order',
            orderModalVisible: false,
            orderModalLoading: false,
          }

          const addr=[];
          const province=Object.keys(addressData);
          for(let item in province){
            const key=province[item];
            const cityList=[];
            if(addressData[key].length > 0){
                  for(let item1 in addressData[key]){
                              const obj={
                                       'value':addressData[key][item1],
                                       'label':addressData[key][item1]
                              }
                              cityList.push(obj);
                  }
            }
            const obj={
                  'value':key,
                  'label':key,
                  'children':cityList
            }
            addr.push(obj);
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
                          <Card title="Current Shopping" bordered={false}>
                              <Radio.Group onChange={this.handleOrderModalRadio} value={this.state.orderModalRadio}>
                                <Radio value={0}>Express</Radio>
                                <Radio value={1}>Trading off-line</Radio>
                              </Radio.Group>
                              <Card type = 'inner' title = 'Book Name'>
                                { record.bookName }
                              </Card>
        
                              <Card type = 'inner' title = 'Sell Price'>
                                { record.sellPrice }
                              </Card>

                              <Card type = 'inner' title = 'Seller Name'>
                                { record.sellerName } 
                              </Card>
                              
                              <Card type = 'inner' title = 'Buyer Name'>
                                { 'HAHA..' } 
                              </Card>
                              {
                                this.state.orderModalRadio === 0
                                ?
                                (<Card type = 'inner' title = 'Delivery Address'>
                                  <Cascader options={addr} onChange={this.handleOrderModalSelect}></Cascader>  
                                </Card>)
                                :
                                (<Card type = 'inner' title = 'Trading Place/Timestamp'>
                                  <Cascader options={addr} onChange={this.handleOrderModalSelect}></Cascader>  
                                  <div style={{ width: 300, border: '1px solid #d9d9d9', borderRadius: 4 }}>
                                    <Calendar fullscreen={false} onChange={this.handleOrderMoadlCalendar} />
                                  </div>
                                </Card>)
                              }
                          </Card>
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
      window.localStorage.setItem('guy', record.sellerName);
      this.props.history.push('/chat');
    }

    handleQuery = formFieldValues => {

    }

    handleOrderModalOk = (record) => {
      console.log(record, this.state);
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

    handleOrderModalSelect = (e) => {
      this.setState({
        orderModalSelect: e
      });
    }

    handleOrderModalRadio = (e) => {
      e.preventDefault();
      this.setState({
        orderModalRadio: e.target.value
      });
    }

    handleOrderMoadlCalendar = (e) => {
      this.setState({
        orderMoadlCalendar: e
      })
    }

    render() {
        return (
            <div>
            <QueryBookForm handleQueryByParent = { this.handleQuery } />
            <Table
            columns={this.state.columns}
            expandedRowRender={ record => {
                    return (
                        <Cards bookImageURL = { record.bookImageURL }
                               bookIntro = { record.bookIntro }
                               bookIntroURL = { record.bookIntroURL } />
                    );
                }
            }
            dataSource={data}/>
            </div>);
    }
}