class RequestService{
    constructor(requestObj, url){
        this.url = url;
        this.requestObj = requestObj;
    }

    setUrl(url) {
        this.url = url;
    }

}

export default RequestService;