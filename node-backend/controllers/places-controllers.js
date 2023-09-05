const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');
// Controller ， 获取参数，调用Modles
// Middleware 函数，getPlaceById 根据id 查询 Place
// 请求参数 pid， router.get('/:pid',...）
// async用于申明一个function是异步的，而await 用于等待一个异步方法执行完成
// async 和 await 关键字让我们可以用一种更简洁的方式写出基于 Promise 的异步行为，
// async函数会返回一个promise对象
const getPlaceById = async(req, res, next) => {
  // 中间件函数能够访问请求对象 (req)、响应对象 (res) 以及应用程序的请求/响应循环中的下一个中间件函数。
  // 下一个中间件函数通常由名为 next 的变量来表示。调用 next() 函数将请求传递到堆栈中的下一个中间件函数。
  const placeId = req.params.pid; 

  let place;
  try {
    // await 用于等待一个异步方法执行完成,等的是一个表达式，那么表达式，可以是一个常量，变量，promise，函数等。
    //await会阻塞整一个流程，直到结果返回之后，才会继续下面的代码。
    //所以await只能在async函数中使用，如果在正常程序中使用，会造成整个程序阻塞，
    //Place模型的实例是文档（documents）。文档有许多自己内置的实例方法。
    place = await Place.findById(placeId);
  } catch (err) {
     // HttpError 500
    const error = new HttpError(
      'Something went wrong, could not find a place.',
      500
    );
    // next() : 所有中间件功能完成后将运行或执行代码。
    //next(err) 将跳过链中所有剩余的处理程序
    return next(error);
  }
 // HttpError 404
 if (!place) {
  const error = new HttpError(
    'Could not find a place for the provided id.',
    404
  );
  return next(error);
}
  // toObject的方法将mongoose文档转成成到一个普通的JavaScript对象
  // 让所有的虚函数显示在你的console.log输出，设置toObject选项为 { getters: true }：
  res.json({ place: place.toObject({ getters: true }) });
};


// 根据 userId, 查询user 下面的place
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  console.log(userId);

  // let places;
  let userWithPlaces;
  try {
    //User.findOne({ name: 'David' }).populate()，有多个数据满足查询条件的，只返回第一条。
    //Mongoose 的 populate() 可以连表查询，即在另外的集合中引用其文档。
    //Query.populate(path, [select], [model], [match], [options])
    // path： String类型的时， 指定要填充的关联字段，要填充多个关联字段可以以空格分隔。 
    // 等于左连接查询结果
    userWithPlaces = await User.findById(userId).populate('places');
    console.log(userWithPlaces);
    /*
    */
  } catch (err) {
    // HttpError 500  更新操作这里报错？？？
    const error = new HttpError(
      'Fetching places failed , please try again later david',
      500
    );
    return next(error);
  }
  // 
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      //HttpError 404
      new HttpError('Could not find places for the provided user id.from backend', 404)
    );
  }
  res.json({
    places: userWithPlaces.places.map(place =>
      place.toObject({ getters: true })
    )
  });
};

// create place, 同时需要更新user表的place 字段
const createPlace = async (req, res, next) => {
  // 校验 req
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  // 获取 req.body
  const { title, description, address, creator } = req.body;

  let coordinates = {
    "lat": 100,
    "lng": 200
  };
  // try {
  //   coordinates = await getCoordsForAddress(address);
  // } catch (error) {
  //   return next(error);
  // }
// createdPlace： 常量数据
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      'https://123.jpg',
    creator
  });

  let user;
  try {
    // 查找创建者对应的 user 信息
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError('User findById, please try again', 500);
    return next(error);
  }
  // HttpError 404
  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404);
    return next(error);
  }

  try {
    //多文档事务（无论是在分片群集还是副本集上）也称为从 MongoDB 4.2 开始的分布式事务。
    //mongoose 多文档事务，Transactions are undoubtedly the most exciting new feature in MongoDB 4.0
    //In order to use transactions, you need a MongoDB replica set, 
    //and starting a replica set locally for development is an involved process.
    const sess = await mongoose.startSession();
    // 开始一个 Transaction
    sess.startTransaction();
    // 保存 createdPlace 常量数据，使用模型的.save()方法存储对象的数据到数据库中
    console.log(createdPlace);
    await createdPlace.save({ session: sess });
    
    // ！！！ 同时更新user表的 place 字段
    //在Mongoose 中将一个对象添加到数组中可以使用 push() 方法
    console.log(user);
    user.places.push(createdPlace);

    // 保存 user 数据，使用模型的.save()方法存储对象的数据到数据库中
    await user.save({ session: sess });
    await sess.commitTransaction();

  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Creating place and user failed, please try again and again.',
      500
    );
    return next(error);
  }
  // 返回报文：createdPlace
  res.status(201).json({ place: createdPlace });
};

// update 
const updatePlace = async (req, res, next) => {
  //校验请求参数
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  // 获取请求参数 title，description
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    //查询要更新的 place 是否存在
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }
  // 重新赋值需要更新的字段
  place.title = title;
  place.description = description;

  try {
    // 保存
    await place.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

// delete 
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError('Could not find place for this id.', 404);
    return next(error);
  }

  try {

    // mongoose 多文档事务
    const sess = await mongoose.startSession();
    sess.startTransaction();
    // 删除 place 数据
    await place.remove({session: sess});
    // pull ？？？
    // 删除 user 下的 places 里面的id
    place.creator.places.pull(place);
    // 保存 place.creator
    await place.creator.save({session: sess});
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    );
    return next(error);
  }
  
  res.status(200).json({ message: 'Deleted place.' });
};

// exports
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
