require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const product = require("./models/products");
const query = require("./models/query");
const about = require("./models/about");
const abtimg = require("./models/abtimg");
const mobdata = require("./models/mobwebdata");
const pcdata = require("./models/pcwebdata");
const order = require("./models/order");
const blogs = require("./models/blogs");
const catchAsync = require('./utils/catchAsync');
const ExpressError = require("./utils/ExpressError");
var nodemailer = require('nodemailer');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session  = require('express-session');
const User  = require('./models/user');
const flash = require('connect-flash');
const cart = require('./models/cart');
const itemdelete = require('./utils/orderdelete');
const fs = require('fs');


app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));



const sessionConfig = {
    secret:'holllla',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        log:Number,
        user:Number,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig));

app.use(flash());
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'));

app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/hackathon')
    .then(()=>{
        console.log("CONNECTED to DB");
    })
    .catch(err=>{
        console.log("ERROR");
    })
 
const port = process.env.PORT || 3001;    
app.listen(port,()=>{
        console.log("Serving on 3001")
    });


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: ''
        }
      });



app.get("/",catchAsync(async(req,res)=>{
    




    if(req.session.log!=1){
        req.session.log = 0;
        const status = req.session.log;
    console.log(req.session);

        res.render('home',{status});
    }else{
        const idd = req.session.user;
        console.log(req.session);
        const status = req.session.log;
        const t = await User.findOne({number:idd});
        const prod = await product.find({user:t._id});
        console.log(prod);
        console.log(t);
        res.render('home',{t,status,prod});
    }


}));

app.get("/signup",(req,res)=>{
    res.render('signup');
});

app.get("/signin",(req,res)=>{
    res.render('signin');
});

app.get("/products",catchAsync(async(req,res)=>{
        const idd = req.session.user;
        console.log(req.session);
        const status = req.session.log;
        const t = await User.findOne({number:idd});
        const prod = await product.find({user:t._id});
        res.render('products',{prod});
}));

app.get("/orders",catchAsync(async(req,res)=>{
    const n = req.session.user;
    console.log("************");
    const dealer = await User.findOne({ number: n});
    // console.log(dealer._id);
    var pp = await product.find({user : dealer._id});
    var fp = [];
    for(var i=0;i<pp.length;i++){
        const l = pp[i]._id;
        // console.log("PROD ID");
        // console.log(l);
        var z = await order.find({product_id:l});
        // console.log(z);
        for(var j=0;j<z.length;j++){
            // console.log("//////////////////////");
            // console.log(z[j]);
            fp.push(z[j]);
        }
    }
    console.log("|||||||||||||||||||||||00");
    console.log(fp);
    res.render('orders',{fp});
}));


app.get("/flipkart",catchAsync(async(req,res)=>{
    const n = req.session.user;
    console.log("************");
    const dealer = await User.findOne({ number: n});
    // console.log(dealer._id);
    var pp = await product.find({user : dealer._id});
    var fp = [];
    for(var i=0;i<pp.length;i++){
        const l = pp[i]._id;
        console.log("PROD ID");
        console.log(l);
        var z = await order.find({product_id:l});
        console.log(z[0]);
        console.log("//////////////////////");

        for(var j=0;j<z.length;j++){
            if(z[j].website==='flipkart'){
            fp.push(z[j]);
            }
            // console.log(z[j]);
        }
    }
    console.log(fp);
    var poan = new Map();
    for(var i=0;i<fp.length;i++){
        var p = poan.get(fp[i].product_id)*1;
        if(p){
            poan.set(fp[i].product_id,(fp[i].quantity*1)+p);
        }else{
            poan.set(fp[i].product_id,fp[i].quantity*1);
        }
    }
    function fpobj(number,id){
        this.id=id;
        this.number=number
    };
    var finalfp=[];
    poan.forEach((value,key)=>{
        var t2 = new fpobj(value,key);
        finalfp.push(t2);
    })
    // console.log(finalfp);
    res.render("flipkart",{finalfp});
    
}));


