var express = require('express');
var bodyParser = require('body-parser');

var router = express.Router();

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true }));
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

 
router.post('/login', function(req, res, next) {
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'digitalmicroscope'
});

connection.connect();

var values=req.body.values;
var data = JSON.parse(values); 
console.log(data);
var mailid=data.mailid;
var password=data.password;
var response = {};
connection.query("select e.emp_first_name first_name,r.role_description role,cast(e.center_id as char) center_id,cast(u.user_id as char) user_id from emp_master e,role_master r ,user_master u where e.emp_id = u.emp_id and e.role_id = r.role_id and u.mail_id='"+mailid+"' and u.password='"+password+"'",function(err, rows, fields) {
  if (!err)
  {
    console.log('The solution is: ', rows);
	numRows = rows.length;

	 if(rows.length!=0)
		response = {success: rows};
	  else
		  response = {error:'incorrect credentials' };
	
	}
  else{
	  response = {exception: 'something went wrong, please try after some time.'};
  }
res.json(response);  
});
connection.end();

});


router.post('/display_edit_patient_detail', function(req, res, next) {
 var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'digitalmicroscope'
});

connection.connect();
var values=req.body.values;
var data = JSON.parse(values); 
console.log(data);
var patient_id=data.patient_id;


var response = {};
connection.query("Select  cast(p.pat_id as char) ID,Upper(concat(p.pat_first_name,' ',ifnull(p.pat_middle_name,''),'',p.pat_last_name)) NAME,cast(p.pat_age as CHAR) AGE, upper(p.pat_gender) SEX, ifnull(p.pat_address,'') ADDRESS,ifnull(p.pat_contact_no,'') PHONE_NO,ifnull(p.pat_email_address,'') EMAIL_ADDRESS,ifnull(p.pat_notes,'') OTHER_INFORMATION FROM patient_master p Where p.pat_id="+patient_id, function(err, rows, fields) {
  if (!err)
  {
    console.log('The solution is: ', rows);
	numRows = rows.length;

	 if(rows.length!=0)
		response = {success: rows};
	  else
		  response = {error:'no rows found' };
	
	}
  else{
	  response = {exception: 'something went wrong, please try after some time.'};
  }
res.json(response);
});
connection.end();

});


router.post('/add_new_patient', function(req, res, next) {
 var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'digitalmicroscope'
});

connection.connect();
var values=req.body.values;
var data = JSON.parse(values); 
console.log(data);

var firstname=data.firstname;
var middlename=data.middlename;
var lastname=data.lastname;
var age=data.age;
var address=data.address;
var gender=data.gender;
var phoneno=data.phoneno;
var emailid=data.emailid;
var note=data.note;
var center_id=data.center_id;
var user_id=data.user_id;

var val;
var response = {};
connection.query("CALL add_patient('"+firstname+"','"+middlename+"','"+lastname+"',"+age+",'"+address+"','"+gender+"','"+phoneno+"','"+emailid+"','"+note+"',"+center_id+","+user_id+",@val)");
connection.query("select @val as Patientid", function(err, rows, fields) {
  if (!err)
  {
    	response = {success: rows};
	  
	}
  else{
	  response = {exception:err };
  }
res.json(response);
});
connection.end();

});


router.post('/add_patient_queue', function(req, res, next) {
 var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'digitalmicroscope'
});

connection.connect();
var values=req.body.values;
var data = JSON.parse(values); 
console.log(data);

var patientid=data.patientid;
var doctorname=data.doctorname;
var testname=data.testname;
var userid=data.userid;
var val;
var response = {};
connection.query("CALL add_queuee("+patientid+",'"+doctorname+"','"+testname+"',"+userid+",@val)");
connection.query("select @val as testid", function(err, rows, fields) {
  if (!err)
  {
    	response = {success: rows};
	  
	}
  else{
	  response = {exception:err };
  }
res.json(response);
});
connection.end();

});


router.post('/remove_from_queue', function(req, res, next) {
 var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'digitalmicroscope'
});

connection.connect();
var values=req.body.values;
var data = JSON.parse(values); 
console.log(data);

var patientid=data.patientid;
var testid=data.testid;
var userid=data.userid;
var response = {};
connection.query("CALL remove_queue("+patientid+","+testid+","+userid+",@val)");
connection.query("select (@val) as transid", function(err, rows, fields)

 {
	 	 
  if (!err)
  {      
	     if(rows[0].transid=='error')
	     response = {error: rows};	
	     else
		 response = {success: rows};	
	}
  else{
	  response = {exception:err };
  }
res.json(response);
});
connection.end();

});




