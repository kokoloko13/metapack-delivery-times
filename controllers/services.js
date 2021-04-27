const Module = require('../models/module');
const Service = require('../models/service');
const Role = require('../models/role');
const mongoose = require('mongoose');

const isAdmin = async (roleId) => {
    const userRole = await Role.findById(roleId);

    return await userRole.name;
}


/**
 * # CREATE SERVICE AND ADD TO EXISTING MODULE #
 * request body:
 * {
 *      moduleIds: [
 *              6085c06f3f86d13fcc6a38ae
 *      ],
 *      services:[
 *          {
 *              "name":"OneDay",
 *               "transitTimes":[
 *                    {
 *                   "from":"PL",
 *                   "to":"PL",
 *                   "dispatch":{
 *                      "duration":0,
 *                      "monday":true,
 *                      "tuesday":true,
 *                      "wednesday":true,
 *                      "thursday":true,
 *                      "friday":false,
 *                      "saturday":true,
 *                      "sunday":false
 *                  },
 *                  "transit":{
 *                      "duration":0,
 *                      "monday":true,
 *                      "tuesday":true,
 *                      "wednesday":true,
 *                      "thursday":true,
 *                      "friday":false,
 *                      "saturday":true,
 *                      "sunday":false
 *                  },
 *                  "delivery":{
 *                      "duration":1,
 *                      "monday":true,
 *                      "tuesday":true,
 *                      "wednesday":true,
 *                      "thursday":true,
 *                      "friday":false,
 *                      "saturday":false,
 *                      "sunday":false
 *                  }
 *                  }
 *              ]
 *          }     
 *      ]
 * }
 * 
 */

exports.create = async (req, res) => {
    const userRole = await isAdmin(req.user.role);

    if( userRole !== "ADMIN" ) {

        res.status(401).json({ message: "Unauthorized Access" });

    } else {

        try {

            const data = req.body;

            const moduleIds = data.moduleIds.map(moduleId =>  mongoose.Types.ObjectId(moduleId));
            const modules = await Module.find({'_id': { $in: moduleIds }});

            if(modules.length > 0){
               if(data.services.length > 0) {
                    modules.forEach( module => {
                        data.services.forEach( service => {
                            const tempService = new Service(service);
                            tempService.save();
        
                            module.services.push(tempService);
                        });

                        module.save();
                    });
                } else {
                    res.status(400).json({success: false, message: "Services property cannot be empty."});
                }
            } else {
                res.status(404).json({success: false, message: "Modules not found."});
            }
            
            res.status(201).json({ success: true, data: modules });
       } catch(err) {
            res.status(400).json({success: false, message: err.message});
       }
       
    }
}

/**
 * # UPDATE SERVICE #
 * request body:
 * {
 *      serviceId: 6085c06f3f86d13fcc6a38ae,
 *      service:
 *          {
 *              "name":"OneDay",
 *               "transitTimes":[
 *                    {
 *                   "from":"PL",
 *                   "to":"PL",
 *                   "dispatch":{
 *                      "duration":0,
 *                      "monday":true,
 *                      "tuesday":true,
 *                      "wednesday":true,
 *                      "thursday":true,
 *                      "friday":false,
 *                      "saturday":true,
 *                      "sunday":false
 *                  },
 *                  "transit":{
 *                      "duration":0,
 *                      "monday":true,
 *                      "tuesday":true,
 *                      "wednesday":true,
 *                      "thursday":true,
 *                      "friday":false,
 *                      "saturday":true,
 *                      "sunday":false
 *                  },
 *                  "delivery":{
 *                      "duration":1,
 *                      "monday":true,
 *                      "tuesday":true,
 *                      "wednesday":true,
 *                      "thursday":true,
 *                      "friday":false,
 *                      "saturday":false,
 *                      "sunday":false
 *                  }
 *                  }
 *              ]
 *          }     
 * }
 * 
 */

exports.update = async (req, res) => {
    const userRole = await isAdmin(req.user.role);

    if( userRole !== "ADMIN" ) {
        res.status(401).json({ message: "Unauthorized Access" });
    } else {
        
        try {
            const data = req.body;

            const service = await Service.updateOne({ _id: data.serviceId }, { $set: data.service });
            res.status(200).json({ success: true, data: service});
        } catch (err) {
            res.status(400).json({success: false, message: err.message});
        }
    }
}

exports.delete = async (req, res) => {
    const userRole = await isAdmin(req.user.role);

    if( userRole !== "ADMIN" ) {
        res.status(401).json({ message: "Unauthorized Access" });
    } else {
        
        try {
            const service = await Service.findByIdAndDelete(req.params.id, async (err, service) => {
                if(err){
                    throw new Error(err);
                } else {
                    module
                    await Module.updateMany({"services":req.params.id}, { $pullAll: {services: [req.params.id] }});
                }
            });

            res.status(200).json({ success: true });
       } catch(err) {
            res.status(400).json({success: false, message: err.message});
       }

    }

}