app.get("/amazon",catchAsync(async(req,res)=>{
    const n = req.session.user;
    console.log("************");
    const dealer = await User.findOne({ number: n});
    // console.log(dealer._id);
    var pp = await product.find({user : dealer._id});
    var fp = [];
    for(var i=0;i<pp.length;i++){
        const l = pp[i]._id;
        console.log("PROD ID");
        console.log(l);
        var z = await order.find({product_id:l});
        console.log(z[0]);
        console.log("//////////////////////");

        for(var j=0;j<z.length;j++){
            if(z[j].website==='amazon'){
            fp.push(z[j]);
            }
            // console.log(z[j]);
        }
    }
    console.log(fp);
    var poan = new Map();
    for(var i=0;i<fp.length;i++){
        var p = poan.get(fp[i].product_id)*1;
        if(p){
            poan.set(fp[i].product_id,(fp[i].quantity*1)+p);
        }else{
            poan.set(fp[i].product_id,fp[i].quantity*1);
        }
    }
    function fpobj(number,id){
        this.id=id;
        this.number=number
    };
    var finalfp=[];
    poan.forEach((value,key)=>{
        var t2 = new fpobj(value,key);
        finalfp.push(t2);
    })
    // console.log(finalfp);
    res.render("amazon",{finalfp});
    
}));
app.get('/analyze',catchAsync(async(req,res)=>{

    const n = req.session.user;
    console.log("************");
    const dealer = await User.findOne({ number: n});
    // console.log(dealer._id);
    var pp = await product.find({user : dealer._id});
    var fp = [];
    for(var i=0;i<pp.length;i++){
        const l = pp[i]._id;
        console.log("PROD ID");
        console.log(l);
        var z = await order.find({product_id:l});
        console.log(z[0]);
        console.log("//////////////////////");
        var fc=0;
        var ac=0;
        var mc=0;

        for(var j=0;j<z.length;j++){
            if(z[j].website==='amazon'){
            ac++;
            }else if(z[j].website==='flipkart'){
                fc++;
            }else{
                mc++;
            }
            // console.log(z[j]);
        }
    }
    console.log(mc,ac,fc);
    for(var i=0;i<fp.length;i++){
        var p = poan.get(fp[i].product_id)*1;
        if(p){
            poan.set(fp[i].product_id,(fp[i].quantity*1)+p);
        }else{
            poan.set(fp[i].product_id,fp[i].quantity*1);
        }
    }



    res.render('analytics');
}));

app.get("/myntra",catchAsync(async(req,res)=>{
    const n = req.session.user;
    console.log("************");
    const dealer = await User.findOne({ number: n});
    // console.log(dealer._id);
    var pp = await product.find({user : dealer._id});
    var fp = [];
    for(var i=0;i<pp.length;i++){
        const l = pp[i]._id;
        console.log("PROD ID");
        console.log(l);
        var z = await order.find({product_id:l});
        console.log(z[0]);
        console.log("//////////////////////");

        for(var j=0;j<z.length;j++){
            if(z[j].website==='shopclues'){
            fp.push(z[j]);
            }
            // console.log(z[j]);
        }
    }
    console.log(fp);
    var poan = new Map();
    for(var i=0;i<fp.length;i++){
        var p = poan.get(fp[i].product_id)*1;
        if(p){
            poan.set(fp[i].product_id,(fp[i].quantity*1)+p);
        }else{
            poan.set(fp[i].product_id,fp[i].quantity*1);
        }
    }
    function fpobj(number,id){
        this.id=id;
        this.number=number
    };
    var finalfp=[];
    poan.forEach((value,key)=>{
        var t2 = new fpobj(value,key);
        finalfp.push(t2);
    })
    // console.log(finalfp);
    res.render("myntra",{finalfp});
    
}));



app.post("/signin",catchAsync(async(req,res)=>{
    const t = req.body.user;
    var z = new product();
    const dealer = await User.findOne({ number: t.number});
    const pp = await product.find({});
    // console.log(dealer.pass);
    // res.send(pp);
    // console.log(t.pass);
    if(dealer.pass == t.pass){
        req.session.log=1;
        req.session.user=dealer.number*1;
        console.log(req.session);

        res.redirect("/");
    }
    else{
        console.log(req.session);
    
        res.send("Wrong");
    }

}));
app.post("/signup",catchAsync(async(req,res)=>{
    const us = new User(req.body.product);
    await us.save();
    console.log(us);
    res.send("DOne");
}));








//     app.get('/',async (req,res)=>{

       
//     const abt = await about.find({});
//     const abtsize=abt.length;
//     const myimg = await abtimg.findOne({});
//     const place = 'home';
//     const pcbg= await pcdata.findOne({});
//     const mobbg = await mobdata.findOne({});
//     console.log(mobbg);
//     const num = req.session.num;
//     const paintings = await product.find({}).limit(1);
//     const a = await blogs.find().sort({$natural:-1}).limit(1);
  
