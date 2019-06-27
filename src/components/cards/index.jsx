import './index.css'
import React from 'react'
import { Card, Col, Row } from 'antd'


const { Meta } = Card;

export default class Cards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookImageURL: props.bookImageURL,
      bookIntro: props.bookIntro,
      bookIntroURL: props.bookIntroURL
    }
  }
  render() {
    console.log(this.state);
    return (
      <div style={{ background: '#ECECEC', padding: '30px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Card
              bordered={false}
              hoverable
              style={{ width: 300, height: 300 }}
              cover={<img alt='' src={ this.state.bookImageURL } width='150' height='250' />}>
              <Meta title="Book Cover" description={ this.state.bookIntroURL } />
            </Card> 
          </Col>
          <Col span={8} offset={2}>
            <Card title = {<p>Book Intro(<a href = {this.state.bookIntroURL} target = '_blank'>detail</a>)</p>}
                  bordered={false}
                  hoverable
                  style={{ width: 300, height: 300 }}>
              <p style={{ margin: 0 }}>{this.state.bookIntro}</p>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}
