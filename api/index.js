module.exports = function(app,db,SMSCheck,uuidV1){
app.use('/api/app', function(req, res) {
        if(!handleAuth(req, res, datastore.auth)) return;

        var storedReq;

        if(req.method === 'GET' || req.method === 'POST') {
          datastore.requests.unshift(storedReq = {
            useragent: req.headers['user-agent'],
            method: req.method,
            time: new Date().toString(),
          });
        }

        switch(req.method) {
          case 'GET':
            return res.json({ 'medic-gateway': true });
            case 'POST':
            // enforce expected headers
        var _dataDB = req.body.messages;
        var _responseMSG = [];

        console.log('_SMS_GATEWAY_POST_');
        console.log(_dataDB);
        _dataDB.forEach(function(eachDB){
            //update View
            eachDB.type = "sms_in";
            eachDB.content = eachDB.content.replace(/\n/g, '');
            if(SMSCheck.validSmsSyntax(eachDB.content) == true){
                var _smsSyntax = eachDB.content.split(' '),
                    _transCode = uuidV1(),
                    _msgTasks = {},
                    _task_register = [],
                    drugRegID = '';


                var _xdata = {
                    "from" : eachDB.from,
                    "form" : "R",
                    "state": "PENDING",
                    "reported_date" : new Date().toString(),
                    "sms_message" : {
                        "form" : "R",
                        "type" : "sms_message",
                        "gateway_ref" : "e6f0bb62-de84-4d67-b282-1dd670a487ac",
                        "from" : eachDB.from,
                        "message" : eachDB.content
                    },
                    updatedAt: new Date(),
                    createdAt: new Date()
                }

                db.collection('drugregisters').insert(_xdata).then(function(data_reg){
                            drugRegID = data_reg.insertedIds[0].toString();


                db.collection('hfdrugs').find({"drug_code": _smsSyntax[1].toUpperCase(),"hf_detail.person_mobile": eachDB.from}).toArray(function(error, data){
                    if(error == null){
                        if(data.length > 0){
                            //_task_register.push(create_task("Register Succeed! DRUG CODE: "+_smsSyntax[1]+", QTY: "+_smsSyntax[2],eachDB.from,'sms_default','PENDING',drugRegID));
                            //Found it
                            var _request_qty = parseInt(_smsSyntax[2]),
                                _druginfo = data[0];

                            //Step 0: Select HF drug
                            db.collection('hfdrugs').update(
                                {"_id": _druginfo._id},
                                {$set: { "drug_abs": _request_qty }},
                                {upsert: false}, function(update_err,update_data){
                    if(update_err){
                        //Can't update
                    }else{
                       //After update ABS
                        var _top_stock_mobile = _druginfo.hf_detail.reporting_center.person_mobile;
                        var _hf_stock_mobile = _druginfo.hf_detail.person_mobile;

                        if(_request_qty <= parseInt(_druginfo.drug_eop)){
                        //General task
                        _task_register.push(create_task(_druginfo.hf_detail.name+' has low stock of '+_druginfo.drug_code,_top_stock_mobile,'sms_out','PENDING',drugRegID));
                        _task_register.push(create_task('Register Succeed! DRUG CODE: '+_smsSyntax[1].toUpperCase()+', QTY: '+_smsSyntax[2]+'. Your balance stock is less than EOP ('+_druginfo.drug_eop+') level.',_hf_stock_mobile,'sms_out','PENDING',drugRegID));
                    }else if(parseInt(_druginfo.drug_asl) > _request_qty && _request_qty > parseInt(_druginfo.drug_eop)){
                        _task_register.push(create_task('Register Succeed! DRUG CODE: '+_smsSyntax[1].toUpperCase()+', QTY: '+_smsSyntax[2]+'. Please request drug in quarterly request.',_hf_stock_mobile,'sms_out','PENDING',drugRegID));
                    }else if(_request_qty > parseInt(_druginfo.drug_asl)){
                        _task_register.push(create_task('Register Succeed! DRUG CODE: '+_smsSyntax[1].toUpperCase()+', QTY: '+_smsSyntax[2]+'. You have sufficient stock.',_hf_stock_mobile,'PENDING',drugRegID));
                    }
                    }
                                }
                            )

                            // _msgTasks ={
                            //     "id": _transCode,
                            //     "to": eachDB.from,
                            //     "type": "success",
                            //     "content": "Register Succeed! DRUG CODE: "+_smsSyntax[1]+", QTY: "+_smsSyntax[2]
                            // };

                        }else{
                            //Not foundddddddd
                            _msgTasks ={
                                "id": _transCode,
                                "to": eachDB.from,
                                "type": "reject",
                                "content": "Drug not found! Please check your DRUG CODE: "+_smsSyntax[1].toUpperCase()
                            };
                            _task_register.push(create_task("Drug not found! Please check your DRUG CODE: "+_smsSyntax[1].toUpperCase()+", QTY: "+_smsSyntax[2],eachDB.from,'sms_default','PENDING',drugRegID));

                        }



                        _responseMSG.push(_msgTasks);

                        // setTimeout(function(){
                        //     db.collection('drugregisters').insert(_xdata).then(function(rs){
                        //         console.log('Inserted to Drugregister collection!');
                        //     });
                        //
                        // },100)
                    }

                });


            });
            }else{

                var response_msg = {
                    "id": uuidV1(),
                    "to": eachDB.from,
                    "type": "sms_out",
                    "content": "The registration format is incorrect, ensure the message starts with R followed by space and DrugCode, space and DrugQuantity (Ex: R OXI 33)"
                };

                _responseMSG.push(response_msg); //Push to schedule task

                db.collection('messages').insert(eachDB).then(function(rs){
                    console.log('Inserted to messages collection!');
                });
            }
        })

              //Check status
                var _statusGateway = req.body.updates;
                //Check and update status
                if(_statusGateway){
                    _statusGateway.forEach(function(each_rs){
                        console.log('loop status',each_rs);
                        updateSMSStatus(each_rs)
                    })
                }

                setTimeout(()=>{
                    db.collection('messages_outs').find({"state": "PENDING"}).toArray(function(error, data) {
                        if (error == null) {
                            var _pendingMSG = [];
                            data.forEach(function(each_msg){
                                if(each_msg.state == 'pending' || each_msg.state == 'PENDING'){
                                    _pendingMSG.push({
                                        "id": each_msg.id,
                                        "to": each_msg.to,
                                        "content": each_msg.content
                                    });
                                }
                            })
                            res.json({messages: _pendingMSG});
                        }else{
                            res.json({messages: []});
                        }
                    })
                },500);
        }
});

resetDatastore();


function resetDatastore() {
  datastore = {
    requests: [],
    webapp_terminating: [],
    webapp_originating: {
      waiting: [],
      passed_to_gateway: [],
    },
    status_updates: [],
    errors: [],
  };
}
//
function updateSMSStatus(result){
    db.collection("messages_outs").update(
        {"id": result.id},
        {$push: {"history": {"state": result.status, "reason": result.reason, "timestamp": new Date()}}}
    )
    db.collection("messages_outs").update(
        {"id": result.id},
        {$set: {"state": result.status}}
    )

}

function checkInResults(arr,id){
    return arr.filter(function(echeck){ return echeck.id == id});
}
function create_task(content,send_to,type,state,register_id){
    var sms_out = {
        "id": uuidV1(),
        "to": send_to,
        "register_id": register_id,
        "type": type,
        "state": state,
        "content": content,
        "history": []
    }

    db.collection('messages_outs').insert(sms_out).then(function(err, data){
        if(err == null) return true;
    });
}

function handleAuth(req, res, options) {
  var error, header;

  if(!options) return true;

  try {
    header = req.headers.authorization;
    header = header.split(' ').pop();
    header = new Buffer(header, 'base64').toString().split(':');

    if(header[0] === options.username &&
        header[1] === options.password) {
      return true;
    }
    error = 'username or password did not match';
  } catch(e) {
    error = e;
  }
  console.log('Auth failed:', error);
  console.log('headers:', req.headers);
  res.writeHead(401);
  res.end(JSON.stringify({ err:'Unauthorized' }, null, 2));
  return false;
}


}