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

  const { Option } = Select;
  
  let id = 0;

  class WrappedForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        handleQueryByParent: props.handleQueryByParent,
        handleClearByParent: props.handleClearByParent
      };
    }
  
    handleQuery = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
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
            initialValue: '86',
            rules: [ ],
          })( <Select style={{ width: 200 }} >
                <Option value="86">TP计算机自动化</Option>
                <Option value="87">农学</Option>
                <Option value="88">茶学</Option>
                <Option value="89">蛤学</Option>
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
              查询
            </Button>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="danger" htmlType="submit" onClick = { this.handleClear }>
              清空条件
            </Button>
          </Form.Item>
        </Form>
      );
    }
  }
  
const QueryBookForm = Form.create({ name: 'querybook' })(WrappedForm);

export default QueryBookForm;