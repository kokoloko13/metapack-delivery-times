const moment = require('moment');

const Module = require('../models/module');
const Service = require('../models/service');
const Role = require('../models/role');

const isAdmin = async (roleId) => {
    const userRole = await Role.findById(roleId);

    return await userRole.name;
}

exports.calc = async (req, res) => {

    try {    
        const params = req.query;

        const momentDate = moment(params.purchaseDate, 'DDMMYYYYTHHmm');

        const moduleCode = req.params.moduleCode,
            serviceName = params.serviceName,
            purchaseDate = momentDate.toDate(),
            fromCountry = params.fromCountry,
            toCountry = params.toCountry;

            let transit = null;

            let sendDate = null,
                predDates = [];

            const service = await Service.findOne({ name: serviceName });

            const module = await Module.findOne({ code: moduleCode, services: service._id });

            deliveryWindow = {
                from: moment(`${params.purchaseDate.split('T')[0]}T${module.deliveryWindow.from}`, 'DDMMYYYYTHHmm'),
                to: moment(`${params.purchaseDate.split('T')[0]}T${module.deliveryWindow.to}`, 'DDMMYYYYTHHmm')
            };

            for(const transitTime of service.transitTimes) {
                if(transitTime.from === fromCountry && transitTime.to === toCountry) transit = transitTime;
            }

            if(transit === null) res.status(404).json({ message: "Service not found." });

            if(momentDate.isBetween(deliveryWindow.from, deliveryWindow.to)) {
                    sendDate = momentDate;
            } else {
                let found = false;
                let tempSendDay = moment(`${params.purchaseDate.split('T')[0]}T0900`, 'DDMMYYYYTHHmm');

                do {
                    tempSendDay.add(1, 'days');

                    if(tempSendDay.day() !== 0 && tempSendDay.day() !== 6 ){
                        found = true;
                        sendDate = tempSendDay;
                    }

                } while(!found);
                
            }

            const dispatchDays = transit.dispatch,
                transitDays = transit.transit,
                deliveryDays = transit.delivery;
            
           // TODO: CALCULATE PRED. DATES

            res.status(200).json({ purchaseDate: sendDate.format("DDMMYYYYTHHmm"), predictableDates: predDates });

    } catch (err) {
        res.status(400).json({success: false, message: err.message});
    }
   
}

exports.create = async (req, res) => {
    const userRole = await isAdmin(req.user.role);

    if( userRole !== "ADMIN" ) {

        res.status(401).json({ message: "Unauthorized Access" });

    } else {

        try {
            const data = req.body;

            const newModule = new Module({
                code: data.code,
                services: [],
                deliveryWindow: {
                    from: data.deliveryWindow.from,
                    to: data.deliveryWindow.to
                }
            });


            if(data.services.length > 0) {
                data.services.forEach( service => {
                    const tempService = new Service(service);
                    tempService.save();

                    newModule.services.push(tempService);
                });
            }

            newModule.save();


            res.status(201).json({ success: true, data: newModule });
       } catch(err) {
            res.status(400).json({success: false, message: err.message});
       }
       
    }
}

exports.update = async (req, res) => {
    const userRole = await isAdmin(req.user.role);

    console.log(`UPDATE ATTEMPT: MODULE #${req.params.id}, USER ROLE: ${userRole}`);

    if( userRole !== "ADMIN" ) {
        console.log("DANIED");
        res.status(401).json({ message: "Unauthorized Access" });
    } else {
        console.log("DELETED");
        res.status(200).json({ message: `Module #${req.params.id} has been deleted by ${userRole}: ${req.user.username}` });
    }
}

exports.delete = async (req, res) => {
    const userRole = await isAdmin(req.user.role);

    console.log(`DELETE ATTEMPT: MODULE #${req.params.id}, USER ROLE: ${userRole}`);

    if( userRole !== "ADMIN" ) {
        console.log("DANIED");
        res.status(401).json({ message: "Unauthorized Access" });
    } else {
        console.log("DELETED");
        res.status(200).json({ message: `Module #${req.params.id} has been deleted by ${userRole}: ${req.user.username}` });
    }

}
