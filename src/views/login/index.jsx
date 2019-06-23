import './index.css';
import React from 'react';
import { Form, Icon, Input, Button, message } from 'antd';
import { Link } from "react-router-dom";
import api from '../../api';
const FormItem = Form.Item;

class BasicLogin extends React.Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((errs, values) => {
      if (!errs && values) {
        const body = {
          userName: values.userName,
          password: values.password
        };
        console.log(body);
        const bodyEncode = new URLSearchParams();
          Object.keys(body).forEach(key=>{
            bodyEncode.append(key, body[key]);
        });
        
        fetch(api.login, {
          method: 'POST',
          body: bodyEncode,
          credentials: 'include',
          mode: 'cors'
        })
        .then(res => res.json())
        .then(res => {
            res = res.httpResponseBody;
            if(res['status']) {
              message.success('login successfully!');
              window.localStorage.setItem('userName', values.userName);
              window.localStorage.setItem('avatarURL', res['data']['avatarURL']);
              window.setTimeout(() => {
                this.props.history.push('/dashboad');  
              }, 500);
            } else {
              message.error(res['message']);
              this.props.form.resetFields();
            }
        });
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className="login-container">
        <div className="login-form-wrapper">
          <Form className="login-form" onSubmit={this.handleSubmit}>
            <p className="login-form-title">QIndomitable Old Book System</p>
            <FormItem>
              {getFieldDecorator('userName', {
                initialValue: 'admin',
                rules: [
                  { required: true, message: 'Please input your username!' }
                ]
              })(
                <Input
                  prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                  placeholder="Username"
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                initialValue: 'admin',
                rules: [
                  { required: true, message: 'please input your password!' }
                ]
              })(
                <Input
                  prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                  placeholder="Password"
                  type="password"
                />
              )}
            </FormItem>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Sign in
            </Button>
            Or <Link to = "/register">Register/Sign up Now</Link>
          </Form>
        </div>
      </div>
    )
  }
}

const Login = Form.create()(BasicLogin)
export default Login