//     console.log(req.session);
//     res.render('home',{paintings,a,num,place,mobbg,pcbg,abt,abtsize,myimg});
// })    
// app.get('/adminlogin0153130269',(req,res)=>{
//     res.render('login');
// })
// app.post('/adminlogin',(req,res)=>{
//     const pass = req.body.pass;
//     req.session.admin=pass;
//     // res.send(req.session.admin);
//     res.redirect("/admin");
// })
// app.get('/showcase',async (req,res)=>{
//     const place = 'showcase';
//     const num = req.session.num;
//     const paintings = await product.find({}).sort({$natural:-1});
//     console.log(paintings);
//     res.render('showcase',{paintings,num,place});
// })    

// app.get('/order/delivery',async (req,res)=>{
//     const place = 'showcase';
//     const currency=req.session.currency;
//     const num = req.session.num;
//     const paintings = req.session.items;
//     console.log(paintings);
//     const total = req.session.total;
//     // console.log(total);
//     res.render('delivery',{num,place,paintings,total,currency});
// })
// app.get('/showblog/:id/',async (req,res)=>{
//     const place = 'blog';    
//     const num = req.session.num;
//     const curblog = await blogs.findById(req.params.id);
//     res.render('singleblog',{num,place,curblog});

// })    
// app.get('/vieworder',async (req,res)=>{
//     const place = 'order';    
//     const num = req.session.num;
    
//     res.render('orderplaced',{num,place});

// })    







// app.get('/blog',async (req,res)=>{
//     const place = 'blog';
//     var b;
//     const size = await blogs.count({});
//     const allblog = await blogs.find({}).sort({$natural:-1});
//     const pages = Math.ceil(size/4);
//     var pageblog=Array;
//     for(let i=0,j=0;i<=size;i+=4,j++){
//         pageblog[j]=allblog[i];
//     }
//     // const t1=await blogs.find({}).limit(5).sort({$natural:-1}).then(r =>  r);
//     // const t2=t1.length;
//     // const b = await blogs.find({}).sort('-date');
//     b =  await blogs.find({}).limit(4).sort({$natural:-1}).then(r =>  r);
    
//     const num = req.session.num;
//     const curpage=1;
    
//     // res.send(b);
//     res.render('blog',{b,num,place,curpage,size});

// })    




// app.get('/blog/:id/',async (req,res)=>{
//     const place = 'admin';
//     const num = req.session.num;
//     const curblog = await blogs.findById(req.params.id);
//     var b;
//     var t4;
//     blogs.find({_id: {$lt: curblog._id}},function(error,result){
//         t4=result;
//     }).sort({$natural:-1});
    
//     const size = await blogs.count({});
//     blogs.find({_id: {$lt: curblog._id}},function(error,result){
//         b = result; 
//         const pages = Math.ceil(size/4);
//         if(pages%4==0){
//             var curpage=(pages-Math.floor((t4.length)/4))+1;
//         }else{
//             var curpage=(pages-Math.floor((t4.length)/4));
//         }
//         // const curpage=2;
//         blogs.find({_id: {$gt: curblog._id}},function(error,result){
//             const t=result;
//             const prevblog=t[3];
//             const bsize=b.length;
//             // console.log(t4);
//             // console.log("*******");
//             console.log(t);
//             // res.send("AAA");
//             res.render("showblog",{b,num,place,bsize,prevblog,size,curpage,pages});
//         }).limit(4);
//     }).limit(4).sort({$natural:-1});
   
// })    







// app.get('/admin',async(req,res)=>{
    
//     const place = 'admin';
//     const neworders = await order.find({status:1});
//     const size = neworders.length;
//     const num = req.session.num;
//     if(req.session.admin==""){
//         res.render('admin',{place,num,size});
//     }else{
//         res.send("WRONG PASS TRY AGAIN!");
//     }
// }) 

// app.get('/admin/about',async(req,res)=>{
    
//     const place = 'admin';
//     const num = req.session.num;
   
//     if(req.session.admin==""){
//         res.render('adminabout',{place,num});
//     }else{
//         res.send("WRONG PASS TRY AGAIN!");

//     }
// }) 


