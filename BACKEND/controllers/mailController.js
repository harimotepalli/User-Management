const nodemailer = require('nodemailer');
 
const sendMail = (req, res) => {
 
    const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: 'durgahari012@gmail.com',
            pass: "ijiy sxzv uvvt ynzc"
        }
    });
 
    const mailOptions = {
        from: "durgahari012@gmail.com",
        to: "durgaharimotepalli@gmail.com",
        subject: "Testing",
        // text: "Hello this is sender......!"
        html: `
            <div>
                <h1>Hello this mail is from nodemailer</h1>
            </div>
        `
    };
 
    mailTransporter.sendMail(mailOptions, (error, info) => {
        if(error){
            res.status(500).send({error: error});
        };
        res.status(200).send({message: "mail sent succesfully..."});
    });
 
};
 
exports.sendMail = sendMail;