router.post('/submit_by_technician', function(req, res, next) {
 var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'digitalmicroscope'
});

connection.connect();
var values=req.body.values;
var data = JSON.parse(values); 
console.log(data);

var patientid=data.patientid;
var testid=data.testid;
var userid=data.userid;
var image_location=data.image_location;
var response = {};
connection.query("CALL technician_submit("+patientid+","+testid+","+userid+",'"+image_location+"',@val)");
connection.query("select ifnull(@val,0) as transid", function(err, rows, fields) {
  if (!err)
  {
    	if(rows[0].transid=='error')
	     response = {error: rows};	
	     else
		 response = {success: rows};
	}
  else{
	  response = {exception:err };
  }
res.json(response);
});
connection.end();

});








router.post('/edit_patient', function(req, res, next) {
 var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'digitalmicroscope'
});

connection.connect();

var values=req.body.values;
var data = JSON.parse(values); 
console.log(data);
var patientid=data.patientid;
var firstname=data.firstname;
var middlename=data.middlename;
var lastname=data.lastname;
var age=data.age;
var address=data.address;
var gender=data.gender;
var phoneno=data.phoneno;
var emailid=data.emailid;
var note=data.note;

var val;
var response = {};
connection.query("CALL edit_patient('"+firstname+"','"+middlename+"','"+lastname+"',"+age+",'"+address+"','"+gender+"','"+phoneno+"','"+emailid+"','"+note+"',"+patientid+")", function(err,result) {
  if (!err)
  {
    	response = {success: result};
	  
	}
  else{
	  response = {exception:err };
  }
res.json(response);
});
connection.end();

});





router.post('/display_all_patient', function(req, res, next) {
 var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'digitalmicroscope'
});

connection.connect();
var response = {};
connection.query("Select Upper(concat(p.pat_first_name,' ',ifnull(p.pat_middle_name,''),' ',p.pat_last_name)) name ,cast(p.pat_age as CHAR) age,upper(p.pat_gender) gender, cast(p.pat_id as CHAR) id,p.pat_contact_no contact_no,p.pat_email_address email_address FROM patient_master p" , function(err, rows, fields) {
  if (!err)
  {
    console.log('The solution is: ', rows);
	numRows = rows.length;

	 if(rows.length!=0)
		response = {success: rows};
	  else
	    response = {error:'no rows found' };
	
	}
   else
   {   
    console.log(err);
   }
res.json(response);
});

connection.end();

});


router.post('/display_all_queue_list', function(req, res, next) {
 var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'digitalmicroscope'
});

connection.connect();
var response = {};
connection.query("Select date_format(t.investigation_date,'%m-%d-%Y') investigation_date,cast(t.test_id as char) testid,Upper(concat(p.pat_first_name,' ',ifnull(p.pat_middle_name,''),' ',p.pat_last_name)) name,cast(p.pat_id as char) id,a.action_desc status from test_master t,patient_status_trans s,patient_master p,action_master a  where s.test_id = t.test_id and s.pat_id=p.pat_id and s.action_no=a.action_no and s.active_flag='Y' and s.action_no in(1,2) order by t.investigation_date desc" , function(err, rows, fields) {
  if (!err)
  {
    console.log('The solution is: ', rows);
	numRows = rows.length;

	 if(rows.length!=0)
		response = {success: rows};
	  else
	    response = {error:'no rows found' };
  }
  else
  {
    console.log(err);
  }
res.json(response);  
});

connection.end();

});



router.post('/get_patient_details', function(req, res, next) {
 var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'digitalmicroscope'
});

connection.connect();
var values=req.body.values;
var data = JSON.parse(values); 
console.log(data);

var patientid=data.patientid;


var response = {};
connection.query("Select cast(p.pat_id as char) patint_id,Upper(concat(p.pat_first_name,' ',ifnull(p.pat_middle_name,''),' ',p.pat_last_name)) name,cast(p.pat_age as CHAR) age, upper(p.pat_gender) sex, cast(t.test_id as CHAR) report_no,date_format(t.investigation_date ,'%m-%d-%Y') investigation_date,(t.doctorname) refferedby FROM patient_master p,test_master t Where p.pat_id = t.pat_id and p.pat_id="+patientid, function(err, rows, fields) {
  if (!err)
  {
    console.log('The solution is: ', rows);
	numRows = rows.length;

	 if(rows.length!=0)
		response = {success: rows};
	  else
	    response = {error:'no rows found' };
  }
  else
  {
    console.log(err);
  }
res.json(response);  
});

