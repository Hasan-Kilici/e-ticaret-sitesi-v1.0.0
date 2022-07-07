const http = require("http"); //Bu olmazsa site yok olur
const fs = require("fs"); // File system (DB DOLARSA DİYE)
const express = require("express"); //Bu olmazsa site yok olur
const morgan = require("morgan"); //DB Suportter
const mongoose = require("mongoose"); //DB
const multer  = require('multer') //Dosya
const app = express(); //Bu olmazsa site yok olur
const { MessageEmbed, WebhookClient } = require('discord.js');
const bodyParser = require("body-parser"); // Body Parser (Formlar için lazım)
const server = http.createServer(app); //Bu olmazsa site yok olur
const path = require("path"); //Patika (Statik için lazım)
const events = require("events"); //Online işlemler için şart
const { Server } = require("socket.io"); //Event emitter kolaylaştırmak için ve Chat app için
const io = new Server({});
const EventEmitter = require("events").EventEmitter; //Event emitter
const em = new EventEmitter(); //Event emitter
const cookieParser = require("cookie-parser"); //Çerezleri kontrol etmek ve çerez eklemek için şart
//Upload file
app.use(cookieParser());

const port = 3000;
//view engine
const ejs = require("ejs");
app.engine("ejs", ejs.renderFile);
app.set("view engine", "ejs");
//Body-parse
app.use(bodyParser.json()).use(
  bodyParser.urlencoded({
    extended: true,
  })
);
//Statik
app.use(express.static("public"));
app.set("src", "path/to/views");
      
