import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from "react-router-dom";

const Books = () => {
     const [books, setBooks] = useState([])
     //State Hook让函数组件也可以有state状态, 并进行状态数据的读写操作
     // 语法: const [xxx, setXxx] = React.useState(initValue)  

     useEffect(()=>{
          //默认情况下，React 会在每次渲染后调用副作用函数 —— 包括第一次渲染的时候
          //通过使用这个 Hook，你可以告诉 React 组件需要在渲染后执行某些操作
          //将 useEffect 放在组件内部让我们可以在 effect 中直接访问 count state 变量（或其他 props）
          //useEffect会在每次 DOM 渲染后执行，不会阻塞页面渲染。
          const fetchAllBooks = async ()=>{  

               try {
                   const res = await axios.get("http://localhost:8800/books") 
                   // Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中
                   //从浏览器中创建 XMLHttpRequests，从 node.js 创建 http 请求
                   //await 修饰的如果是Promise对象：可以获取Promise中返回的内容（resolve或reject的参数），且取到值后语句才会往下执行；
                   //如果不是Promise对象：把这个非promise的东西当做await表达式的结果。
                   console.log(res)
                   setBooks(res.data)
               } catch (error) {
                    console.log(error)
               }
          }
          fetchAllBooks()

     },[])
     //该 Hook 有两个参数，第一个参数是一个包含命令式、且可能有副作用代码的函数，第二个参数是一个数组，
     //此参数来控制该Effect包裹的函数执不执行，如果第二个参数不传递，则该Effect每次组件刷新都会执行
  
     console.log(books);

     const handleDelete = async (id) => {
          try {
            await axios.delete(`http://localhost:8800/books/${id}`);
            window.location.reload()
          } catch (err) {
            console.log(err);
          }
        };

        // className 属性用于指定 CSS 的 class，此特性适用于所有常规 DOM 节点和 SVG 元素，如 <div>，<a> 及其它标签。
     return (
    <div>
<h1> Books shop</h1>
<div className='books'>
     
{books.map(book =>(
     <div className='book' key={book.id}>
          {book.cover && <image src={book.cover} alt=""></image>}
          <h2>{book.title}</h2>
          <p>{book.des}</p>
          <span>{book.price}</span>

          <button className="delete" onClick={() => handleDelete(book.id)}>Delete</button>
            <button className="update">
              <Link
                to={`/update/${book.id}`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Update
              </Link>
            </button>

     </div>


)
)}

</div>

<button>
     <Link to="/add"> Add new book</Link>
</button>
    </div>
  )
}

export default Books
