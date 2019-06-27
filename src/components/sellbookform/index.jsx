import {
    Form,
    Input,
    Icon,
    Select,
    Row,
    Col,
    Button,
    message,
    Upload,
    Spin
  } from 'antd';
  import React from 'react';
  import './index.css';
  import api from '../../api';

  const { TextArea } = Input;
  const { Option } = Select;
  
  let id = 0;

  class WrappedForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        userName: window.localStorage.getItem('userName'),
        bookimageBase64: '',
        bookCategoryInfos: [ ],
        loading: false,
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

    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          // console.log('Received values of form: ', values);
          this.setState({
            loading: true
          });
          const body = {
            userName: this.state.userName,
            bookName: values.bookName,
            bookIntro: values.bookIntro,
            bookIntroURL: values.bookIntroURL,
            bookImageBase64: this.state.bookImageBase64,
            bookCategoryKeys: values.names.map(ele => Number(ele)),
            originPrice: values.originPrice,
            sellPrice: values.sellPrice
          }
          console.log(body);
          const bodyEncode = new URLSearchParams();
            Object.keys(body).forEach(key=>{
              bodyEncode.append(key, body[key]);
          });
          
          fetch(api.uploadbooksell, {
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
              message.success('upload successfuly!');             
              window.setTimeout(() => {
                this.setState({
                  loading: false
                });
                this.props.history.push('/market/buy');
              }, 200);
            } else {
              message.error(res.message);
              this.props.form.resetFields();
            }
          });
        }
      });
    };
  
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

    remove = k => {
      const { form } = this.props;
      // can use data-binding to get
      const keys = form.getFieldValue('keys');
      // We need at least one passenger
      if (keys.length === 1) {
        return;
      }
  
      // can use data-binding to set
      form.setFieldsValue({
        keys: keys.filter(key => key !== k),
      });
    };

    render() {
      const { getFieldDecorator, getFieldValue } = this.props.form;
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };
      const formItemLayoutWithOutLabel = {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 },
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

      // about upload image
      const uploadImageProps = {
        name: 'file',
        action: 'https://www.what.the.fuck',
        headers: {
          authorization: 'authorization-text',
        },
        beforeUpload: (file) => {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.setState({
              bookImageBase64: reader.result.split(',')[1]
            });
          };
          return false;
        },
        onChange: (info) => {
          if (info.file.status !== 'uploading') {
            // console.log(info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      };

      // about categoroes
      getFieldDecorator('keys', { initialValue: [ ] });
      const keys = getFieldValue('keys');
      const categoryItems = keys.map((k, index) => (
        <Form.Item
          {...formItemLayout}
          label={'Yet Category ' + k }
          required={true}
          key={k}
        >
          {
            getFieldDecorator(`names[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            initialValue: String(this.state.bookCategoryInfos[0].key),
            rules: [
              {
                required: true,
                whitespace: true,
                message: "Please input categories names or delete this field",
              },
            ],
            })( <Select style={{ width: 200 }} >
                {
                  this.state.bookCategoryInfos.map((element, index, arr) => (
                    <Option key = { element.key } value = { String(element.key) }> { element.categoryName } </Option>
                  ))
                }
              </Select>)
          }
          {
            keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.remove(k)}
            />) : null
          }
        </Form.Item>
      ));

      return (
        <Row type="flex" justify="space-between" align="bottom">
        <Col span = { 10 } >
        { this.state.loading ? <Spin /> : null }
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="Book Name">
            {getFieldDecorator('bookName', {
              rules: [
                {
                  required: true,
                  message: 'Please input the book name',
                },
              ],
            })(<Input />)}
          </Form.Item>

          <Form.Item label="Book Introduction">
            {
            getFieldDecorator('bookIntro', {
              initialValue: 'Input the Book Introduction at Least 20 characters',
              rules: [
                {
                  required: true,
                  message: 'Please input the book introduction',
                },
                {
                  min: 20,
                  message: 'Please input enough information for this book 20 characters',
                },
              ],
            })(<TextArea />)
            }
          </Form.Item>

          <Form.Item label="Book Outer URL">
            {getFieldDecorator('bookIntroURL', {
              rules: [
                {
                  required: true,
                  message: 'Please input the outer URL for the book',
                },
                {
                  pattern: /^https?:/,
                  message: 'HTTP or HTTPS only'
                }
              ],
            })(<Input />)}
          </Form.Item>

          {categoryItems}

          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
              <Icon type="plus" /> Add A Category
            </Button>
          </Form.Item>
          
          <Form.Item label="Origin Price">
            {getFieldDecorator('originPrice', {
              rules: [
                {
                  required: true,
                  message: 'Please input the origin price for the book',
                },
              ],
            })(<Input />)}
          </Form.Item>

          <Form.Item label="Price for Sale">
            {getFieldDecorator('sellPrice', {
              rules: [
                {
                  required: true,
                  message: 'Please input the sale price for the book',
                },
              ],
            })(<Input />)}
          </Form.Item>
          
          <Form.Item { ...formItemLayoutWithOutLabel }>
            <Upload {...uploadImageProps}>
              <Button>
                <Icon type="upload" /> Upload the Book Cover
              </Button>
            </Upload>
          </Form.Item> 

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              上传
            </Button>
          </Form.Item>
        </Form>
        </Col>
        </Row>
      );
    }
  }
  
const SellBookForm = Form.create({ name: 'sellbook' })(WrappedForm);

export default SellBookForm;