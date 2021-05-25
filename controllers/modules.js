const moment = require('moment');

const Role = require('../models/role');

const Module = require('../models/module');
const Service = require('../models/service');



exports.calc = async (req, res) => {

    try {    
        const params = req.query;

        const momentDate = moment(params.purchaseDate, 'DDMMYYYYTHHmm');

        const moduleCode = req.params.moduleCode,
            serviceName = params.serviceName,
            purchaseDate = momentDate.toDate(), // PURCHASE DATE
            fromCountry = params.fromCountry,
            toCountry = params.toCountry;

            let transit = null;

            let initTime = null,
                predDates = [];

            

            const service = await Service.findOne({ name: serviceName });

            const module = await Module.findOne({ code: moduleCode, services: service._id });

            for(const transitTime of service.transitTimes) {
                if(transitTime.from === fromCountry && transitTime.to === toCountry) transit = transitTime;
            }

            if(transit === null) res.status(404).json({ message: "Service not found." });

            const dispatchDays = [
                transit.dispatch.sunday,
                transit.dispatch.monday,
                transit.dispatch.tuesday,
                transit.dispatch.wednesday,
                transit.dispatch.thursday,
                transit.dispatch.friday,
                transit.dispatch.saturday
            ],
            dispatchDuration = transit.dispatch.duration,
            transitDays = [
                transit.transit.sunday,
                transit.transit.monday,
                transit.transit.tuesday,
                transit.transit.wednesday,
                transit.transit.thursday,
                transit.transit.friday,
                transit.transit.saturday
            ],
            transitDuration = transit.transit.duration,
            deliveryDays = [
                transit.delivery.sunday,
                transit.delivery.monday,
                transit.delivery.tuesday,
                transit.delivery.wednesday,
                transit.delivery.thursday,
                transit.delivery.friday,
                transit.delivery.saturday
            ],
            deliveryDuration = transit.delivery.duration;

            const tempFrom = parseInt(module.deliveryWindow.from),
            tempTo = parseInt(module.deliveryWindow.to);

            const tempDispatchDate = momentDate;
            tempDispatchDate.add(dispatchDuration, 'days');

            

            // IF > 17:00 THEN CHECK DAY STATUS FOR WHICH PART? (dispatch? delivery? transit?) 
            if(tempDispatchDate.isBetween(tempFrom, tempTo, true) && dispatchDays[tempDispatchDate.day()] === 1) { 
                initTime = tempDispatchDate; 
                initTimeCopy = tempDispatchDate;
            } else {
                let found = false;
                let tempInitTime = moment(`${params.purchaseDate.split('T')[0]}T0900`, 'DDMMYYYYTHHmm');

                const tempTime = parseInt(tempInitTime.format('HHmm').toString());

                do {
                    tempInitTime.add(1, 'days');
                    
                    if(tempTime.isBetween(tempFrom, tempTo, true) && dispatchDays[tempInitTime.day()] === 1){
                        found = true;
                        initTime = tempInitTime;
                        initTimeCopy = tempInitTime;
                    }

                } while(!found);

            }


            for(let transitDurationCount = 0; transitDurationCount <= transitDuration; transitDurationCount++) {
                const predDay = initTime;

                let foundAfterDispatchDay = false,
                    foundAfterTransitDay = false,
                    foundDeliveryDay = false;
    
                for(let dispatchDurationCount = 0; dispatchDurationCount <= dispatchDuration; dispatchDurationCount++) {
                    predDay.add(dispatchDurationCount, 'days');
                    if(!parseInt(predDay.format('HHmm')).isBetween(tempFrom, tempTo, true) && dispatchDays[predDay.day()] !== 1){
                        do {
                            predDay.add(1, 'days');
                            
                            if(parseInt(predDay.format('HHmm')).isBetween(tempFrom, tempTo, true) && dispatchDays[predDay.day()] === 1){
                                foundAfterDispatchDay = true;
                            }
        
                        } while(!foundAfterDispatchDay);
                    } else {
                        dispatchDurationCount++;
                    }
                }


                predDay.add(transitDurationCount, 'days');

                if(!parseInt(predDay.format('HHmm')).isBetween(tempFrom, tempTo, true) && transitDays[predDay.day()] !== 1){
                    do {
                        predDay.add(1, 'days');
                        
                        if(parseInt(predDay.format('HHmm')).isBetween(tempFrom, tempTo, true) && transitDays[predDay.day()] === 1){
                            foundAfterTransitDay = true;
                        }
    
                    } while(!foundAfterTransitDay);
                }


                for(let deliveryDurationCount = 0; deliveryDurationCount <= deliveryDuration; deliveryDurationCount++) {
                    predDay.add(deliveryDurationCount, 'days');
                
                    if(!parseInt(predDay.format('HHmm')).isBetween(tempFrom, tempTo, true) && deliveryDays[predDay.day()] !== 1){
                        
                        do {
                            predDay.add(1, 'days');
                            if(parseInt(predDay.format('HHmm')).isBetween(tempFrom, tempTo, true) && deliveryDays[predDay.day()] === 1){
                                foundDeliveryDay = true;
                            }
        
                        } while(!foundDeliveryDay);

                        
                    }
                }


                    const formattedPredDay = predDay.format('DDMMYYYY');

                    predDates.push({
                        from: `${formattedPredDay}T${module.deliveryWindow.from}`,
                        to: `${formattedPredDay}T${module.deliveryWindow.to}`
                    }); 
            }
            

            res.status(200).json({ purchaseDate: params.purchaseDate, predictableDates: predDates });

    } catch (err) {
        res.status(400).json({success: false, message: err.message});
    }
   
}
/**
 * {
 *     "code":"DHL",
 *     "services":[
 *        {
 *           "name":"OneDay",
 *           "transitTimes":[
 *              {
 *                 "from":"PL",
 *                 "to":"PL",
 *                 "dispatch":{
 *                    "duration":0,
 *                    "monday":true,
 *                    "tuesday":true,
 *                    "wednesday":true,
 *                    "thursday":true,
 *                    "friday":false,
 *                    "saturday":true,
 *                    "sunday":false
 *                 },
 *                 "transit":{
 *                    "duration":0,
 *                    "monday":true,
 *                    "tuesday":true,
 *                    "wednesday":true,
 *                    "thursday":true,
 *                    "friday":false,
 *                    "saturday":true,
 *                    "sunday":false
 *                 },
 *                 "delivery":{
 *                    "duration":1,
 *                    "monday":true,
 *                    "tuesday":true,
 *                    "wednesday":true,
 *                     "thursday":true,
 *                     "friday":false,
 *                    "saturday":false,
 *                    "sunday":false
 *                 }
 *              }
 *           ]
 *        },
 *        {
 *           "name":"Standard",
 *           "transitTimes":[
 *              {
 *                 "from":"PL",
 *                 "to":"PL",
 *                 "dispatch":{
 *                    "duration":1,
 *                    "monday":true,
 *                    "tuesday":true,
 *                    "wednesday":true,
 *                    "thursday":true,
 *                    "friday":false,
 *                    "saturday":true,
 *                    "sunday":false
 *                 },
 *                 "transit":{
 *                    "duration":1,
 *                    "monday":true,
 *                    "tuesday":true,
 *                    "wednesday":true,
 *                    "thursday":true,
 *                    "friday":false,
 *                    "saturday":true,
 *                    "sunday":false
 *                 },
 *                 "delivery":{
 *                    "duration":1,
 *                    "monday":true,
 *                    "tuesday":true,
 *                    "wednesday":true,
 *                    "thursday":true,
 *                    "friday":false,
 *                    "saturday":false,
 *                    "sunday":false
 *                 }
 *              },
 *              { 
 *                 "from":"PL",
 *                 "to":"DE",
 *                 "dispatch":{
 *                    "duration":1,
 *                    "monday":true,
 *                    "tuesday":true,
 *                    "wednesday":true,
 *                    "thursday":true,
 *                    "friday":true,
 *                    "saturday":true,
 *                    "sunday":false
 *                 },
 *                 "transit":{
 *                    "duration":2,
 *                    "monday":true,
 *                    "tuesday":true,
 *                    "wednesday":true,
 *                    "thursday":true,
 *                    "friday":false,
 *                    "saturday":true,
 *                    "sunday":false
 *                 },
 *                 "delivery":{
 *                    "duration":1,
 *                    "monday":true,
 *                    "tuesday":true,
 *                    "wednesday":true,
 *                    "thursday":true,
 *                    "friday":false,
 *                    "saturday":false,
 *                    "sunday":false
 *                 }
 *              }
 *           ]
 *        }
 *     ],
 *     "deliveryWindow":{
 *        "from":"0900",
 *        "to":"1700"
 *     }
 * }
*/