// app.get('/admin/addblog',(req,res)=>{
//     const place = 'admin';
//     const num = req.session.num;
//     if(req.session.admin==""){
//         res.render('addblog',{place,num});
//     }else{
//         res.send("WRONG PASS TRY AGAIN!");
//     }
// })  


// app.get('/admin/pcbg',(req,res)=>{
//     const place = 'admin';
//     const num = req.session.num;
//     if(req.session.admin==""){
//         res.render('pcbg',{place,num});
//     }else{
//         res.send("WRONG PASS TRY AGAIN!");
//     }
// })  

// app.get('/admin/mobbg',(req,res)=>{
//     const place = 'admin';
//     const num = req.session.num;
//     if(req.session.admin==""){
//         res.render('mobbg',{place,num});
//     }else{
//         res.send("WRONG PASS TRY AGAIN!");
//     }
// })  
// app.get('/admin/addpainting',(req,res)=>{
//     const num = req.session.num;

//     const place = 'admin';
//     if(req.session.admin==""){
//         res.render('addpainting',{place,num});
//     }else{
//         res.send("WRONG PASS TRY AGAIN!");
//     }
// })  
// app.get('/admin/deleteblog',(req,res)=>{
//     const place = 'admin';
//     const num = req.session.num;
//     if(req.session.admin==""){
//         res.render('deleteblog',{place,num});
//     }else{
//         res.send("WRONG PASS TRY AGAIN!");
//     }

// })  



// app.get('/showcase/:id/',async (req,res)=>{

//     console.log("**************");
//     const num = req.session.num;
//     const place = 'showcase';
//     const painting = await product.findById(req.params.id);
//     var same =  0;
//     for(var i=0; i < req.session.num;i++){


//         if(req.session.num<2){
//             if((req.params.id)==(req.session.items._id)){
//                 if(req.session.items.original!=0){
//                      painting.original=req.session.items.original;

//                 }
//                 if(req.session.items.prints!=0){
//                     painting.prints=req.session.items.prints;

//                 }

//                 same=1;
               
//             }
//         }
//         else{
//             if((req.params.id)==(req.session.items[i]._id)){
//                 if(req.session.items[i].original!=0){
//                     painting.original=req.session.items[i].original;

//                }
//                if(req.session.items.prints!=0){
//                    painting.prints=req.session.items[i].prints;

//                }
//                 same=1;
                
//             }
//         }

//         // if(req.params.id == req.session.items[i]){
//         //     console.log("");
//         // }
//     }

    
//     console.log(painting);
//     res.render('show',{painting,num,place,same});

// })

// app.get('/admin/orders',async (req,res)=>{
  
//     const place = 'order';

//     const num = req.session.num;
//     const neworders = await order.find({status:1});
//     const completedorders = await order.find({status:0}).sort({$natural:-1});
//     const pendingorders = await order.find({status:2});

//     // res.send(neworders);
//     if(req.session.admin==""){
//         res.render('adminorder',{num,place,neworders,completedorders,pendingorders});
//     }else{
//         res.send("WRONG PASS TRY AGAIN!");
//     }

// })





// app.get('/order',async (req,res)=>{
  
//     const total = req.session.total;
//     const currency = req.session.currency;
//     const place = 'order';
//     console.log(currency);
//     const order = req.session.items;
//     const num = req.session.num;
 
//     // res.send("order")
//     // console.log(req.session.items);
//     res.render('order',{order,num,place,total,currency});

// })
// app.get('/order/confirm/:id',async (req,res)=>{
  
//     const place = 'order';
//     const corder = await order.findById(req.params.id);
//     const num = req.session.num; 
//     console.log(corder);
//     const size=corder.title.length;
//     res.render('completedorder',{size,num,place,corder});

// })
// app.get('/admin/deletepainting',async (req,res)=>{
  
//     const place = 'order';
//     // const corder = await order.findById(req.params.id);
//     const num = req.session.num; 
//     const p = await product.find({});
//     // console.log(corder);
//     // const size=corder.title.length;
//     console.log(p);
//     if(req.session.admin==""){
//         res.render('deletepainting',{num,place,p});
//     }else{
//         res.send("WRONG PASS TRY AGAIN!");
//     }

// })
// app.get('/admin/query',async (req,res)=>{
  
//     const place = 'order';
//     const num = req.session.num; 
//     const q = await query.find({});
//     const size=q.length;
//     console.log(q);
//     if(req.session.admin==""){
//         // res.send("AAA");
//         res.render('adminqueries',{num,place,q,size});
//     }else{
//         res.send("WRONG PASS TRY AGAIN!");
//     }

