import { Table, Button, Tag, message, Row, Col } from 'antd';
import React from 'react';
import Cards from '../cards/index';

import './index.css';
import api from '../../api';

export default class BookBuyHistory extends React.Component {
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
            { title: 'Lower Price', dataIndex: 'lowerPrice', key: 'lowerPrice', width: 100, sorter: (a, b) => a.originPrice - b.originPrice},
            { title: 'Upper Sale', dataIndex: 'upperPrice', key: 'upperPrice', width: 100, sorter: (a, b) => a.sellPrice - b.sellPrice},
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => {
                    return (
                      <span>
                        <Button type="primary" onClick={ () => this.handleClearOne(record) }>Clear It</Button>
                      </span>  
                    );
                }
              }
        ];
          this.state = {
            userName: window.localStorage.getItem('userName'),
            data: [ ],
            columns: columns
          }
    }

    fetchData = () => {
        const body = {
            userName: this.state.userName
        };

        const bodyEncode = new URLSearchParams();
        Object.keys(body).forEach(key=>{
            bodyEncode.append(key, body[key]);
        });
        
        fetch(api.userbookbuys, {
            method: 'POST',
            body: bodyEncode,
            credentials: 'include',
            mode: 'cors'
        })
        .catch(err => {
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
            } else {
                message.error(res.message);
            }
        });
    }

    componentDidMount() {
        this.fetchData();
    }

    handleClearOne = record => {
        const body = {
            bookBuyKey: record.key
        };

        const bodyEncode = new URLSearchParams();
        Object.keys(body).forEach(key=>{
            bodyEncode.append(key, body[key]);
        });
        
        fetch(api.deletebookbuy, {
            method: 'POST',
            body: bodyEncode,
            credentials: 'include',
            mode: 'cors'
        })
        .catch(err => {
            message.error('request error!');
        })
        .then(res => res.json())
        .then(res => {
            res = res.httpResponseBody;
            if(res.status) {
                message.success('clear successfully!');
            } else {
                message.error(res.message);
            }
        })
        .then(() => {
            this.fetchData();
        });
    }

    handleClearAll = () => {
        const body = {
            userName: this.state.userName
        };

        const bodyEncode = new URLSearchParams();
        Object.keys(body).forEach(key=>{
            bodyEncode.append(key, body[key]);
        });
        
        fetch(api.deleteuserbookbuys, {
            method: 'POST',
            body: bodyEncode,
            credentials: 'include',
            mode: 'cors'
        })
        .catch(err => {
            message.error('request error!');
        })
        .then(res => res.json())
        .then(res => {
            res = res.httpResponseBody;
            if(res.status) {
                message.success('clear successfully!');
            } else {
                message.error(res.message);
            }
        })
        .then(() => {
            this.fetchData();
        });        
    }

    render() {
        return (
            <div>
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
                <Row type="flex" justify="end">
                    <Col span={4}>
                        <Button type = "danger" onClick = { this.handleClearAll }>Clear All</Button>
                    </Col>
                </Row>
            </div>
        );
    }
}