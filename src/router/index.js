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

import Login from '../views/login/index';
import Layout from '../views/app/index';
import DashBoard from '../views/dashBoard/index';
import Page2 from '../views/page2/index';
import Cards from '../components/cards/index';
import Table from '../components/table/index';
import NoMatch from '../components/nomatch/index';
import BarChart from '../components/barchart/index';
import LineChart from '../components/linechart/index';
import RegisterForm from '../components/registerform/index';
import SellBookForm from '../components/sellbookform/index';
import BuyBookForm from '../components/buybookform/index';
import BooksTable from '../components/bookstable/index';
import SimpleBooksTable from '../components/simplebookstable/index';
import ShoppingTable from '../components/shoppingtable/index';
import HistoryTable from '../components/historytable/index';
import CurrentChat from '../components/currentchat/index';
import BookSellHistory from '../components/booksellhistory/index';
import BookBuyHistory from '../components/bookbuyhistory/index';
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
    name: 'Personal',
    icon: 'user',
    child: [
      {
        key: '10',
        name: 'Sell',
        url: '/personal/sell',
        component: SellBookForm
      },

      {
        key: '11',
        name: 'Buy',
        url: '/personal/buy',
        component: BuyBookForm
      },

      {
        key: '12',
        name: 'Sell History',
        url: '/personal/sellhistory',
        component: BookSellHistory
      },
      {
        key: '13',
        name: 'Buy History',
        url: '/personal/buyhistory',
        component: BookBuyHistory
      },
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
        component: BooksTable
      },
      {
        key: '21',
        name: 'Help some Guys',
        url: '/market/sell',
        component: SimpleBooksTable
      }
    ]
  },
  {
    key: '3',
    name: 'Current Chat',
    icon: 'wechat',
    url: '/chat',
    component: CurrentChat,
    exactly: true
  },
  {
    key: '4',
    name: 'Shopping Cart',
    icon: 'shopping',
    url: '/shopping',
    component: ShoppingTable,
    exactly: true
  },
  {
    key: '5',
    name: 'My History Orders',
    icon: 'laptop',
    url: '/history',
    component: HistoryTable,
    exactly: true
  },
]

// 面包屑导航栏url对应的name
export const breadcrumbNameMap = {
    '/dashboard': 'Dashboard',
    '/personal': 'Personal',
    '/personal/sell': 'PersonalSell',
    '/personal/buy': 'PersonalBuy',
    '/personal/sellhistory': 'PersonalSellHistory',
    '/personal/buyhistory': 'PersonalBuyHistory',
    '/market': 'Market',
    '/market/buy': 'MarketBuy',
    '/market/sell': 'MarketSell',
    '/shopping': 'Shopping',
    '/history': 'History',
    '/chat': 'Chat'
  };


export default class Routers extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path = "/login" component = { Login } />
          <Route exact path = "/register" component = { RegisterForm } />
          <Redirect exact path="/" to="/login" />
          <Route component={Layout} />
          <Route path="*" component={NoMatch} />
        </Switch>
      </Router>
    )
  }
}
