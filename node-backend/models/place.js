const mongoose = require('mongoose');
// 对象模式（Schema）和模型（Model）
const Schema = mongoose.Schema;

//MongoDB 中的数据记录是一种 BSON 格式的文件（BSON是一种用二进制描述的JSON文件格式）。
//MongoDB 将文件存储在集合中，将集合存储在数据库中。
//MongoDB 的数据库、集合都不用手动创建。
// MongoDB使用集合（collection）和文档（document）来描述和存储数据，
// 集合（collection）就相当于表，文档（document）相当于行，字段 (field) 相当于列，
//集合collection: 相当于关系型数据库中的表table。
//文件document: MongoDB 的数据记录单位，相当于关系型数据库中的记录row。
// 而MongoDB不同，一个集合里的多个文档可以有不同的结构，更灵活一些

//mongoose作为操作mongodb的工具库，可以理解为就是在操作documents，入门的概念是Schema ，
//是用来定义collections中的documents的形状；通过Schema可以生成一个构造函数Models，它对应的就是collections，而它的实例也称为Documents

//Mongoose 的一切都始于一个Schema。每个schema映射到MongoDB的集合(collection)和定义该集合(collection)中的文档的形式。
const placeSchema = new Schema({
    //不需要为其指定_id属性，因为数据库会自动为其添加主键属性。
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    address: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    //创建 Model 的时候，可给该 Model 中关联存储其它集合 _id 的字段设置 ref 选项。
    //ref 引用字段，选项告诉 Mongoose 在使用 populate() 填充的时候使用哪个 Model。
    // Schema.Types.ObjectId是一种内置的特殊类型，专门用来表示对象的ID
    //我们需要指定引用属性的类型和引用的模型名称。 mongoose.model('User', userSchema);
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User'}
});
//model: 一个文件的构造器，通过编译schema得到，一个model的实例就是一个文件，
//model负责从 MongoDB 数据库中创建和读取文档。
//将placeSchema 转成可以用的模型。通过mongoose.model(modelName, schema)
//第一个参数指模型的名称, 第二个参数指使用的Schema
//模型的实例是文档（documents）。文档有许多自己内置的实例方法。
module.exports = mongoose.model('Place', placeSchema);