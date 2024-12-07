
class WebData{

    constructor(name,url,id){
        this.name = name 
        this.url = url
        if(id || id != -1)
            this.id = id 
        else 
            this.id = -1   
    } ; 

}

export default WebData ; 