// })




// app.get('/vieworder/:number',async (req,res)=>{
//     const mobnumber = req.params.number;
//     // const painting = await product.findById(req.params.id);
//     console.log("*****");
//     const orders = await order.find({number:mobnumber});
//     console.log(orders);
//     const place = 'order';
//     const num = req.session.num; 
//     const size = orders.length;
//     console.log(size);
//     // res.send("DONE");
//     if(size==1){
//         const id = orders[0]._id;
//         res.redirect("/order/confirm/"+id)
//     }
//     else{
//         res.render('viewallorders',{num,place,orders,size});
//     }
// })
// app.post('/pcbg',async (req,res)=>{
//     const bg = req.body.backg;
//     const dbg = await pcdata.find({});
//     await dbg[0].remove({});
//     const fbg = new pcdata(bg);
//     await fbg.save();
//     res.redirect("/");

// });



// app.post('/mobbg',async (req,res)=>{
//     const bg = req.body.backg;
//     const dbg = await mobdata.find({});
//     await dbg[0].remove({});
//     const fbg = new mobdata(bg);
//     await fbg.save();
//     res.redirect("/");

// });


// app.post('/admin/searchorder',async (req,res)=>{
//     const n = req.body.name;
//     const ord = await order.find({name:n});
//     const mob = ord[0].number;
//     const size = ord.length;
//     if(size>1){
//         res.redirect("/vieworder/"+mob);
//     }else{
//         res.redirect("/order/confirm/"+ord[0]._id);
//     }
// });


// app.post('/addabout',async(req,res)=>{
//     const p = req.body.para;
//     const pp = new about();
//     pp.para=p;
//     console.log(pp);
//     await pp.save();
//     res.redirect("/");
// });

// app.post('/deletequery',async(req,res)=>{
//     const p = req.body.id;
//     const q = await query.findOne({_id:p});
//     await q.remove();
//     res.redirect("/admin/query");
// });

// app.post('/addimg',async(req,res)=>{
//     const im = req.body.img;
//     const pp = new abtimg();
//     pp.img=im;
//     const t = await abtimg.find({});
//     await t[0].remove();
//     console.log(pp);
//     await pp.save();
//     res.redirect("/");
// });

// app.post('/adminqueries',async(req,res)=>{
//     const q = req.body.query;
//     const t = new query(q);
//     await t.save();
//     res.redirect("/");
// });





// app.post('/admin/view',(req,res)=>{
//     const id = req.body.id;

//     res.redirect("/order/confirm/"+id);
// });

// app.post('/admin/orderstatus',async(req,res)=>{
//     const id = req.body.id;
//     const ord = await order.findOne({_id:id});
//     var ford = new order();
//     ford.title=ord.title;
//     ford.name=ord.name;
//     ford.number=ord.number;
//     ford.mail=ord.mail;
//     ford.total=ord.total;
//     ford.price=ord.price;
//     ford.date=ord.date;
//     ford.original=ord.original;
//     ford.prints=ord.prints;
//     ford._id=ord._id;
//     ford.address=ord.address;
//     ford.status=0;

   
//     // ford.status=0;
//     console.log(ord);
//     console.log("*********");
//     console.log(ford);
    
//     await ord.remove();
//     await ford.save();
//     res.redirect("/admin/orders");
// });

// app.post('/admin/orderstatuspending',async(req,res)=>{
//     const id = req.body.id;
//     const ord = await order.findOne({_id:id});
//     var ford = new order();
//     ford.title=ord.title;
//     ford.name=ord.name;
//     ford.number=ord.number;
//     ford.mail=ord.mail;
//     ford.total=ord.total;
//     ford.price=ord.price;
//     ford.date=ord.date;
//     ford.original=ord.original;
//     ford.prints=ord.prints;
//     ford._id=ord._id;
//     ford.address=ord.address;
//     ford.status=2;

   
//     // ford.status=0;
//     console.log(ord);
//     console.log("*********");
//     console.log(ford);
    
//     await ord.remove();
//     await ford.save();
//     res.redirect("/admin/orders");
// });





// app.post('/order/emptycart/',(req,res)=>{
//     req.session.items=Array;
//     req.session.num=0;
//     req.session.total=0;

//     res.redirect("/order");
// });


