var express=require('express')
var app=express(); 
var mysql=require('mysql');
var port=process.env.PORT || 8080
var con=mysql.createConnection({

	host: "ec2-54-200-60-167.us-west-2.compute.amazonaws.com",
	user: "root",
	password: "amazon123",
	database: "healthclouddb"
});


app.use(express.static(__dirname+'/'))

app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
 res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
 next();
});
 
function db_connect()
	{
	con.connect(function(err){
		if(err)
			throw err;
		else
			console.log("Connection established succesfully");
		
		});
	}

 
 
app.get('/',function(req,res){
	 res.sendFile("/index.html");

})


app.get('/statement1',function(req,res){
	var statement="select * from health LIMIT 100";
	con.query(statement,function(err,rows){
		if(err) throw err;
		else{
			console.log("Data Retrieval Success");
			res.json(rows);
		}
	})
	
})


app.get('/search_by_health_id=:number',function(req,res){
	var statement="select * from health where health_Id="+req.params.number;
	var health_id_check="select count(*) as value from health where health_Id="+ req.params.number +" and health_Id IN(select distinct health_id from health)";
	con.query(health_id_check,function(err,rows){
		if(rows[0].value==0)
			res.json("No such records");
		else
			{
			con.query(statement,function(err,rows){
				if(err) throw err;
					else{
						console.log("Data retrieved for health_id :"+ req.params.number);
						res.json(rows);
						}
												})			
	 		}
 	}) 
}) 


app.get('/search_by_state=:state',function(req,res){
	var statement="select Health_Id,IssuerId,SourceName,StateCode from health where StateCode='"+req.params.state+"'";
	var state_check="select count(*) as value from health where StateCode='"+ req.params.state +"'";
	con.query(state_check,function(err,rows){
		console.log('Searching for the state' + req.params.state);
		if(rows[0].value==0)
			res.json("No such records");
		else
			{ 
			con.query(statement,function(err,rows){
				if(err) throw err;
					else{
						console.log("Data retrieved for state :"+ req.params.state);
						res.json(rows);
						}
												})			
	 		}
 	}) 
}) 


app.get('/search_by_issuerid=:issuerid',function(req,res){
	var statement="select Health_Id,IssuerId,SourceName,StateCode from health where IssuerId="+req.params.issuerid;
	var issuerid_check="select count(*) as value from health where IssuerId='"+ req.params.issuerid +"'";
	con.query(issuerid_check,function(err,rows){
		console.log('Searching for the state' + req.params.issuerid);
		if(rows[0].value==0)
			res.json("No such records");
		else
			{ 
			con.query(statement,function(err,rows){
				if(err) throw err;
					else{
						console.log("Data retrieved for issuerid :"+ req.params.issuerid);
						res.json(rows);
						}
												})			
	 		}
 	}) 
}) 



app.get('/delete_by_healthid=:healthid',function(req,res){
	var statement="delete from health where health_Id="+req.params.healthid;
	var issuerid_check="select count(*) as value from health where health_Id="+ req.params.healthid;
	con.query(issuerid_check,function(err,rows){
		console.log('Searching for the health Identity' + req.params.healthid);
		if(rows[0].value==0)
			res.json("No such records for the given health identity.");
		else
			{ 
			con.query(statement,function(err,rows){
				if(err) throw err;
					else{
						console.log("Data retrieved for health identity :"+ req.params.healthid);
						res.json("Data removed for health identity :"+ req.params.healthid);
						}
												})			
	 		}
 	}) 
}) 
 

app.get('/update_by_health_id=:healthid/new_issuer_id=:newissuerid/new_source_name=:newsourcename',function(req,res){
	var statement="update health set IssuerId="+req.params.newissuerid+", SourceName='"+req.params.newsourcename+"' where Health_Id="+req.params.healthid;
	var issuerid_check="select count(*) as value from health where health_Id="+ req.params.healthid;
	con.query(issuerid_check,function(err,rows){
		console.log('Searching for the health Identity: ' + req.params.healthid);
		if(rows[0].value==0)
			res.json("No such records for the given health identity.");
		else
			{ 
			con.query(statement,function(err,rows){
				if(err) throw err;
					else{
						console.log("Updated details for the given health Identity: "+ req.params.healthid);
						res.json("Updated the user details for health identity given : " + req.params.healthid);
						}
												})			
	 		}
 	}) 
})
 

app.get('/bulk_update_by_state=:actualstatecode/new_state_code=:newstatecode',function(req,res){
	var statement="update health set StateCode='"+req.params.newstatecode+"' where StateCode='"+req.params.actualstatecode+"'";
	var safe_mode="set SQL_SAFE_UPDATES=0;"
	var issuerid_check="select count(*) as value from health where StateCode='"+req.params.actualstatecode+"'";
	con.query(issuerid_check,function(err,rows){
		console.log('Searching for the health Identity' + req.params.actualstatecode);
		if(rows[0].value==0)
			res.json("No such records for the given health identity.");
		else
			{ 
			con.query(safe_mode,function(err,rows){
				if (err) { throw err}
				else console.log("Safe mode switched ON");
			})
			con.query(statement,function(err,rows){
				if(err) {
					console.log(err);
				//	throw err;
				}
					else{
						console.log("Bulk updated the records with the state name :"+ req.params.actualstatecode);
						res.json("Updated the state from: " + req.params.actualstatecode+" to "+req.params.newstatecode);
						}
												})			
	 		}
 	}) 
}) 

app.listen(port);

 