connection.end();

});



router.post('/reject_slide_by_path', function(req, res, next) {
 var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'digitalmicroscope'
});

connection.connect();
var values=req.body.values;
var data = JSON.parse(values); 
console.log(data);

var testid=data.testid;
var userid=data.userid;
var rejectnote=data.rejectnote;
var response = {};
connection.query("CALL reject_slide("+testid+","+userid+",'"+rejectnote+"',@val)");
connection.query("select ifnull(@val,0) as transid", function(err, rows, fields) {
  if (!err)
  {
    	if(rows[0].transid=='error')
	     response = {error: rows};	
	     else
		 response = {success: rows};
	}
  else{
	  response = {exception:err };
  }
res.json(response);
});
connection.end();

});


router.post('/submit_slide_annotate_report', function(req, res, next) {
 var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'digitalmicroscope'
});

connection.connect();
var values=req.body.values;
var data = JSON.parse(values); 
console.log(data);

var testid=data.testid;
var tp=data.tp;
var bt=data.bt;
var lf=data.lf;
var rg=data.rg;
var notes=data.notes;
var response = {};
connection.query("CALL submit_annotate_report("+testid+","+tp+","+bt+","+lf+","+rg+",'"+notes+"',@val)");
connection.query("select ifnull(@val,0) as transid", function(err, rows, fields) {
  if (!err)
  {
    	if(rows[0].transid=='error')
	     response = {error: rows};	
	     else
		 response = {success: rows};
	}
  else{
	  response = {exception:err };
  }
res.json(response);
});
connection.end();

});


router.post('/submit_screen_report', function(req, res, next) {
 var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'digitalmicroscope'
});

connection.connect();
var values=req.body.values;
var data = JSON.parse(values); 
console.log(data);

var testid=data.testid;
var tp=data.tp;
var bt=data.bt;
var lf=data.lf;
var rg=data.rg;
var notes=data.notes;
var response = {};
connection.query("CALL submit_screenshot_master("+testid+","+tp+","+bt+","+lf+","+rg+",'"+notes+"',@val)");
connection.query("select ifnull(@val,0) as transid", function(err, rows, fields) {
  if (!err)
  {
    	if(rows[0].transid=='error')
	     response = {error: rows};	
	     else
		 response = {success: rows};
	}
  else{
	  response = {exception:err };
  }
res.json(response);
});
connection.end();

});


router.post('/report_submit', function(req, res, next) {
 var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'digitalmicroscope'
});

connection.connect();
var values=req.body.values;
var data = JSON.parse(values); 
console.log(data);

var testid=data.testid;
var userid=data.userid;
var notes=data.notes;
var obsnote=data.obsnote;

var response = {};
connection.query("CALL submit_report("+testid+","+userid+",'"+notes+"','"+obsnote+"',@val)");
connection.query("select ifnull(@val,0) as transid", function(err, rows, fields) {
  if (!err)
  {
    	if(rows[0].transid=='error')
	     response = {error: rows};	
	     else
		 response = {success: rows};
	}
  else{
	  response = {exception:err };
  }
res.json(response);
});
connection.end();

});






router.post('/display_queue_list_path', function(req, res, next) {
 var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'digitalmicroscope'
});

connection.connect();
var response = {};
connection.query("Select date_format(t.investigation_date,'%m-%d-%Y') investigation_date,cast(t.test_id as char) testid,Upper(concat(p.pat_first_name,' ',ifnull(p.pat_middle_name,''),' ',p.pat_last_name)) name,cast(p.pat_id as char) patientid,cast(p.center_id as char) centerid, ifnull(t.reject_note,'') note,a.action_desc status from test_master t,patient_status_trans s,patient_master p,action_master a  where s.test_id = t.test_id and s.pat_id=p.pat_id and s.action_no=a.action_no and s.active_flag='Y' and s.action_no in(2,4) order by t.investigation_date desc" , function(err, rows, fields) {
  if (!err)
  {
    console.log('The solution is: ', rows);
	numRows = rows.length;

	 if(rows.length!=0)
		response = {success: rows};
	  else
	    response = {error:'no rows found' };
  }
  else
  {
    console.log(err);
  }
res.json(response);  
});

connection.end();

});

router.post('/get_patient_details_slide_view', function(req, res, next) {
 var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'digitalmicroscope'
});

