const express = require("express");
const mysql = require("mysql");

const app = express();

// If causing any error name of cors policy or Access control allow orgin
// Use this below code

// const cors = require("cors")
// app.use(function(request,response,next){
// 	response.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//   response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	next();
// })
// app.use(cors());




app.use(express.static("public"));
app.use(express.json());







const con = mysql.createConnection({
	host:'localhost',
    user:'*****************Your Mysql database username****',
    password:'*****************Your Mysql database password****',
    database:'shorturls'
});



// Download and Install the mysql database
// Steps to create Mysql database using CMD
// start your Folder localdisk C...Mysql...mysqlserver---bin-- cmd
// type commands in cmd ...create database shorturls;
// create table links( longurl varchar(250),shorturlid varchar(250), id int(1) auto_increment);
// select  from links;   to view the inserted datas in mysql database
// use shorturls;
// connect shorturls;


con.connect(function(error){
	if(error){
		console.log("Database connection failed");
	}
})



app.get("/",function(request,response){
	response.sendFile(__dirname + "/public/index.html");
});


app.post("/api/create-short-url",function(request,response){
	let uniqueID = Math.random().toString(36).replace(/[^a-z0-9]/gi,'').substring(2,10);
	let sql = `INSERT INTO links(longurl,shorturlid) VALUES('${request.body.longurl}','${uniqueID}')`;
	con.query(sql,function(error,result){
		if(error){
			response.status(500).json({
				status:"notok",
				message:"Something went wrong"
			});
		} else {
			response.status(200).json({
				status:"ok",
				shorturlid:uniqueID
			});
		}		
	})
});


app.post("/api/create-short-url",function(request,response){
	let uniqueID = Math.random().toString(36).replace(/[^a-z0-9]/gi,'').substring(2,10);
	let sql = `INSERT INTO links(longurl,shorturlid) VALUES('${request.body.longurl}','${uniqueID}')`;
	con.query(sql,function(error,result){
		if(error){
			response.status(500).json({
				status:"notok",
				message:"Something went wrong"
			});
		} else {
			response.status(200).json({
				status:"ok",
				shorturlid:uniqueID
			});
		}		
	})
});

app.get("/api/get-all-short-urls",function(request,response){
	let sql = `SELECT * FROM links`;
	con.query(sql,function(error,result){
		if(error){
			response.status(500).json({
				status:"notok",
				message:"Something went wrong"
			});
		} else {
			response.status(200).json(result);
		}
	})
});


app.get("/:shorturlid",function(request,response){
	let shorturlid = request.params.shorturlid;
	let sql = `SELECT * FROM links WHERE shorturlid='${shorturlid}' LIMIT 1`;
	con.query(sql,function(error,result){
		if(error){
			response.status(500).json({
				status:"notok",
				message:"Something went wrong"
			});
		} else {
			sql = `UPDATE links SET count=${result[0].count+1} WHERE id='${result[0].id}' LIMIT 1`;
			con.query(sql,function(error,result2){
				if(error){
					response.status(500).json({
						status:"notok",
						message:"Something went wrong"
					});
				} else {
					response.redirect(result[0].longurl);
				}
			})
		}
	})
});


 app.listen(5000);


