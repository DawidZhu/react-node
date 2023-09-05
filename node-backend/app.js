const express = require('express');
//import express from "express" 
// 使用import， 需要添加 "type": "module",

// body-parser是一个HTTP请求体解析中间件，使用这个模块可以解析JSON、Raw、文本、URL-encoded格式的请求体，
// Express框架中就是使用这个模块做为请求体解析中间件。
//bodyParser变量是对中间件的引用。请求体解析后，解析值都会被放到req.body属性，内容为空时是一个{}空对象。
const bodyParser = require('body-parser');
// mongodb, mongoose是nodeJS提供连接mongodb的一个库,node环境中MongoDB数据库操作的封装，
// 一个对象模型工具，将数据库中的数据转换为JavaScript对象以供我们在应用中使用
const mongoose = require('mongoose')
// import express from "express"

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();
//express自带路由功能，可以侦听指定路径的请求，除此之外，express最大的优点就是middleware概念的灵活运用，
//使得各个模块得以解耦，像搭积木一样串起来就可以实现复杂的后端逻辑。还可以利用别人写好的中间件，避免重复造轮子Reinventing the wheel。
//express的 middleware 中间件就是一个函数，拥有req, res, next三个入口参数，分别表示请求上下文，响应上下文，下一个中间件。
//中间件是一种拦截器的思想，用于在某个特定的输入输出之间添加一些额外处理，同时不影响原有操作
//中间件的行为比较类似 Java 中过滤器的工作原理，就是在进入具体的业务处理之前，先让过滤器处理
// app.use(middleware) 使用中间件
app.use(bodyParser.json());

// 跨源资源共享 Cross-origin resource sharing CORS
//Access-Control-Allow-Origin响应头携带了服务端验证后允许的跨域请求域名。
// 对于简单跨域请求而言，浏览器经此消息头可以确认是否返回所请求的资源内容给客户端。
app.use((req, res, next) => {
  //指定允许其他域名访问， 设置*是最简单粗暴的
  res.setHeader('Access-Control-Allow-Origin', '*');
  //允许的请求头字段
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  //允许的请求类型
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

//要装入中间件函数，请调用 app.use() 并指定中间件函数
//中间件装入顺序很重要：首先装入的中间件函数也首先被执行。
// app.use(middleware) 使用中间件, 添加路由到应用上
// 以 /api/places 开始路径 路由到  placesRoutes
app.use('/api/places', placesRoutes); // => /api/places...
app.use('/api/users',usersRoutes);

// 调用路由中间件后，调用 错误处理中间件 for error 
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});
// 错误处理中间件函数的定义方式与其他中间件函数基本相同，差别在于错误处理函数有四个自变量而不是三个：
// (err, req, res, next)
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500)
  res.json({message: error.message || 'An unknown error occurred!'});
});
// lsof -i:端口号
// app.listen(1000);
// brew services list;
// brew services start mongodb-community@5.0;

//Mongoose是一个基于Node.js的ODM（对象文档映射器），利用它可以更方便地操作MongoDB数据库。
//它可以让开发者更容易定义Schema、执行查询、进行关联数据读写等操作。
//MongoDB 使用事务的前提是 MongoDB 版本大于 4.0,需要配置 MongoDB 工作模式为副本集 replica set,
// 启动replica set命令： run-rs -v 4.0.0 --shell
//单个 MongoDB 节点不足支持事务,因为 MongoDB 事务至少需要两个节点。其中一个是主节点，负责处理客户端请求，其余的都是从节点，负责复制主节点上的数据
//多文档事务（无论是在分片群集还是副本集上）也称为从 MongoDB 4.2 开始的分布式事务。

// 远程连接： "mongodb+srv://数据库用户名:数据库密码@IP地址:端口/数据库名"
// 本地连接："mongodb://localhost:端口/数据库名"
// Started replica set on "mongodb://localhost:27017,localhost:27018,localhost:27019?replicaSet=rs"
  mongoose.connect('mongodb://localhost:27017,localhost:27018,localhost:27019/testdb?replicaSet=rs', {
    useNewUrlParser: true,
    useUnifiedTopology: true

      })
  .then(() => {
    app.listen(1000);
  })
  .catch(err => {
    console.log(err);
  });