import {
    Form,
    Input,
    Tooltip,
    Icon,
    Select,
    Row,
    Col,
    Checkbox,
    Button,
    AutoComplete,
    Upload,
    Card,
    message
  } from 'antd';
  import React from 'react';
  import Resizer from 'react-image-file-resizer';
  import './index.css';
  import api from '../../api';
  const { Meta } = Card;
  const { Option } = Select;
  const AutoCompleteOption = AutoComplete.Option;
  
  class WrappedRegisterForm extends React.Component {
    state = {
      avatarBase64: '',
      confirmDirty: false,
      autoCompleteResult: [ ],
    };
  
    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const body = {
            userName: values.userName,
            password: values.password,
            email: values.email,
            avatarBase64: this.state.avatarBase64
          };

          const bodyEncode = new URLSearchParams();
            Object.keys(body).forEach(key=>{
              bodyEncode.append(key, body[key]);
          });
          console.log(bodyEncode.toString());
          fetch(api.register, {
            method: 'POST',
            body: bodyEncode,
            credentials: 'include',
            mode: 'cors'
          })
          .then(res => res.json())
          .then(res => {
            console.log(res);
          })
        }
      });
    };
  
    handleConfirmBlur = e => {
      const value = e.target.value;
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
  
    compareToFirstPassword = (rule, value, callback) => {
      const form = this.props.form;
      if (value && value !== form.getFieldValue('password')) {
        callback('Two passwords that you enter is inconsistent!');
      } else {
        callback();
      }
    };
  
    validateToNextPassword = (rule, value, callback) => {
      const form = this.props.form;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
    };
  
    handleWebsiteChange = value => {
      let autoCompleteResult;
      if (!value) {
        autoCompleteResult = [];
      } else {
        autoCompleteResult = ['.com', '.cn', '.org', '.net', '.top'].map(domain => `${value}${domain}`);
      }
      this.setState({ autoCompleteResult: autoCompleteResult });
    };
  
    render() {
      const { getFieldDecorator } = this.props.form;
      const { autoCompleteResult } = this.state;
  
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
      const formItemLayoutWithOutLabel = {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 },
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
              avatarBase64: reader.result.split(',')[1]
            });
          };
          return false;
        },
        onChange: (info) => {
          if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      };


      const prefixSelector = getFieldDecorator('prefix', {
        initialValue: '86',
      })(
        <Select style={{ width: 70 }}>
          <Option value = "86">+86</Option>
          <Option value = "87">+87</Option>
          <Option value = "88">+88</Option>
          <Option value = "89">+89</Option>
          <Option value = "110">+110</Option>
        </Select>,
      );
  
      const websiteOptions = autoCompleteResult.map(website => (
        <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
      ));
      
      return (
        <Row type="flex" justify="space-around" align="middle">
        <Col span={8}>
        <Card
            bordered={false}
            hoverable
            style={{ width: 500, height: 500 }}
            cover={<img alt='' src='/static/imgs/register.png' />}>
            <Meta title='Register in QIndomitable Old Book System'
                  description = {
                  <div>
                  <p>Reading is good for your brain</p>
                  <p>Reading introduces you to new ideas and invites you to solve problems</p>
                  <p>Reading improves your self-discipline and consistency</p></div> }/>
        </Card>
        </Col>
        <Col span={8} >
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="E-mail">
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ],
            })(<Input />)}
          </Form.Item>
          
          <Form.Item label = "UserName">
          {
            getFieldDecorator('userName', {
              rules: [
                {
                  min: 5,
                  message: 'UserName at least 5 characters',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ],
            })(<Input />)  
          }
          </Form.Item>

          <Form.Item label="Password" hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your password!',
                },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(<Input.Password />)}
          </Form.Item>
          <Form.Item label="Confirm Password" hasFeedback>
            {
            getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(<Input.Password onBlur={this.handleConfirmBlur} />)
            }
          </Form.Item>

          <Form.Item { ...tailFormItemLayout }>
            <Upload {...uploadImageProps}>
              <Button>
                <Icon type="upload" /> Upload An Avatar
              </Button>
            </Upload>
          </Form.Item> 

          <Form.Item
            label={
              <span>
                NickName &nbsp;
                <Tooltip title="What do you want others to call you?">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {
              getFieldDecorator('nickName', {
              rules: [ ],
              })(<Input />)           
            }
          </Form.Item>
          <Form.Item label="Phone Number">
            {getFieldDecorator('phone', {
              rules: [],
            })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
          </Form.Item>
          <Form.Item label="Website">
            {getFieldDecorator('website', {
              rules: [ ],
            })(
              <AutoComplete
                dataSource={websiteOptions}
                onChange={this.handleWebsiteChange}
                placeholder="oracle"
              >
                <Input />
              </AutoComplete>,
            )}
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            {getFieldDecorator('agreement', {
              valuePropName: 'checked',
            })(
              <Checkbox>
                I have read the <a>agreement</a>
              </Checkbox>,
            )}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
        </Col>
        </Row>
      );
    }
  }
  
const RegisterForm = Form.create({ name: 'register' })(WrappedRegisterForm);

export default RegisterForm;