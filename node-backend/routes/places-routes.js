const express = require('express');
// 参数校验 express-validator
const { check } = require('express-validator');
const placesControllers = require('../controllers/places-controllers');
// express中的Router作用就是为了方便我们更好的根据路由去分模块。 
// 避免将所有路由都写在入口文件中。 创建一个routes目录，专门用于放置路由文件，通过module.exports导出供外部使用
const router = express.Router();
// 路由头： /api/places, Routes 根据URL 路由到具体的 Controller 
// 用express 取得一个 Router 对象，然后用 get, post, patch, delete方法向其添加具体的路由。
// 请求参数传给 pid ,id = 64f2c8523cd83adee24f6c73
//使用 router.use() 和 router.METHOD() 函数装入路由器层中间件
// router 层中间件
router.get('/:pid', placesControllers.getPlaceById);
// app.get("/books",(req,res)=>{}

// 前端调用 http://localhost:1000/api/places/user/64f3e8ac3cd83adee24f6c85
router.get('/user/:uid', placesControllers.getPlacesByUserId);

// post 方法 路由
router.post(
     '/',
     [
       check('title')
         .not()
         .isEmpty(),
       check('description').isLength({ min: 5 }),
       check('address')
         .not()
         .isEmpty()
     ],
     placesControllers.createPlace
   );



// express router 使用 patch, 等于update
// 从前台页面传值，更新 title，description
router.patch(
     '/:pid',
     [
       check('title')
         .not()
         .isEmpty(),
       check('description').isLength({ min: 5 })
     ],
     // 调用controller update 方法
     placesControllers.updatePlace
   );

router.delete('/:pid', placesControllers.deletePlace);
//  export router
module.exports = router;
