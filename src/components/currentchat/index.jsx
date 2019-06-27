import { Comment, Avatar, Form, Button, List, Input, message, Divider } from 'antd';
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

const HistoryList = ({ historyContents, guy }) => (
  <List
    dataSource={historyContents}
    header={ <p>History With <a>{guy}</a></p> }
    itemLayout="horizontal"
    renderItem={history => <Comment author = { guy } content = { history } />}
  />
);

const Editor = ({ onChange, onSubmit, value, guy }) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" onClick={onSubmit} type="primary">
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
      const historyContents = window.localStorage.getItem('historyContents');
      console.log(JSON.parse(historyContents));
      this.state = {
        userName: window.localStorage.getItem('userName'),
        userAvatar: window.localStorage.getItem('avatarURL'),
        guy: guy,
        guyAvatar: '',
        // array of { guy, contents array}
        historyContents: historyContents ? JSON.parse(historyContents) : [ ],
        // { guy, contents array }
        currentContents: {
          guy: '',
          contents: [ ]
        },
        comments: [ ],
        value: '',
      };
  }

  fetchAvatarURL = () => {
    const body = {
        userName: this.state.guy
    };

    const bodyEncode = new URLSearchParams();
    Object.keys(body).forEach(key=>{
        bodyEncode.append(key, body[key]);
    });
    
    fetch(api.avatar, {
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
              guyAvatar: res.data
            });
        }
    });
  }

  componentDidMount() {
    // fetch avatar
    this.fetchAvatarURL();

    // Create WebSocket connection.
    this.socket = new WebSocket(api.websocket);

    // Connection opened
    this.socket.onopen = event => {
        this.socket.send(JSON.stringify({
            from: this.state.userName,
            to: this.state.guy,
            content: ''
        }));
    };

    // Listen for messages
    this.socket.onmessage = event => {
      console.log('Message from Server ', event.data);
      const {
          from, to, content
      } = JSON.parse(event.data);

      this.setState({
        guy: from
      }, () => {
        this.fetchAvatarURL();
      });
      window.setTimeout(() => {
        this.setState({
          comments: [
            ...this.state.comments,
            {
                author: this.state.guy,
                avatar: this.state.guyAvatar,
                content: <p>{content}</p>,
                datetime: moment().fromNow(),
            },
          ],
          currentContents: {
            guy: this.state.guy,
            contents: [
                ...this.state.currentContents.contents,
                content               
            ]
          }
        });
      }, 100);
    };
  }

  componentWillUnmount() {
    if(this.state.currentContents.contents.length) {
      let history = window.localStorage.getItem('historyContents');
      history = history ? JSON.parse(history) : [ ];
      history = [
        ...history,
        this.state.currentContents
      ];
      window.localStorage.setItem('historyContents', JSON.stringify(history));
    }
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
            value: '',
            comments: [
                ...this.state.comments,
                {
                    author: this.state.userName,
                    avatar: this.state.userAvatar,
                    content: <p>{this.state.value}</p>,
                    datetime: moment().fromNow(),
                }
            ],
            currentContents: {
              guy: this.state.guy,
              contents: [
                  ...this.state.currentContents.contents,
                  this.state.value                
              ],
            },
        });

        this.socket.send(JSON.stringify({
            from: this.state.userName,
            to: this.state.guy,
            content: this.state.value
        }));
    }

  handleChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    const { guy, comments, submitting, value, historyContents } = this.state;

    return (
      <div>
        { 
          this.state.historyContents.map((ele, index) => (
            <HistoryList key = { index }  historyContents = { ele.contents } guy = { ele.guy } />
          ))
        }
        { this.state.historyContents.length ? <Divider orientation="left">History</Divider> : null }
        { comments.length > 0 && <CommentList comments={comments} guy = {guy} /> }
        <Comment
          avatar={
            <Avatar
              src={this.state.userAvatar}
              alt={this.state.userName}
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