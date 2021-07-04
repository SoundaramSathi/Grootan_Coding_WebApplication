var MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcryptjs')
const parser = (req,res,next)=>{
   
    try{
        
        var url = "mongodb://localhost:27017/";
        
        MongoClient.connect(url, function(err, database) {
          if (err) throw err;
          var dbSession = database.db("CsvContent");
          const unfilteredArray = req.body
          if (Array.isArray(unfilteredArray)){

            filteredArray = unfilteredArray.map(encryptPassword)
            console.log(filteredArray.length)
            dbSession.collection("content").insertMany(filteredArray, function(err, res) {
                if (err) throw err;
                console.log(res.insertedCount +" document inserted");
                database.close()
              });
              res.send({"status":"completed"} )
          }
          else{
          res.sendStatus(400)
        }}); 
        
            
    }
    catch (e){
        console.log(e)
    }
     //raiseExceptionAndNotifyEvent()
}
const encryptPassword = (data)=>{

   
    if (data.hasOwnProperty("password")) {
        
       data.password = bcrypt.hashSync(data.password ,10)

       return data

    }else{
    return data  
}

}

module.exports = parser