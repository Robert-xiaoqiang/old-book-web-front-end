import { Comment, Avatar, Form, Button, List, Input, message } from 'antd';
import moment from 'moment';
import React from 'react';
import api from '../../api';

const { TextArea } = Input;

const CommentList = ({ comments, guy }) => (
  <List
    dataSource={comments}
    header={ <p>Sorry! We are not sure whether <a>{guy}</a> is on line or not</p> }
    itemLayout="horizontal"
    renderItem={props => <Comment {...props} />}
  />
);

const Editor = ({ onChange, onSubmit, submitting, value, guy }) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        Send A Message to { guy }
      </Button>
    </Form.Item>
  </div>
);

export default class CurrentChat extends React.Component {
  constructor(props) {
      super(props);
      const guy = window.localStorage.getItem('guy');
      window.localStorage.removeItem('guy');
      this.state = {
        userName: 'xiaoqiang',
        guy: guy,
        comments: [],
        submitting: false,
        value: '',
      };    
  }

  componentDidMount() {
        // Create WebSocket connection.
        this.socket = new WebSocket(api.websocket);

        // Connection opened
        this.socket.addEventListener('open', event => {
            this.socket.send(JSON.stringify({
                from: this.state.userName,
                to: this.state.guy,
                content: ''
            }));
        });

        // Listen for messages
        this.socket.addEventListener('message', event => {
            console.log('Message from Server ', event.data);
            const {
                from, to, content
            } = event.data;
            this.setState({
                comments: [
                    {
                    author: from,
                    avatar: '/static/imgs/b1.png',
                    content: <p>{content}</p>,
                    datetime: moment().fromNow(),
                    },
                    ...this.state.comments,
                ]
            });
        });
  }

  handleSubmit = () => {
    if(!this.state.guy) {
        message.error('choose a guy to send message');
        return;
    }

    if (!this.state.value) {
       message.error('without message');
       return;
    }

    this.setState({
      submitting: true,
    });

    this.socket.send(JSON.stringify({
        from: this.state.userName,
        to: this.state.guy,
        content: this.state.value
    }));

    window.setTimeout(() => {
        this.setState({
            submitting: false,
            value: '',
            comments: [
              {
                author: 'Han Solo',
                avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                content: <p>{this.state.value}</p>,
                datetime: moment().fromNow(),
              },
              ...this.state.comments,
            ],
          })
    }, 500);
  };

  handleChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    const { guy, comments, submitting, value } = this.state;
    return (
      <div>
        { comments.length > 0 && <CommentList comments={comments} guy = {guy} /> }
        <Comment
          avatar={
            <Avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              alt="Han Solo"
            />
          }
          content={
            <Editor
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              submitting={submitting}
              value={value}
              guy={guy}
            />
          }
        />
      </div>
    );
  }
}