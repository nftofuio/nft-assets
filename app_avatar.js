const axios = require('axios')
const fs = require('fs')
const request=require('request');
const url = "https://us-central1-entrepot-api.cloudfunctions.net/api/collections";
const dirBanner = "./banner";
const dirAvatar = "./avatar";
const dirCollection = "./collection";


//create dir
fs.readdir('./', (err, files) => {  
  if (!files.includes('banner')) {
    fs.mkdir(dirBanner, (err) => {
      if (err) {
          throw err;
        }
        console.log("dir already exists")
      }
    )
  }
  if (!files.includes('avatar')) {
    fs.mkdir(dirAvatar, (err) => {
      if (err) {
          throw err;
        }
        console.log("dir already exists")
      }
    )
  }
  if (!files.includes('collection')) {
    fs.mkdir(dirCollection, (err) => {
      if (err) {
          throw err;
        }
        console.log("dir already exists")
      }
    )
  }
})


var fileNameArr = fs.readdirSync(dirAvatar);
console.log(fileNameArr);


const download = (uri, dir, filename) => { 
    try {
        request.head(uri, function(err, res, body){
            console.log(filename+ ' -> ' +uri)
            let fileStream=fs.createWriteStream(dir+"/"+filename,{autoClose:true})
            request(uri).pipe(fileStream);
            fileStream.on('finish',function(){
                // console.log(filename + ' write file finished')
            })
            console.log('request err', err)
        });
      } catch (error) {
        console.error(error);
      }
    
}

console.log('axios get start... ')
axios.get(url, {
    params: {
        keywords: "value"
    }
}).then(response => {
    let res = response.data;
    if (res && res.length >0) {
        for(let i = 0; i < res.length; ++i) {
        // for (const item of res) {
            const item = res[i]
            let fileExtension = "png";
            
            let res_avatar = item.avatar;
            let res_banner = item.banner;
            let res_collection = item.collection;
            if (item.avatar) {
                if(!item.avatar.startsWith("http")) {
                    res_avatar = "https://entrepot.app" + item.avatar;
                }

                let temp = res_avatar.split('/')
                let lastTemp = temp[temp.length-1]
                if (lastTemp && lastTemp.length > 0 && lastTemp.lastIndexOf(".")) {
                    fileExtension = lastTemp.substring(lastTemp.lastIndexOf('.') + 1);
                } else {
                    fileExtension = "png";
                }

                // console.log("get avatar", res_avatar)
                let filename = item.route + "." + fileExtension
                let checkName = item.route + ".png"
                if(fileNameArr.indexOf(checkName) < 0) {
                  console.log('not contain',filename + '---->' +fileNameArr.indexOf(filename));
                  download(res_avatar,dirAvatar,filename)
                }  
            }
            
        }
        // console.log("download completed")
    }
}).catch(error => {
    console.log('axios err', error);
});


