
const express = require('express')
const createClient = require('@supabase/supabase-js')
const {calender} = require('./calender')
const http = require('http');
const { Server } = require('socket.io'); // Add this

const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app); 
const cors = require('cors');
const bodyParser = require('body-parser');
const { sheetsBrand, sheetsCreator, sheetsExpenses } = require('./sheets');
const { ChatRoom } = require('./chatRoom');
const { driveUpload } = require('./drive');
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
    res.sendStatus(200);
    } else {
    next();
    }
    };
    
    app.use(allowCrossDomain);

    const supabase = createClient.createClient("https://mvltjxmobyonlfrhfvkf.supabase.co", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12bHRqeG1vYnlvbmxmcmhmdmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIwODEwMjAsImV4cCI6MjAyNzY1NzAyMH0.E610vgZ-NEG6da51KnWzW5ePeus9mXkXn48fwLhVZLk');

app.post('/score_upload', async (req, res)=> {
  
  console.log(req.body);
  const body = req.body;

  try {
    sheetsCreator([body.subject, body.target, body.IA1, body.IA2, body.SEE])
  } catch (error) {
    console.log(error);
  res.status(500).json('failure');
  }
  const { data, error } = await supabase
  .from('Score_Tracker')
  .insert([{subject: body.subject, target: body.target, IA1: body.IA1, IA2:body.IA2, SEE:body.SEE} ])
  .select()
          
if (error){
  console.log(error);
  res.status(500).json('failure');
} else {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.status(200).json('success');
}

} )


app.post('/expenses_upload', async (req, res)=> {
  
  console.log(req.body);
  const body = req.body;
  
let { data: expenses, error } = await supabase
.from('expenses')
.select('*')
.order('id', { ascending: false })
.limit(1)

const { data} = await supabase
  .from('expenses')
  .insert([{description: body.description, amount: body.amount , balance: body.nature === "credit"? expenses[0].balance + Number.parseInt(body.amount): expenses[0].balance- Number.parseInt(body.amount)} ])
  .select()
sheetsExpenses([body.description, body.amount , body.nature === "credit"? expenses[0].balance +  Number.parseInt(body.amount) : expenses[0].balance- Number.parseInt(body.amount)])   
if (error){
  console.log(error);
  res.status(500).json('failure');
} 
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.status(200).json('success');
})

app.post('/attendance_upload', async (req, res)=> {
  
  console.log(req.body);
  const body = req.body;
  
let { data: attendance, error } = await supabase
.from('attendance')
.select('*')
.eq('course', body.course);
console.log(attendance);


const { data} = await supabase
  .from('attendance')
  .update([{done: attendance[0].done+ Number.parseInt(body.classesDone), attended: attendance[0].attended+ Number.parseInt(body.classesAttended), percentage:((attendance[0].attended+ Number.parseInt(body.classesAttended))/(attendance[0].done+ Number.parseInt(body.classesDone)))*100 , lastUpdated: new Date()} ])
  .eq('course', body.course)
/*
sheetsExpenses([body.description, body.amount , body.nature === "credit"? expenses[0].balance +  Number.parseInt(body.amount) : expenses[0].balance- Number.parseInt(body.amount)])  
*/ 
if (error){
  console.log(error);
  res.status(500).json('failure');
} 
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.status(200).json('success');
})

app.post('/calenderEvent', async (req, res)=> {
  
  console.log(req.body);
  const body = req.body;
  calender(body);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.status(200).json('success');
})

app.post('/chat_auth', async (req, res)=> {
  
  console.log(req.body);
  const body = req.body;
  let { data: rooms, error } = await supabase
.from('chatRooms')
.select('*')
.eq('email', body.email);
console.log(rooms);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.status(200).json(rooms[0].rooms.split(','));
})

/*
const CHAT_BOT = 'ChatBot';

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
let chatRoom = '';
let allUsers = []; 

io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);
  socket.on('join_room', (data) => {
      const {room} = data; 
      console.log(data);

      socket.join(room.room); 

  let __createdtime__ = Date.now(); 
  
  socket.emit('receive_message', {
    message: `Welcome ${username}`,
    username: CHAT_BOT,
    __createdtime__,
  }); 
  socket.emit('receive_message', 'welcome');
  socket.on('message', (data)=> {

const { data:msg, error } =  supabase
.from('chatRoom-1')
.insert([
  { user: data.user, message: data.message, time: data.time },
])
.select()
        
  })
});

});
server.listen(4000, () => 'Server is running on port 3000');
*/

app.get('/driveFiles', async (req, res)=> {
  
  driveUpload();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.status(200).json(result);
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`); 
    });

