import express from "express"
import mysql from "mysql"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors())

const db = mysql.createConnection({
     host: "localhost",
     user: "root",
     password: "Davy2018",
     database: "db_test"

});

app.get("/",(req,res)=>{
     res.json("hello,from backend david")
});

app.get("/books",(req,res)=>{
     const q = "SELECT * FROM books";
     db.query(q,(err, data)=>{
          if(err) return res.json(err)
          return res.json(data)
     })
});

app.post("/books",(req,res)=>{
     const q = "insert into books(title,des,cover) values (?)"
     const values = [
          req.body.title,
          req.body.des,
          req.body.cover,

     ]

     db.query(q,[values],(err,data)=>{
          if(err) return res.json(err)
          return res.json("books have been created.")
     })
})

app.delete("/books/:id", (req, res) => {
     const bookId = req.params.id;
     const q = " DELETE FROM books WHERE id = ? ";
   
     db.query(q, [bookId], (err, data) => {
       if (err) return res.send(err);
       return res.json(data);
     });
   });

   app.put("/books/:id", (req, res) => {
     const bookId = req.params.id;
     const q = "UPDATE books SET `title`= ?, `des`= ?, `price`= ?, `cover`= ? WHERE id = ?";
   
     const values = [
       req.body.title,
       req.body.des,
       req.body.price,
       req.body.cover,
     ];
   
     db.query(q, [...values,bookId], (err, data) => {
       if (err) return res.send(err);
       return res.json(data);
     });
   });
   

app.listen(8800, ()=>{
     console.log("connect to backend 8800 david.")
})

// lsof -i:端口号
