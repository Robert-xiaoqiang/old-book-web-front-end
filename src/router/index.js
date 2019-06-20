import React from 'react'
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
// import asyncComponent from './asyncComponent'

// const Login = asyncComponent(() => import('../views/login/index'))
// const Layout = asyncComponent(() => import('../views/app/index'))
// const DashBoard = asyncComponent(() => import('../views/dashBoard/index'))
// const Page2 = asyncComponent(() => import('../views/page2/index'))
// const Card = asyncComponent(() => import('../components/card/index'))
// const Table = asyncComponent(() => import('../components/table/index'))
// const NoMatch = asyncComponent(() => import('../components/nomatch/index'))

import Login from '../views/login/index'
import Layout from '../views/app/index'
import DashBoard from '../views/dashBoard/index'
// import Page2 from '../views/page2/index'
import Card from '../components/card/index'
import Table from '../components/table/index'
import NoMatch from '../components/nomatch/index'
import BarChart from '../components/barchart/index'
import LineChart from '../components/linechart/index'

export const childRoutes = [
  {
    key: '0',
    name: 'Dashboard',
    icon: 'laptop',
    url: '/dashboard',
    component: DashBoard,
    exactly: true
  },
  {
    key: '1',
    name: 'Personal Buy or Sell',
    icon: 'user',
    child: [
      {
        key: '10',
        name: 'Sell',
        url: '/personal/sell',
        component: Card
      },
      {
        key: '11',
        name: 'Buy',
        url: '/personal/buy',
        component: Table
      }
    ]
  },
  {
    key: '2',
    name: 'Book Market',
    icon: 'team',
    child: [
      {
        key: '20',
        name: 'Buy Old Books',
        url: '/market/buy',
        component: LineChart
      },
      {
        key: '21',
        name: 'The Guys Seeking for Help',
        url: '/market/sell',
        component: BarChart
      }
    ]
  },
  {
    key: '3',
    name: 'My History Orders',
    icon: 'laptop',
    url: '/history',
    component: DashBoard,
    exactly: true
  },
]

// 面包屑导航栏url对应的name
export const breadcrumbNameMap = {
    '/dashboard': 'Dashboard',
    '/personal': 'Personal',
    '/personal/sell': 'PersonalSell',
    '/personal/buy': 'PersonalBuy',
    '/market': 'Market',
    '/market/buy': 'MarketBuy',
    '/market/sell': 'MarketSell',
    '/history': 'History'
  };


export default class Routers extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Redirect exact path="/" to="/login" />
          <Route component={Layout} />
          <Route path="*" component={NoMatch} />
        </Switch>
      </Router>
    )
  }
}
