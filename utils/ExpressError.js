class ExpressError extends Error{
    constructor(status,message){
        super();
        this.status = status;
        this.message = mesaage;
    }
}

export default ExpressError;