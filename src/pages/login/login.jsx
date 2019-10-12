import React, { Component } from 'react';
import './login.less'
import logo from '../../assets/images/logo.png'
import { Form, Icon, Input, Button,message} from 'antd';
import {Redirect} from 'react-router-dom'
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
//登陆的路由
 class Login extends Component {
 
  //提交表单的数据 方法
  handleSubmit = (event) => {
    event.preventDefault();

    // //得到form对象
    // const form =this.props.form
    // //获取表单输入的数据
    // const values = form.getFieldsValue()
    // console.log('submit',values)

    //对所有的表单字段进行校验
    this.props.form.validateFields(async(err, values) => {
      //校验成功
      if (!err) {
        console.log('提交登陆的ajax请求',values)
        const{username, password}=values

        // reqLogin(username, password).then(response => {
        //   console.log('成功了', response.data)
        // }).catch(error => {
        //   console.log('失败了', error)
        // })
    
        //syanc和await处理,await等待返回的最后结果，
        //syanc放在最近的函数，用try,catch来处理失败和成功
        //可简化promise的使用,不用再使用then()来指定成功或者失败的回调函数
        //以同步编码（没有回调函数了）方式实现异步流程。
        try {
          const result = await reqLogin(username, password)
          console.log("result",result.data,"result")
          // let result = response.data  
          if(result.status ===0){
            //登陆成功
            message.success('登陆成功')

    //保存user用户的信息
            const user = result.data
            memoryUtils.user =user //保存到内存中
    //保存user数据到本地，只要不去手动删除就一直存在
            storageUtils.saveUser(user)

            //跳转到管理界面   
            //因为不需要再回退到登陆页面 用replace（替代），如果需要回退的话用push,它是一成一成叠加上去的
            this.props.history.replace('/')
          }else{
            //登陆失败
            message.error(result.msg)
          }
        }catch(error){
          console.log('请求出错',error)
        }

      }else{
        console.log('校验失败')
      }
    });
  }

  
  //对密码验证
  validatePwd = (rule, value, callback) => {
    console.log('pwd()',rule,value)
    if(!value){
     callback('请输入密码')
    }else if(value.length<4){
      callback('密码长度不能小于4位')
    }else if(value.length>12){
      callback('密码长度不能大于12位')
    }else if (!/^[a-zA-Z0-9_]+$/.test(value)){
      callback('密码必须是英文，数字下划线组成')//验证通过
    }else{
      callback()//验证通过
    }
    //  callback("xxxx")//验证不通过
  }

render(){  

  //如果用户已经登陆，自动跳转到管理页面
  const user = memoryUtils.user
  if(user && user._id) {
    return <Redirect to='/'/>
  }
  
  //得到具强大功能的form对象
  const form =this.props.form
  const { getFieldDecorator } = form;
  return (
    <div className="login">
        <header className="login-header">
            <img src={logo} alt="logo"/>
            <h1>React项目： 后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登陆</h2>
          <div>
            <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item> 
              {
                getFieldDecorator('username', {
              rules: [
                { required: true,whitespace: true, message: '用户名必须输入' },
                { min: 4, message: '用户名至少4位' },
                { max: 12, message: '用户名最多12位' },
                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文，数字下划线组成' },
              ],
              })
              (
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />,
              )
              }
              </Form.Item> 
              <Form.Item>             
              {
                getFieldDecorator('password', {
              rules: [
                {
                  validator: this.validatePwd
                }
               ]
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密码"
                />,
              )
              }
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  登陆
                </Button>
              </Form.Item>
            </Form>
          </div>
        </section>
    </div>
  )
}
}

/**
 1.高阶函数  
    1). 一类特别的函数
       a. 接受函数类型的参数
       b. 返回值是函数
    2). 常见
       a. 定时器： setTimeout()/ setInterval()
       b. Promise: Promise(()=>{}) then(value =>{},reason => {})
       c. 数组遍历相关的方法：forEach()/filter()/map()/reduce()/find()/findIndex()
       d.函数的对象bind()
       e.Form.create()() / getFieldDecorator()()
    3). 高阶函数更加有动态，更加具有狂展性
 2.高阶组件
    1). 本质就是一个函数
    2).接收一个组件（被包装组件），返回一个新的组件（包装组件） 保证组件会向被包装组件传入特定属性
    3). 作用： 扩展一个组件的功能
    4).高阶组件也是高阶函数： 接收一个组件函数，返回是一个新的组件函数
 
    */
  
const WrapLogin = Form.create()(Login)
export default  WrapLogin
/**
 1.前台表单验证
    1) 声明式实时表单验证：
         getFieldDecorator('标识名称', {
              rules: [
                { required: true,whitespace: true, message: '用户名必须输入' },
                { min: 4, message: '用户名至少4位' },
                { max: 12, message: '用户名最多12位' },
                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文，数字下划线组成' },
              ],
              })
    2) 自定义表单验证：
           getFieldDecorator('password', {
              rules: [
                {
                  validator: this.validatePwd
                }
               ]
              })
    3)  点击提示时统一验证
             this.props.form.validateFields((err, values) => {
                //校验成功
                if (!err) {
                  console.log('Received values of form: ', values);
                  console.log('提交登陆的ajax请求',values)
                }else{
                  console.log('校验失败')
                }
              });
 2.手机表单验证
 
 */