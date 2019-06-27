import {
    Form,
    Input,
    Icon,
    Select,
    Row,
    Col,
    Button,
    message,
    Upload
  } from 'antd';
  import React from 'react';
  import './index.css';
  import api from '../../api';

  const { Option } = Select;
  
  let id = 0;

  class WrappedForm extends React.Component {
    constructor(props) {
      super(props);
      this.handleQueryByParent = props.handleQueryByParent;
      this.handleClearByParent = props.handleClearByParent;
      this.state = {
        bookCategoryInfos: [ ],
      };
    }
  
    componentDidMount() {
      fetch(api.allcategories, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors'
      })
      .catch(err => {
        message.error('request error!')
      })
      .then(res => res.json())
      .then(res => {
        res = res.httpResponseBody;
        if(res.status) {
          this.setState({
            bookCategoryInfos: res.data
          });
        }
      });
    }

    handleQuery = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.handleQueryByParent(values);
        }
      });
    };
    
    handleClear = e => {
      e.preventDefault();
      this.props.form.resetFields();
      this.handleClearByParent();      
    }

    add = () => {
      const { form } = this.props;
      // can use data-binding to get
      const keys = form.getFieldValue('keys');
      const nextKeys = keys.concat(id++);
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        keys: nextKeys,
      });
    };

    render() {
      const { getFieldDecorator, getFieldValue } = this.props.form;
      const formItemLayout = {
        labelCol: {
          xs: { span: 22 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 22 },
          sm: { span: 16 },
        },
      };
      const formItemLayoutWithOutLabel = {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 24, offset: 0 },
        },
      };
      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      };

      // about categoroes
      getFieldDecorator('keys', { initialValue: [] });
      const keys = getFieldValue('keys');
      const categoryItems = keys.map((k, index) => (
        <Form.Item
          {...formItemLayout}
          label={'Category ' + k }
          key={k}>
          {
            getFieldDecorator(`names[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            initialValue: String(this.state.bookCategoryInfos[0].key),
            rules: [ ],
          })( <Select style={{ width: 200 }} >
                {
                  this.state.bookCategoryInfos.map((element, index, arr) => (
                    <Option key = { element.key } value = { String(element.key) }> { element.categoryName } </Option>
                  ))
                }
              </Select>)
          }
        </Form.Item>
      ));

      return (
        <Form {...formItemLayout} layout="inline" onSubmit={this.handleQuery}>
          <Form.Item label="Book Name">
            {getFieldDecorator('bookName', {
              rules: [],
            })(<Input />)}
          </Form.Item>

          <Form.Item label="Seller Name">
            {getFieldDecorator('sellerName', {
              rules: [],
            })(<Input />)}
          </Form.Item>

          {categoryItems}

          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add} style={{ width: '100%' }}>
              <Icon type="plus" />Category
            </Button>
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Query
            </Button>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="danger" htmlType="submit" onClick = { this.handleClear }>
              Clear Conditions
            </Button>
          </Form.Item>
        </Form>
      );
    }
  }
  
const QueryBookForm = Form.create({ name: 'querybook' })(WrappedForm);

export default QueryBookForm;