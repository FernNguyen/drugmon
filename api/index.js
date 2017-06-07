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
            if(datastore.errors.length) {
              throw new Error(datastore.errors.shift());
            }

        
        var _dataDB = req.body.messages;
        var _responseMSG = [];
        _dataDB.forEach(function(eachDB){
            //update View
            eachDB.doc_type = 'messages';
            db.collection('messages').insert(eachDB).then(function(rs){
                console.log('inserted');
                if(SMSCheck.validSmsSyntax(eachDB.content) == true){
                    console.log('CHECK SYNTAXXXXX');
                    var _smsSyntax = eachDB.content.split(' ');
                    _responseMSG.push({
                        "id": makeRandID(),
                        "to": eachDB.from,
                        "content": "Thank you for registering! Drug code: "+_smsSyntax[1]+", qtt: "+_smsSyntax[2]
                    })
                }else{
                    _responseMSG.push({
                        "id": makeRandID(),
                        "to": eachDB.from,
                        "content": "The registration format is incorrect, ensure the message starts with R followed by space and DrugCode, space and DrugQuantity (Ex: R 1 33)"
                    })
                }
            }).catch((err)=>{
                console.log(err);
            });
        })
        setTimeout(()=>{
            console.log('LIST',_responseMSG);
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