// app.post('/blog/delete',async(req,res)=>{
//     const sdate = req.body.date;
//     var m =sdate.slice(5,7);
//     const d = sdate.slice(8,10);
//     const y = sdate.slice(0,4);
//     if(m==01){
//         m="Jan";
//     }if(m==02){
//         m="Feb";
//     }if(m==03){
//         m="Mar";
//     }if(m==04){
//         m="Apr";
//     }if(m==05){
//         m="May";
//     }if(m==06){
//         m="Jun";
//     }if(m==07){
//         m="Jul";
//     }if(m==08){
//         m="Aug";
//     }if(m==09){
//         m="Sep";
//     }if(m==10){
//         m="Oct";
//     }if(m==11){
//         m="Nov";
//     }
//     if(m==12){
//         m="Dec";
//     }
//     const date = m+ " "+ d+" "+y;
//     console.log(date);
//     const blog = await blogs.find({date:date});
//     console.log(blog);
//     const size = blog.length;
//     const place  = 'blogs';
//     const num = req.session.num;
//     res.render('deletebloglist',{place,num,blog,size});

// });

// app.post('/painting/delete',async (req,res)=>{
//     const name = req.body.name;    
//     const painting = await product.find({_id:name});
//     const size = painting.length;
//     console.log("***********");
//     console.log(painting);
//     if(size==1){
//         await painting[0].remove();
//     }
//     // res.send(painting);
//     res.redirect("/showcase");
// })









// app.post('/order/delivery',async (req,res)=>{
//     const data = req.body;
//     // const painting = await product.findById(req.params.id);
    
//     const painting = await product.findById(req.params.id);
    
//     // const arr = req.body;
//     console.log("****************************");

//     // console.log(arr.painting.id[0]);
//     res.redirect("/order/delivery");
// })

// app.post('/searchorder',async (req,res)=>{
//     const mobnumber = req.body.number;
//     // const painting = await product.findById(req.params.id);
    
//     const orders = await order.find({number:mobnumber});
    
//     // const arr = req.body;
//     console.log("****************************");
//     console.log(orders);
//     // console.log(arr.painting.id[0]);
//     res.redirect("/vieworder/"+mobnumber);
// })
// app.post('/deleteblog/:id',async (req,res)=>{
//     const bid = req.params.id;
//     // const painting = await product.findById(req.params.id);
    
//     const b = await blogs.find({_id:bid});
//     console.log(b)
//     await b[0].remove();
    
//     // const arr = req.body;
//     console.log("****************************");
//     // console.log(arr.painting.id[0]);
//     res.redirect("/admin/deleteblog");
//     // res.send("AA");
// })








// app.post('/added/:id/',async (req,res)=>{
//     const painting = await product.findById(req.params.id);
//     // console.log(req.body);
//     const amt = req.body.amt;
//     if(!req.session.total){
//         req.session.total=0;
//     }
//     const currency=req.body.currency;
//     req.session.currency=req.body.currency;
//     console.log(currency);
//     var pay;
//     if(currency==1){
//          pay = (amt*painting.pricec);

//     }else{
//          pay = (amt*painting.dolpricec);

//     }
//     // const pay = (amt*painting.pricec);

//     const temp2=req.session.total+pay;
//     req.session.total=temp2;
//     console.log(req.session.total);
//     painting.prints=amt;
//     const num = parseInt(req.body.num)+parseInt(req.session.num);
//     var temp = JSON.stringify(req.session.items);
//     var t2 =[];
//     if(req.session.num>1){
//         temp = temp.slice(1,-1);
//     }
//     for(var i=0; i <= num;i++){
//         console.log("YUP");
//     }
//     if(req.session.items){  
//         t2 ='[' + (temp) +',' + JSON.stringify(painting) + ']';
//         // const t3 = temp +','+ t2;
        

//         // console.log(JSON.parse(t3));

//         req.session.num = num;
//         req.session.items = JSON.parse(t2);
       
//     }
//     else{
//         req.session.num = parseInt(req.body.num);
     
//         req.session.items= painting;
//         const temp = JSON.stringify(req.session.items);
       
        

//     }
//     // const livecart = await cart.find({ sessionId: req.session.id}).exec();

    
//     res.redirect("/order");

// })
// app.post('/added/o/:id/',async (req,res)=>{
//     const painting = await product.findById(req.params.id);
//     const currency= req.body.currency;
//     req.session.currency=req.body.currency;

