import { Table, Button, Tag, message } from 'antd';
import React from 'react';
import Cards from '../cards/index';
import api from '../../api';
import './index.css';


export default class SimpleBooksTable extends React.Component {
    constructor(props) {
        super(props);
        const columns = [
            { title: 'Book Name', dataIndex: 'bookName', key: 'bookName' },
            {
              title: 'Categories',
              dataIndex: 'bookCategoryInfos',
              key: 'bookCategoryInfos',
              width: 100,
              render: bookCategoryInfos => (
                <span>
                  {bookCategoryInfos.map(categoryInfo => {
                    let color = 'green';
                    return (
                      <Tag color={color} key={categoryInfo.categoryName}>
                        {categoryInfo.categoryName.toUpperCase()}
                      </Tag>
                    );
                  })}
                </span>
              ),
            },
            { title: 'Lower Price', dataIndex: 'lowerPrice', key: 'lowerPrice', width: 100, sorter: (a, b) => a.originPrice - b.originPrice},
            { title: 'Upper Price', dataIndex: 'upperPrice', key: 'upperPrice', width: 100, sorter: (a, b) => a.sellPrice - b.sellPrice},
            { title: 'Buyer Name', dataIndex: 'buyerName', key: 'buyerName' },
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
            userName: window.localStorage.getItem('userName'),
            data: [ ],
            columns: columns
        }
    }

    handleChat = record => {
      window.localStorage.setItem('guy', record.buyerName);
      this.props.history.push('/chat');
    }
    
    componentDidMount() {
      const body = {
        userName: this.state.userName
      };
      const bodyEncode = new URLSearchParams();
        Object.keys(body).forEach(key=>{
          bodyEncode.append(key, body[key]);
      });
      
      fetch(api.allbookbuys, {
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
        console.log(res);
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

    render() {
        console.log(this.state);
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
            dataSource={this.state.data}/>
        );
    }
}