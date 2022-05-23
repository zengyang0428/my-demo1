import React, { Component } from 'react';
import Web3 from "web3";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value : 0
    };
  }
  async componentDidMount() {
    //判断页面是否安装Metamask
    if (typeof window.ethereum !== 'undefined') {
      const ethereum = window.ethereum
      //禁止自动刷新，metamask要求写的
      //自动刷新连接更改
      ethereum.autoRefreshOnNetworkChange = false

      try {
        //第一次链接Metamask
        const accounts = await ethereum.enable()
        console.log(accounts)
        //初始化Provider 
        const provider = window['ethereum']
        console.log(provider)
        //获取网络ID
        console.log(provider.chainId)
        //实例化Web3
        const web3 = new Web3(provider)
        console.log(web3)
        //导入abi文件
        const abi = require("./hee.bai.json")
        //定义合约地址
        const address = "0x4bad726d6FfBCbED2F44e38a40EA3798966Cc6cE"
        //实例化合约
        window.myContract = new web3.eth.Contract(abi.abi,address)
        console.log(window.myContract)
        //获取当前账户地址
        window.defaultAccount = accounts[0];
        console.log(window.defaultAccount)
        //帐户更改
        ethereum.on('accountsChanged', function (accounts) {
          console.log("accountsChanged:" + accounts)
        })
        //网络已更改
        ethereum.on('networkChanged', function (networkVersion) {
          console.log("networkChanged:" + networkVersion)
        })
      } catch (e) {

      }
    } else {
      console.log('没有安装metamask')
    }
  }
   Getter = () => {
     //then 应该是获取当前的value
    window.myContract.methods.value().call().then(value=>{
      //打印value
      console.log(value)
      //传入
      this.setState({value:value})
    })
  }
  Increase = () => {
    //increaase 是智能合约中的函数 send可以放入两个参数 第一个地址 第二个gas
    window.myContract.methods.increase(1).send({from:window.defaultAccount})
    //交易hash
    .on('transactionHash',(transactionHash)=>{
      console.log('transactionHash',transactionHash)
    })
    //交易是否成功
    .on('confirmation',(confirmationNumber,receipt)=>{
      console.log({ confirmationNumber: confirmationNumber, receipt: receipt })
    })
    //交易收据
    .on('receipt',(receipt)=>{
      console.log({ receipt: receipt })
    })
    //报错
    .on('error',(error,receipt)=>{
      console.log({ error: error, receipt: receipt })
    })
  }
  render() {
    return (
      <div>
        <div>{this.state.value}</div>
        <div>
          <button onClick={() => { this.Getter() }}>Getter</button>
        </div>
        <div>
          <button onClick={() => { this.Increase() }}>Increase</button>
        </div>
        <div></div>
      </div>
    );
  }
}

export default App;