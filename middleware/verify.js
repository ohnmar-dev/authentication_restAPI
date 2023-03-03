// authorization beare (access_token)

const verifyToken=function verifyToken(req,res,next){
    const beareHeader=req.headers['authorization'];
    if(typeof beareHeader !=='undefined'){
        const beare=beareHeader.split(' ')

        // for get token from array
        const beareToken=beare[1]

        // set token
        req.token=beareToken;
        next()

    }else{
        // for Forribedden
        res.status(433).json({message:"Forribedden"})
    }
}

module.exports=verifyToken