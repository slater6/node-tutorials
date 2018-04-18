const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

mongo.connect('mongodb://<dbuser>:<password>@ds259085.mlab.com:59085/chat-app', function(err,db){
    if(err){
        throw err;
    }

    client.on('connection',function(socket){
        let chat = db.collection('chats');

        sendStatus = function(s){
            socket.emit('status',s);
        }

        chat.find().limit(100).sort({_id:1}).toArray(function(err,res){
            if(err){
                throw err;
            }

            socket.emit('output', res);
        });

        socket.on('input', function(data){
            let name = data.name;
            let message = data.message;
            
            if(name == '' || message == ''){
                sendStatus({
                    message : 'Please enter a name and message',
                    clear : false
                });
                return;
            }

            chat.insert({
                name:name,
                message:message
            }, function(){
                client.emit('output',[data]);

                sendStatus({
                    message: 'Message Sent',
                    clear: true
                })
            })

        })

        socket.on('clear', function(data){
            chat.remove({},function(){
                socket.emit('cleared');
            })
        })
    });

    console.log('Mongo DB Connected')
})

