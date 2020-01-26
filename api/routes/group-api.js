var express = require('express');
var fs = require('fs');
var router  = express.Router();
var Groups  = require('../controllers/group');
var Group = require('../models/groups');
var passport = require('passport');

const multer = require('multer');
const multerConfig = require('./config/multer');

const add_element = (res,path,type,content,tags) => {
    console.log("add_el: "+tags)
    Groups.page(path)
        .then(dados =>{ 
            page = (dados[0].page);
            switch(type){
                case 'p' : page.push({p:content, tags: tags.split(";")});
                   break;
                case 'event' : page.push({event:content, tags: tags.split(";")});
                   break;
                case 'list' : page.push({list:content, tags: tags.split(";")});
                   break;
                case 'pdf' : page.push({pdf:content, tags: tags.split(";")});
                   break;
                case 'img' : page.push({img:content, tags: tags.split(";")});
                   break;
                case 'h1' : page.push({h1:content, tags: tags.split(";")});
                   break;
                case 'h2' : page.push({h2:content, tags: tags.split(";")});
                   break;
                case 'h3' : page.push({h3:content, tags: tags.split(";")});
                   break;
                case 'a' : page.push({a:content, tags: tags.split(";")});
                   break;
                default: page.push({file:content, tags: tags.split(";")});
            }
            Group.findByIdAndUpdate(
                dados[0]._id,
                {page : page},
                {new : true},
                (err,d) => {
                    if(!err){
                        console.log(d)
                        //page = page.map(remove_id)
                        //console.log(page);
                    }else{
                        console.log({ok : -2})
                    }
                })
            })
        .catch(err => console.log(err))
}



//var upload = multer(multerConfig)
var upload = multer({dest: 'uploads'})

/*
        Users.favourite(req.query.user)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro));
 */
router.get('/*', passport.authenticate('jwt', {session: false}), (req, res) => {
    let path = req.params['0'].replace(/\/+$/, '');
    Groups.group_id(path)
            .then(dados => res.jsonp(dados[0]))
            .catch(erro => res.status(500).jsonp(erro));
});

router.post('/*', upload.single('file'), (req, res) => {
    let path = req.params['0'].replace(/\/+$/, '');
    console.log(path)
    console.log("type :" + req.query.type)
    if(req.query.type== "file" && req.file != undefined){
        console.log("path: " + path)
        let tags = req.body.tags;
        tags = (tags!=undefined)?tags:"";
        movefile(req,res,path,tags);
        res.redirect('http://localhost:5877/root/' + path);
        console.log(req.file);
    }else{
        let email = req.body["mail"];
        let name = req.body["name"];
        Groups.add_group(res,path,name,email);
    }
});

var movefile = (req,res,path,tags) => {
    let oldpath = __dirname + '/../' + req.file.path;
    let newfolder = __dirname + '/../public/uploads/'+ path +'/';
    let nameFile = req.file.originalname;
    let nameFile_list = (nameFile.split("."))
    nameFile = (nameFile_list[nameFile_list.length -1] == "html")?nameFile_list.slice(0,nameFile_list.length -1).join("."): nameFile
    let newpath = newfolder + nameFile;
    console.log(oldpath);
    console.log(newpath);
    console.log(path);
    fs.mkdirSync(newfolder, { recursive: true });
    fs.rename(oldpath, newpath, (err)=>{
        if(err) res.jsonp(err)
        //res.jsonp(newpath);
        //
        var servepath = "http://localhost:4877/uploads/" + path + "/" + nameFile;
        console.log("servepath: " + servepath);
        console.log(req.file.mimetype)
        switch(req.file.mimetype){
            case 'application/pdf': add_element(res,path,"pdf", servepath, tags);
                                   break;

            case 'image/gif':      add_element(res,path,"img", servepath, tags);
                                   break;

            case 'image/jpeg':     add_element(res,path,"img", servepath, tags);
                                   break;

            case 'image/png':      add_element(res,path,"img", servepath, tags);
                                   break;

            //case 'audio/wav':      add_element(res,path,{audio : servepath, tags});
            //                       break;

            //case 'audio/wave':      add_element(res,path,{audio : servepath, tags});
            //                       break;

            //case 'video/webm':      add_element(res,path,{video : servepath, tags});
            //                       break;

            //case 'video/ogg':      add_element(res,path,{video : servepath, tags});
            //                       break;

            default:
                add_element(res,path,"file", servepath, tags);

        }
        //add_element(res,path,{img : servepath});
    });
}

router.put('/*', passport.authenticate('jwt', {session: false}), (req, res) => {
    let path = req.params['0'].replace(/\/+$/, '');
    let i    = req.body.i;
    let j    = req.body.j;

    let text = req.body.text;
    let tags  = req.body.tags;
    console.log("tags: "+ tags);
    tags = (tags!=undefined)?tags:""
    let type = req.query.type;
    console.log("text: "+text)
    console.log("type: "+type)
    if(text!= undefined && type!= undefined){
        console.log("add text")
        if(type=="event"){
        add_element(res,path,type,{title : text, data: req.body.data},tags);
        console.log("add event : " + text + " " + req.body.data)
        }else{
        add_element(res,path,type,text,tags);
        }
        res.jsonp({ok:1})
        
    }else{
        Groups.swap_elements(res,path,i,j);
    }

});

router.delete('/*', passport.authenticate('jwt', {session: false}), (req, res) => {
    let path = req.params['0'].replace(/\/+$/, '');
    let l = req.body.l;
    console.log(l);
    console.log(path);
    Groups.delete_elements(res,path,l);
});

module.exports = router;