connection.connect();
var values=req.body.values;
var data = JSON.parse(values); 
console.log(data);

var testid=data.testid;


var response = {};
connection.query("Select cast(p.pat_id as char) patint_id,Upper(concat(p.pat_first_name,' ',ifnull(p.pat_middle_name,''),' ',p.pat_last_name)) name,cast(p.pat_age as CHAR) age, upper(p.pat_gender) sex, cast(t.test_id as CHAR) report_no, cast(p.center_id as CHAR) center_id FROM patient_master p,test_master t Where p.pat_id = t.pat_id and t.test_id="+testid, function(err, rows, fields) {
  if (!err)
  {
    console.log('The solution is: ', rows);
	numRows = rows.length;

	 if(rows.length!=0)
		response = {success: rows};
	  else
	    response = {error:'no rows found' };
  }
  else
  {
    console.log(err);
  }
res.json(response);  
});

connection.end();

});

router.post('/display_all_report_list', function(req, res, next) {
 var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'digitalmicroscope'
});

connection.connect();

var response = {};
connection.query("Select date_format(t.reportdate,'%m-%d-%Y') report_date,cast(t.test_id as char) testid,Upper(concat(p.pat_first_name,' ',ifnull(p.pat_middle_name,''),' ',p.pat_last_name)) name,cast(p.pat_id as char) Patientid,cast(p.center_id as char) centerid from test_master t,patient_status_trans s,patient_master p,action_master a  where s.test_id = t.test_id and s.pat_id=p.pat_id and s.action_no=a.action_no and s.active_flag='Y' and s.action_no in(3)", function(err, rows, fields) {
  if (!err)
  {
    console.log('The solution is: ', rows);
	numRows = rows.length;

	 if(rows.length!=0)
		response = {success: rows};
	  else
	    response = {error:'no rows found' };
  }
  else
  {
    console.log(err);
  }
res.json(response);  
});

connection.end();

});


router.post('/get_patient_wise_report', function(req, res, next) {
 var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'digitalmicroscope'
});

connection.connect();
var values=req.body.values;
var data = JSON.parse(values); 
console.log(data);

var patientid=data.patientid;


var response = {};
connection.query("Select date_format(t.reportdate,'%m-%d-%Y') report_date,cast(t.test_id as char) testid,Upper(concat(p.pat_first_name,' ',ifnull(p.pat_middle_name,''),' ',p.pat_last_name)) pat_name,cast(p.pat_id as char) patientid, t.doctorname ref_doctorname, t.testname testname, t.image_location image_location,t.notes_by_pat notes,t.observation_note_path observeration_name,Upper(concat(e.emp_first_name,' ',ifnull(e.emp_middle_name,''),' ',e.emp_last_name)) emp_name from test_master t,patient_status_trans s,patient_master p,action_master a,emp_master e,user_master u where s.test_id=t.test_id and s.pat_id=p.pat_id and s.action_no=a.action_no and s.user_id=u.user_id and u.emp_id =e.emp_id and s.active_flag='Y' and s.action_no in(3) and p.pat_id="+patientid+" order by t.reportdate desc" , function(err, rows, fields) {
  if (!err)
  {
    console.log('The solution is: ', rows);
	numRows = rows.length;

	 if(rows.length!=0)
		response = {success: rows};
	  else
	    response = {error:'no rows found' };
  }
  else
  {
    console.log(err);
  }
res.json(response);  
});

connection.end();

});

router.post('/display_all_report_list', function(req, res, next) {
 var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'digitalmicroscope'
});

connection.connect();

var response = {};
connection.query("Select date_format(t.reportdate,'%m-%d-%Y') report_date,cast(t.test_id as char) testid,Upper(concat(p.pat_first_name,' ',ifnull(p.pat_middle_name,''),' ',p.pat_last_name)) pat_name,cast(p.pat_id as char) patientid,cast(p.center_id as char) centerid from test_master t,patient_status_trans s,patient_master p,action_master a  where s.test_id = t.test_id and s.pat_id=p.pat_id and s.action_no=a.action_no and s.active_flag='Y' and s.action_no in(3)", function(err, rows, fields) {
  if (!err)
  {
    console.log('The solution is: ', rows);
	numRows = rows.length;

	 if(rows.length!=0)
		response = {success: rows};
	  else
	    response = {error:'no rows found' };
  }
  else
  {
    console.log(err);
  }
res.json(response);  
});

connection.end();

});






module.exports = router;