exports.create = async (req, res) => {
    
    const role = await Role.findById(req.user.role);

    if( role.name !== "ADMIN") {

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

/**
 * # CREATE SERVICE AND ADD TO EXISTING MODULE #
 *  INFO: we can update single value or multiple values
 *  INFO 2: DO NOT UPTADE SERVICES HERE, USE PUT /services/:id INSTEAD
 * 
 * Request body:
 * Ex.1.
 *  {
 *      "code": "GLS"   
 *  }
 * 
 * Ex. 2.
 *  {
 *     "deliveryWindow":{
 *        "from":"0900",
 *        "to":"1700"
 *     }
 *  }
 * *
 * Ex. 3.
 *  {
 *     "code": "GLS",   
 *     "deliveryWindow":{
 *        "from":"0900",
 *        "to":"1700"
 *     }
 *  }
 * 
 */

exports.update = async (req, res) => {
    const role = await Role.findById(req.user.role);

    if( role.name !== "ADMIN") {
        res.status(401).json({ message: "Unauthorized Access" });
    } else {
        
        try {
            const data = req.body;

            const module = await Module.findOneAndUpdate({ _id: req.params.id }, data, { new: true });
            res.status(200).json({ success: true, data: module});
        } catch (err) {
            res.status(400).json({success: false, message: err.message});
        }
    }
}

exports.delete = async (req, res) => {
    const role = await Role.findById(req.user.role);

    if( role.name !== "ADMIN") {
        res.status(401).json({ message: "Unauthorized Access" });
    } else {
        
        try {
            const module = await Module.findById(req.params.id);

            if(module !== null) {
                await module.deleteOne();
                res.status(200).json({ success: true });
            } 
            else {
                res.status(404).json({success: false, message: "Module doesn't exist"});
            } 

            
       } catch(err) {
            res.status(400).json({success: false, message: err.message});
       }

    }

}

Number.prototype.isBetween = function(a, b, inclusive) {
    var min = Math.min(a, b),
      max = Math.max(a, b);
  
    return inclusive ? this >= min && this <= max : this > min && this < max;
}