import React, { Component } from 'react';

import memoryUtils from '../../utils/memoryUtils'
import {Redirect, Route,Switch} from 'react-router-dom'
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav'
import Head from '../../components/header'
import './admin.less'

import Home from '../../pages/home/home'
import Category from '../../pages/category/category'
import Bar from '../../pages/charts/bar'
import Line from '../../pages/charts/line'
import Pie from '../../pages/charts/pie'
import Product from '../../pages/product/product'
import Role from '../../pages/role/role'
import User from '../../pages/user/user'

const { Header, Footer, Sider, Content } = Layout;
export default class Admin extends Component {
render(){   
  const user = memoryUtils.user
  if(!user || !user._id){
    //如果在render中跳转则先在react-router-dom引入Redirect，并return跳转
    return <Redirect to='/login'/>
  }
  return (
    <Layout style={{minheight:'100%'}}>
      <Sider>
         <LeftNav/>
      </Sider>
      <Layout>
        <Header><Head/></Header>
        <Content style={{margin:"20px",background:"#fff"}}>
          <Switch>
              <Route path='/home' component={Home}/>
              <Route path='/category' component={Category}/>
              <Route path='/product' component={Product}/>
              <Route path='/user' component={User}/>
              <Route path='/role' component={Role}/>
              <Route path="/charts/bar" component={Bar}/>
              <Route path="/charts/pie" component={Pie}/>
              <Route path="/charts/line" component={Line}/>
            <Redirect to='/home' />
          </Switch>
        </Content>
        <Footer style={{textAlign:'center',color:'#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳的操作体验</Footer>
      </Layout>
    </Layout>
  )
}
}

                                        