//MongoDB
const dbURL = process.env.db;
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
.then((result) => {
app.listen(port, ()=>{
console.log("mongoDB Bağlantı kuruldu");
});
}).catch((err) => console.log(err));
//Colections
const Kullanicilar = require('./models/kullanicilar.js');
const Market = require('./models/market.js');
const Urunler = require('./models/urunler.js');
const Yorumlar = require('./models/yorumlar.js');
const Sepet = require('./models/sepet.js');
const Siparis = require('./models/siparis.js')
//View engine
app.set("view engine", "ejs");
//DB Support
app.use(morgan("dev"));
//Sayfalar
//Anasayfa
app.get('/',(req,res)=>{
var userId = req.cookies.id;
Market.find().then((marketSonuc)=>{
Urunler.find().sort({createdAt : -1}).limit(6).then((urunSonuc)=>{
Urunler.find({kategori : "evesyalari"}).limit(4).then((evEsyalariSonuc)=>{
Urunler.find({kategori : "meyveSebze"}).limit(4).then((meyveSebzeSonuc)=>{
Urunler.find({kategori : "kozmetik"}).limit(4).then((kozmetikSonuc)=>{
Urunler.find({kategori : "elektronik"}).limit(4).then((elektronikSonuc)=>{
if(userId != null){
Kullanicilar.findById(userId).then((kullaniciSonuc)=>{
res.render(__dirname+'/src/signed/index.ejs',{title : "Anasayfa", kullanici : kullaniciSonuc, urun : urunSonuc, evesyalari : evEsyalariSonuc, meyvesebze : meyveSebzeSonuc, kozmetik : kozmetikSonuc, elektronik : elektronikSonuc})
}).catch((err)=>{
res.render(__dirname+'/src/pages/index.ejs',{title : "Anasayfa", urun : urunSonuc, evesyalari : evEsyalariSonuc, meyvesebze : meyveSebzeSonuc, kozmetik : kozmetikSonuc, elektronik : elektronikSonuc})
})
} else {
res.render(__dirname+'/src/pages/index.ejs',{title : "Anasayfa", urun : urunSonuc, evesyalari : evEsyalariSonuc, meyvesebze : meyveSebzeSonuc, kozmetik : kozmetikSonuc, elektronik : elektronikSonuc});  
}
})
})
})
})
})
})
})
app.get('/sepet/:id',(req,res)=>{
var id = req.params.id;
var userId = req.cookies.id;
Kullanicilar.findById(id).then((kullaniciSonuc)=>{
Sepet.find({kullaniciId : id}).then((sepetSonuc)=>{
Sepet.find({kullaniciId : id}).count().then((sepetSayiSonuc)=>{
if(userId != null){
res.render(__dirname+'/src/signed/sepet.ejs',{title : kullaniciSonuc.kullanici_adi+" Sepet",sepet : sepetSonuc, kullanici : kullaniciSonuc, urunsayi : sepetSayiSonuc})
} else {
res.redirect('/')
}
})
})
}).catch((err)=>{
res.redirect('/')
})
})
//Kategoriler
//Ev Eşyaları
app.get('/kategori/ev-esyalari',(req,res)=>{
var userId = req.cookies.id;
Market.find().then((marketSonuc)=>{
Urunler.find().sort({createdAt : -1}).then((urunSonuc)=>{
Urunler.find({kategori : "evesyalari"}).then((evEsyalariSonuc)=>{
if(userId != null){
Kullanicilar.findById(userId).then((kullaniciSonuc)=>{
res.render(__dirname+'/src/signed/ev-esyalari.ejs',{title : "Anasayfa", kullanici : kullaniciSonuc, urun : urunSonuc, evesyalari : evEsyalariSonuc})
}).catch((err)=>{
res.redirect("/")
})
} else {
res.render(__dirname+'/src/pages/ev-esyalari.ejs',{title : "Anasayfa", urun : urunSonuc, evesyalari : evEsyalariSonuc});  
}
})
})
})
})
//Meyve Sebze
app.get('/kategori/meyve-sebze',(req,res)=>{
var userId = req.cookies.id;
Market.find().then((marketSonuc)=>{
Urunler.find().sort({createdAt : -1}).then((urunSonuc)=>{
Urunler.find({kategori : "meyveSebze"}).then((meyveSebzeSonuc)=>{
if(userId != null){
Kullanicilar.findById(userId).then((kullaniciSonuc)=>{
res.render(__dirname+'/src/signed/meyve-sebze.ejs',{title : "Anasayfa", kullanici : kullaniciSonuc, urun : urunSonuc, meyvesebze : meyveSebzeSonuc, })
}).catch((err)=>{
res.redirect("/")
})
} else {
res.render(__dirname+'/src/pages/meyve-sebze.ejs',{title : "Anasayfa", urun : urunSonuc, meyvesebze : meyveSebzeSonuc, });  
}
})
})
})
})
//Kozmetik
app.get('/kategori/kozmetik',(req,res)=>{
var userId = req.cookies.id;
Market.find().then((marketSonuc)=>{
Urunler.find().sort({createdAt : -1}).then((urunSonuc)=>{
Urunler.find({kategori : "kozmetik"}).then((kozmetikSonuc)=>{
if(userId != null){
Kullanicilar.findById(userId).then((kullaniciSonuc)=>{
res.render(__dirname+'/src/signed/kozmetik.ejs',{title : "Anasayfa", kullanici : kullaniciSonuc, urun : urunSonuc, kozmetik : kozmetikSonuc})
}).catch((err)=>{
res.redirect("/")
})
} else {
res.render(__dirname+'/src/pages/kozmetik.ejs',{title : "Anasayfa", urun : urunSonuc, kozmetik : kozmetikSonuc});  
}
})
})
})
})
//Elektronik
app.get('/kategori/elektronik',(req,res)=>{
var userId = req.cookies.id;
Market.find().then((marketSonuc)=>{
Urunler.find().sort({createdAt : -1}).then((urunSonuc)=>{
Urunler.find({kategori : "elektronik"}).then((elektronikSonuc)=>{
if(userId != null){
Kullanicilar.findById(userId).then((kullaniciSonuc)=>{
res.render(__dirname+'/src/signed/elektronik.ejs',{title : "Anasayfa", kullanici : kullaniciSonuc, urun : urunSonuc, elektronik : elektronikSonuc})
}).catch((err)=>{
res.redirect("/")
})
} else {
res.render(__dirname+'/src/pages/elektronik.ejs',{title : "Anasayfa", urun : urunSonuc, elektronik : elektronikSonuc});  
}
})
})
})
})
//Ürün sayfaları
app.get('/urun/:id',(req,res)=>{
var userId = req.cookies.id;
var id = req.params.id;
Urunler.findById(id).then((urunSonuc)=>{
if(userId != null){
Kullanicilar.findById(userId).then((kullaniciSonuc)=>{
res.render(__dirname+'/src/signed/urun.ejs',{title : urunSonuc.baslik, kullanici : kullaniciSonuc, urun : urunSonuc})
}).catch((err)=>{
res.redirect("/")
})
} else {
res.render(__dirname+'/src/pages/urun.ejs',{title : urunSonuc.baslik, urun : urunSonuc});  
}
})
})
//Sayfalar - Market
//Kullanıcı girişine yönlendir
app.get('/giris-yap',(req,res)=>{
res.render(__dirname+'/src/pages/giris.ejs',{title : "Giriş Yap"})
})
//Kullanıcı Kayıta yönlendir
app.get('/kayit-ol',(req,res)=>{
res.render(__dirname+'/src/pages/kayit.ejs',{title : "Kayıt Ol"})
})
//Market Görüntüleme
app.get('/market/:id',(req,res)=>{
var id = req.params.id;
var userId = req.cookies.id;
Market.findById(id).then((marketSonuc)=>{
Urunler.find({marketId : marketSonuc._id}).sort({createdAt : -1}).then((urunlerSonuc)=>{
if(userId != null){
Kullanicilar.findById(userId).then((kullaniciSonuc)=>{
res.render(__dirname+'/src/signed/market.ejs',{kullanici : kullaniciSonuc, market : marketSonuc, urun : urunlerSonuc, title : marketSonuc.isim})
}).catch((err)=>{
res.render(__dirname+'/src/pages/market.ejs',{market : marketSonuc, urun : urunlerSonuc, title : marketSonuc.isim})
})
} else {
res.render(__dirname+'/src/pages/market.ejs',{market : marketSonuc, urun : urunlerSonuc, title : marketSonuc.isim})
}
})
})
})
//Market Ürün Takip
app.get('/market/dashboard/:id',(req,res)=>{
var id = req.params.id;
var userId = req.cookies.id;
Kullanicilar.findById(userId).then((kullaniciSonuc)=>{
Urunler.find({marketId : id}).then((urunlerSonuc)=>{
Market.findById(id).then((marketSonuc)=>{
Siparis.find({marketId : id}).then((SiparisSonuc)=>{
if(kullaniciSonuc.marketId == id){
res.render(__dirname+'/src/market/dashboard.ejs',{kullanici : kullaniciSonuc, urun : urunlerSonuc, market : marketSonuc, siparisler : SiparisSonuc, title : marketSonuc.isim+" Dashboard"});
} else {
res.redirect('/')
}
})
})
})
})
})
//Admin Dashboard
app.get('/admin/dashboard',(req,res)=>{
var userId = req.cookies.id;
Kullanicilar.findById(req.cookies.id).then((KullaniciSonuc)=>{
if(KullaniciSonuc.admin == "true"){
Urunler.find().sort({createdAt : -1}).then((UrunlerSonuc)=>{
Market.find().sort().then((MarketSonuc)=>{
Kullanicilar.find().sort().then((KullanicilarSonuc)=>{
Kullanicilar.find({marketAdmin : "true"}).sort().then((MarketSahipleri)=>{
res.render(__dirname+'/src/admin/dashboard.ejs',{title : "Admin Dashboard", kullanici : KullaniciSonuc, urun : UrunlerSonuc, market : MarketSonuc, kullanicilar : KullanicilarSonuc, marketSahip : MarketSahipleri})  
console.log(KullaniciSonuc.kullanici_adi)
})
})
})
})
} else {
res.redirect('/')
}
})
})
//Market Ekleme
app.post('/market/ekle',(req,res)=>{
var market = new Market({
isim : req.body.isim,
logo : req.body.logo
})
market.save().then((Sonuc)=>{
res.redirect('/admin/dashboard') 
})
})
//Kullanıcı Silme
app.post('/kullanici/sil/:id',(req,res)=>{
var id = req.params.id;
Kullanicilar.findByIdAndDelete(id).then((Sonuc)=>{
res.redirect('/admin/dashboard/')
})
})
//Kullanıcı Düzenle
app.post('/kullanici/duzenleme/:id',(req,res)=>{
var id = req.params.id;
var userId = req.cookies.id;
Kullanicilar.findById(id).then((Sonuc)=>{
Kullanicilar.findById().then((AdminSonuc)=>{
res.render(__dirname+'/src/admin/kullanici-duzenle.ejs',{title : Sonuc.kullanici_adi+" düzenle", kullanici : AdminSonuc ,kullanicilar : Sonuc})
})
})
})
app.post('/kullanici/duzenle/:id',(req,res)=>{
var id = req.params.id;
Kullanicilar.findByIdAndUpdate(id,{
kullanici_adi : req.body.kullanici_adi,
sifre:req.body.sifre,
email:req.body.email,
admin:req.body.admin,
marketAdmin:req.body.marketAdmin,
marketId:req.body.marketId,
market:req.body.market
}).then((Sonuc)=>{ 
res.redirect('/admin/dashboard')
})
})
//Markete Ürün ekleme
app.post('/urun/ekle/:id',(req,res)=>{
var id = req.params.id;
var userId = req.cookies.id;
Kullanicilar.findById(userId).then((kullaniciSonuc)=>{
Market.findById(id).then((marketSonuc)=>{
var urun = new Urunler ({
fiyat : req.body.fiyat,
baslik : req.body.baslik,
aciklama : req.body.urunaciklama,
marketId : id,
market : marketSonuc.isim,
kategori : req.body.kategori,
foto : req.body.foto
})
urun.save().then((urunSonuc)=>{
res.redirect('/market/dashboard/'+id)
})
})
})
})
//Konum Ekleme
app.post('/adres-ekle/:id',(req,res)=>{
var id = req.params.id;
Kullanicilar.findByIdAndUpdate(id,{
adres : req.body.il+","+req.body.ilce+","+req.body.mah,
tel : req.body.telno,
}).then((KullaniciSonuc)=>{
res.redirect('/sepet/'+id)
})
})
//Marketten Ürün kaldırma
app.post('/urun/sil/:id',(req,res)=>{
var id = req.params.id;
Kullanicilar.findById(req.cookies.id).then((kullaniciSonuc)=>{
Urunler.findByIdAndDelete(id).then((urunSonuc)=>{
res.redirect('/market/dashboard/'+kullaniciSonuc.marketId)
})
})
})
//Markette ki ürünü güncelleme
app.post('/urun/duzenleme/:id',(req,res)=>{
var id = req.params.id;
Kullanicilar.findById(req.cookies.id).then((kullaniciSonuc)=>{
Urunler.findById(id).then((urunSonuc)=>{
res.render(__dirname+'/src/market/urun-duzenle.ejs',{urun : urunSonuc, kullanici : kullaniciSonuc, title : urunSonuc.baslik+" Düzenle"})
})
})
})
app.post('/urun/duzenle/:id',(req,res)=>{
var id = req.params.id;
Kullanicilar.findById(req.cookies.id).then((kullaniciSonuc)=>{
Market.findById(kullaniciSonuc.marketId).then((marketSonuc)=>{
Urunler.findByIdAndUpdate(id,{
fiyat : req.body.fiyat,
baslik : req.body.baslik,
aciklama : req.body.urunaciklama,
kategori : req.body.kategori,
foto : req.body.foto,
}).then((urunSonuc)=>{
res.redirect('/market/dashboard/'+urunSonuc.marketId)
})
})
})
})
//Ürün arama
app.post('/urun/arama',(req,res)=>{
var sonuc = req.body.arama;
var userId = req.cookies.id;
Market.find().then((marketSonuc)=>{
Urunler.find({baslik : sonuc}).sort({createdAt : -1}).then((urunSonuc)=>{
if(userId != null){
Kullanicilar.findById(userId).then((kullaniciSonuc)=>{
res.render(__dirname+'/src/signed/arama.ejs',{title : "Anasayfa", kullanici : kullaniciSonuc, urun : urunSonuc })
}).catch((err)=>{
res.redirect("/")
})
} else {
res.render(__dirname+'/src/pages/arama.ejs',{title : "Anasayfa", urun : urunSonuc });  
}
})
})
})
//Ürün takip
app.post('/siparis-et/:id',(req,res)=>{
var id = req.params.id;
var userId = req.cookies.id;
Sepet.findById(id).then((SepetSonuc)=>{
Market.findById(SepetSonuc.marketId).then((MarketSonuc)=>{
Kullanicilar.findById(userId).then((KullaniciSonuc)=>{
var siparis = new Siparis({
marketId : MarketSonuc._id,
urun : SepetSonuc.urun,
urunId : SepetSonuc.urunId,
kullanici : KullaniciSonuc.kullanici_adi,
adres : KullaniciSonuc.adres
})
siparis.save().then((Sonuc)=>{
res.redirect('/sepet/'+userId)
})
})
})
})
})
//Sipariş Gönderildi (SİLİNDİ)
app.post('/siparis/sil/:id',(req,res)=>{
var id = req.params.id;
Siparis.findByIdAndDelete(id).then((Sonuc)=>{
res.redirect('/market/dashboard/'+Sonuc.marketId) 
})
})
//Ürünü Sepete ekleme
app.post('/sepete/ekle/:id',(req,res)=>{
var id = req.params.id;
var userId = req.cookies.id;
Urunler.findById(id).then((urunSonuc)=>{
var sepet = new Sepet({
marketId : urunSonuc.marketId,
market : urunSonuc.market,
urun : urunSonuc.baslik,
urunId : urunSonuc._id,
fiyat : urunSonuc.fiyat,
kullaniciId : userId
})
sepet.save().then((sonuc)=>{
res.redirect('/sepet/'+userId)
})
})
})
//Sepetten çıkarma
app.post('/sepetten/kaldir/:id',(req,res)=>{
var id = req.params.id;
var userId = req.cookies.id;
Sepet.findByIdAndDelete(id).then((sonuc)=>{
res.redirect('/sepet/'+userId)
})
})
//Kayıt Olmak
app.post('/kayit',(req,res)=>{
Kullanicilar.findOne({ kullanici_adi: req.body.username }, (err, kullanici) => {
if(kullanici){
res.send('Bu kullunıcı adı kullanılmakta <a href="/kayit-ol">Geri Dön</a>');
} else {
var kullanici = new Kullanicilar ({
kullanici_adi : req.body.username,
sifre : req.body.sifre,
email : req.body.email,
adres : "false",
})
kullanici.save().then((KullaniciSonuc)=>{
res.cookie('id', KullaniciSonuc._id)
res.redirect('/')
})
}
})
})
//Kullanıcı girişi
app.post('/giris',(req,res)=>{
var sifre = req.body.sifre;
var username = req.body.username
Kullanicilar.findOne({kullanici_adi : username, sifre : sifre}).then((KullaniciSonuc)=>{
res.cookie('id',KullaniciSonuc._id)
res.redirect('/')
}).catch((err)=>{
res.send("Böyle bir kullanıcı Yok")
})
})
//Çıkış yapma
app.get('/cikis-yap',(req,res)=>{
res.clearCookie("id");
res.redirect('/')
res.end()
})
