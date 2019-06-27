import { Table, Button, Divider, Tag, Modal, Radio, Cascader, Card, Calendar, message } from 'antd';
import React from 'react';
import Cards from '../cards/index';
import QueryBookForm from '../querybookform/index';
import addressData from './addressdata';

import './index.css';
import api from '../../api';

export default class BooksTable extends React.Component {
    constructor(props) {
        super(props);
        const columns = [
            { title: 'Book Name', dataIndex: 'bookName', key: 'bookName' },
            {
              title: 'Categories',
              dataIndex: 'bookCategoryInfos',
              key: 'categories',
              width: 100,
              render: bookCategoryInfos => (
                <span>
                  {bookCategoryInfos.map(bookCategoryInfo => {
                    let color = 'green';
                    return (
                      <Tag color={color} key={bookCategoryInfo.categoryName}>
                        {bookCategoryInfo.categoryName.toUpperCase()}
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
            userName: window.localStorage.getItem('userName'),
            data: [ ],
            columns: columns,
            orderModalRecord: { },
            orderModalSelect: [ ],
            orderModalRadio: 0,
            orderMoadlCalendar: null,
            orderModalTitle: 'Confirm Order',
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
                      <Divider type="vertical" />
                      <Button type="primary" onClick={ () => this.handleChat(record) }>Chat with the Seller</Button>
                    </span>  
                  );
              }
            });
    }

    fetchData = (bookName, sellerName, bookCategoryKeys) => {
      const body = {
        bookName: bookName,
        sellerName: sellerName,
        bookCategoryKeys: bookCategoryKeys
      }
      const bodyEncode = new URLSearchParams();
        Object.keys(body).forEach(key=>{
          bodyEncode.append(key, body[key]);
      });
      
      fetch(api.querybooksell, {
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
            data: res.data.map(ele => {
              const temp = ele.bookInfo;
              delete ele.bookInfo;
              return { ...ele, ...temp };
            })
          });
        }
      });
    }

    handleBuy = record => {
      this.setState({
        orderModalRecord: record,
        orderModalVisible: true
      });
    }

    handleChat = record => {
      window.localStorage.setItem('guy', record.sellerName);
      this.props.history.push('/chat');
    }

    handleQuery = queryFieldValues => {
      console.log(queryFieldValues, this.state);
      const bookName = queryFieldValues.bookName || '';
      const sellerName = queryFieldValues.sellerName || '';
      const bookCategoryKeys = queryFieldValues.keys.length ?
                                queryFieldValues.names.map(ele => Number(ele)) :
                                [ ];
      this.fetchData(bookName, sellerName, bookCategoryKeys);
    }

    handleClear = () => {

    }

    handleOrderModalOk = (record) => {
      // this.state.orderMoadlRecord === record
      const body = this.state.orderMoadlCalendar ?
      {
        userName: this.state.userName,
        bookSellKey: record.key,
        tradePlace: this.state.orderModalSelect.join(', '),
        tradeTimestamp: this.state.orderMoadlCalendar
      } :
      {
        userName: this.state.userName,
        bookSellKey: record.key,
        tradePlace: this.state.orderModalSelect.join(', ')
      }
      console.log(body);
      const bodyEncode = new URLSearchParams();
        Object.keys(body).forEach(key=>{
          bodyEncode.append(key, body[key]);
      });
      
      fetch(api.uploadorderdetail, {
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
            orderModalTitle: 'Processing, Please Wait A Moment',
            orderModalLoading: true,
          });
          message.success('order successfully, please check your shopping cart');
          window.setTimeout(() => {
            this.setState({
              orderModalTitle: 'Confirm Order',
              orderModalVisible: false,
              orderModalLoading: false,
            });
          }, 1000);
        } else {
          message.error(res.message);
        }
      })
      .then(() => {
        this.fetchData('', '', [ ]);
      });
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

    handleOrderModalCalendar = (e) => {
      this.setState({
        orderMoadlCalendar: e
      })
    }

    getAddr = () => {
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
      return addr;
    }

    render() {
        const addr = this.getAddr();
        return (
            <div>
            <Modal
                title={this.state.orderModalTitle}
                visible={this.state.orderModalVisible}
                confirmLoading={this.state.orderModalLoading}
                onOk={ () => this.handleOrderModalOk(this.state.orderModalRecord) }
                onCancel={ this.handleOrderModalCancel }>
                  <Card title="Current Shopping" bordered={false}>
                      <Radio.Group onChange={this.handleOrderModalRadio} value={this.state.orderModalRadio}>
                        <Radio value={0}>Express</Radio>
                        <Radio value={1}>Trading off-line</Radio>
                      </Radio.Group>
                      <Card type = 'inner' title = 'Book Name'>
                        { this.state.orderModalRecord.bookName || '' }
                      </Card>

                      <Card type = 'inner' title = 'Sell Price'>
                        { this.state.orderModalRecord.sellPrice || 0.0 }
                      </Card>

                      <Card type = 'inner' title = 'Seller Name'>
                        { this.state.orderModalRecord.sellerName || '' } 
                      </Card>
                      
                      <Card type = 'inner' title = 'Buyer Name'>
                        { this.state.userName } 
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
                            <Calendar fullscreen={false} onChange={this.handleOrderModalCalendar} />
                          </div>
                        </Card>)
                      }
                  </Card>
              </Modal>  
            <QueryBookForm handleQueryByParent = { this.handleQuery }
                           handleClearByParent = { this.handleClear } />
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
            dataSource={this.state.data}/>
            </div>);
    }
}