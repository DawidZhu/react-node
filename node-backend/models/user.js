const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
// 对象模式（Schema）和模型（Model）
const Schema = mongoose.Schema;

//schema: mongoose中，所有的东西都来源于一个schema，每个schema映射了一个MongoDB的集合 collection
const userSchema = new Schema({
    ////不需要为其指定_id属性，因为数据库会自动为其添加主键属性。
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    image: { type: String, required: true },
    //ref 选项告诉 Mongoose 在使用 populate() 填充的时候使用哪个 Model。
    //我们需要指定引用属性的类型和引用的模型名称。mongoose.model('Place', placeSchema);
    //创建 Model 的时候，可给该 Model 中关联存储其它集合 _id 的字段设置 ref 选项。
    places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place'}]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);


