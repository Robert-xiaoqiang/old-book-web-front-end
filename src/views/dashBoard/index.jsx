import React from 'react';
import { Row, Descriptions, Layout } from 'antd';
import PanelGroup from './panelGroup/index';
import LineChart from './lineChart/index';

const { Header, Content, Footer, Sider } = Layout;

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default class DashBoard extends React.Component {
  constructor() {
    super()
    this.state = {
      chartData: lineChartData.newVisitis
    }
  }
  handleSetLineChartData = type => {
    this.setState({
      chartData: lineChartData[type]
    })
  }

  render() {
    return (
      <div>
        <PanelGroup handleSetLineChartData={this.handleSetLineChartData} />
        <Footer style={{ textAlign: 'center' }}>WANG Xiaoqiang ©2019.06 </Footer>
        <Row
          style={{
            background: '#fff',
            padding: '16px 16px 0',
            marginBottom: '32px'
          }}
        >
          <div>
            <Descriptions
              title="Old Book System"
              border
              column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            >
              <Descriptions.Item label="Author">WANG Xiaoqiang</Descriptions.Item>
              <Descriptions.Item label="ID">3160101819</Descriptions.Item>
              <Descriptions.Item label="Instructor">2019 ZJU.BS Hu.</Descriptions.Item>
              <Descriptions.Item label="Back-end" span = { 2 }>
                Framework: SpringBoot + SpringMVC + JPA(Hibernate)
                <br />
                DBMS: MySQL 5.7
                <br />
                JDK: OpenJDK8
                <br />
                OS: Deployment CentOS 6.9@1GB
                <br />
              </Descriptions.Item>
              <Descriptions.Item label="Front-end">
                Framework: React.JS
                <br />
                Library: Ant Design © Alibaba
                <br />
              </Descriptions.Item>
              <Descriptions.Item label="RESTful API">
                CRUD + Coupling
              </Descriptions.Item>
              <Descriptions.Item label="Personal Function">
                Sell Books
                <br />
                Buy Books with On/Off-line Order
                <br />
                Request Books
                <br />
                Change Selling/Requesting history
                <br />
                Change Shopping Cart
                <br />
                Change History Order
              </Descriptions.Item>
              <Descriptions.Item label="Market Function">
                All Books for Sale
                <br />
                All Books for Requesting                
              </Descriptions.Item>
              <Descriptions.Item label="IM Function">
                Chat With Seller
                <br />
                Chat With People in Need
                <br />
                Chat History Local Storage
              </Descriptions.Item>
              <Descriptions.Item label="TO DO">
                Token & Credential
                <br />
                More Exceptional Case
                <br />
                More Elegent Communication within Components
                <br />
                Chating One-to-Many Simultaneously
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Row>
      </div>
    )
  }
}
