module.exports = function(app,db,SMSCheck){
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
        _dataDB.forEach(function(eachDB){
            //update View
            if(SMSCheck.validSmsSyntax(eachDB.content) == true){
                var _smsSyntax = eachDB.content.split(' '),
                    _transCode = makeRandID();
                _responseMSG.push({
                    "id": _transCode,
                    "to": eachDB.from,
                    "content": "Request accepted! DRUG CODE: "+_smsSyntax[1]+", QTY: "+_smsSyntax[2]+". Trans code: "+_transCode
                });

                var _xdata = {
                    "from" : eachDB.from,
                    "form" : "R",
                    "reported_date" : 1496392521022.0,
                    "sms_message" : {
                        "form" : "R",
                        "type" : "sms_message",
                        "gateway_ref" : "e6f0bb62-de84-4d67-b282-1dd670a487ac",
                        "from" : eachDB.from,
                        "message" : eachDB.content
                    },
                    "tasks" : [
                        {
                            "state" : "sent",
                            "timestamp" : "2017-06-02T08:35:24.283Z",
                            "state_history" : [
                                {
                                    "timestamp" : "2017-06-02T08:35:22.434Z",
                                    "state" : "pending"
                                },
                                {
                                    "timestamp" : "2017-06-02T08:35:24.283Z",
                                    "state" : "sent"
                                }
                            ],
                            "messages" : [
                                {
                                    "to" : eachDB.from,
                                    "uuid" : "81a29f6c-089e-4441-bf93-c829648bf410",
                                    "message" : "Request accepted! DRUG CODE: "+_smsSyntax[1]+", QTY: "+_smsSyntax[2]+". Trans code: "+_transCode
                                }
                            ]
                        }
                    ]
                }

                db.collection('drugregisters').insert(_xdata).then(function(rs){
                    console.log('Inserted to Drugregister collection!');
                });



            }else{

                _responseMSG.push({
                    "id": makeRandID(),
                    "to": eachDB.from,
                    "content": "The registration format is incorrect, ensure the message starts with R followed by space and DrugCode, space and DrugQuantity (Ex: R 1 33)"
                });

                db.collection('messages').insert(eachDB).then(function(rs){
                    console.log('Inserted to messages collection!');
                });

            }

        })


        setTimeout(()=>{
            res.json({messages: _responseMSG});
          },100);

        function makeRandID(){
            return Math.floor(Math.random()*9999) + 1;
          }

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

function readBody(req) {
  var body = '';
  return new Promise(function(resolve, reject) {
    req.on('data', function(data) {
      body += data.toString();
    });
    req.on('end', function() {
      resolve(body);
    });
    req.on('error', reject);
  });
}

function push(arr, vals) {
  arr.push.apply(arr, vals);
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