//     if(currency=="1"){
//         painting.currency="Indian Rupees";
//     }else{
//         painting.currency="US Dollars"
//     }
//     console.log("********");
//     console.log(currency);
//     console.log("*********");
//     painting.original=1;
//     if(!req.session.total){
//         req.session.total=0;
//     }
//     var pay;
//     if(currency=="1"){
//         pay = painting.priceo+(req.session.total);
//     }else{
//         pay = painting.dolpriceo+(req.session.total);
//     }

//     req.session.total=pay;
//     // console.log("ADDED ORIGINAL");
//      console.log(painting);



//     const num = parseInt(req.body.num)+parseInt(req.session.num);
//    var temp = JSON.stringify(req.session.items);
//    var t2 =[];
//    if(req.session.num>1){
//        temp = temp.slice(1,-1);
//    }
//    for(var i=0; i <= num;i++){
//        console.log("YUP");
//    }
//    if(req.session.items){  
//        t2 ='[' + (temp) +',' + JSON.stringify(painting) + ']';
//        // const t3 = temp +','+ t2;
       

//        // console.log(JSON.parse(t3));

//        req.session.num = num;
//        req.session.items = JSON.parse(t2);
      
//    }
//    else{
//        req.session.num = parseInt(req.body.num);
    
//        req.session.items= painting;
//        const temp = JSON.stringify(req.session.items);
      
       

//    }
//    // const livecart = await cart.find({ sessionId: req.session.id}).exec();

   
//    res.redirect("/order");

// })

// app.post('/blog',catchAsync(async (req,res, next)=>{
//     // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    
    
    
//     //JOI VALIDATION MIDDLEWARE PART IS NOT DONE
    
    
    
//     const b = new blogs(req.body.blogs);
//     // b.date = new Date();
//     const tdate=new Date().toDateString();
//     const fd = tdate.slice(4,40);

//     b.date = fd;
//     await b.save();
//     console.log("ADDED");
//     res.redirect(`/blog`)
 

// }));
// app.post('/order/confirm/',catchAsync(async (req,res, next)=>{
//     var orderdp = req.session.items;
    
//     const num = req.session.num;
//     var ordsize;
//     ordsize = orderdp.length;

//     if(!ordsize){
//         if(orderdp.original==1){
//             const dp = new product(orderdp);
//             orderdp.original=-1;
//             const np = new product(orderdp);
//             // np.original=-1;
//             // console.log(orderdp[i]);
//             console.log("----------------");
//             // console.log(np);
//             await dp.remove();
//             await np.save();
//         }
//     }else{
//         for(let i=0;i<ordsize;i++){
//             console.log("_________");
//             if(orderdp[i].original==1){
//                 const dp = new product(orderdp[i]);
//                 orderdp[i].original=-1;
//                 const np = new product(orderdp[i]);
//                 // np.original=-1;
//                 // console.log(orderdp[i]);
//                 console.log("----------------");
//                 // console.log(np);
//                 await dp.remove();
//                 await np.save();
//             }
//         }

//     }

   
//     const userdet = req.body.order;
//     // const paintingdet = req.body.painting;
//     const prints = req.body.prints;
//     const original = req.body.original;
//     const title = req.body.title;
//     const price = req.body.price;

//     // console.log(price);
//     const forder = new order();
//     forder.name=userdet.name;
//     forder.address=userdet.address;
//     forder.number=userdet.number;
//     forder.mail=userdet.mail;
//     forder.title=title;
//     forder.original=original;
//     forder.prints=prints;
//     forder.total=req.session.total;
//     forder.price=price;
//     forder.currency=req.session.currency;
//     forder.status=1;

//     // forder.date=new Date();

    
//     forder.date = new Date().toDateString();

//     req.session.items=Array;
//     req.session.num=0;
//     req.session.total=0;
//     await forder.save();
//     const id = forder._id;
//     // console.log(forder);
//     // console.log("*************");
//     // console.log(paintings.title.length);
//     res.redirect(id);
// }));



// app.post('/showcase',catchAsync(async (req,res, next)=>{
//     // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    
    
    
//     //JOI VALIDATION MIDDLEWARE PART IS NOT DONE
    
//     const painting = new product(req.body.product);
//     // console.log("*****************");
//     // console.log(req.body.product);
//     await painting.save();
//     // console.log("ADDED");
//     // res.send("AAAAA");
//     res.redirect(`/showcase`);
 

// }));


