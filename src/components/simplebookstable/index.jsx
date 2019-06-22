import { Table, Button, Divider, Tag, Modal, Radio, Cascader, Card, Calendar } from 'antd';
import React from 'react';
import Cards from '../cards/index';

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

export default class SimpleBooksTable extends React.Component {
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
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => {
                    return (
                      <span>
                        <Button type="primary" onClick={ () => this.handleChat(record) }>Help the Guy</Button>
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

    handleChat = record => {

    }

    render() {
        return (
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
        );
    }
}