/**
 * Created by Linhnv on 07-Jun-17.
 */
module.exports = function(mongoose){
return [
{
    "sms_received" : {type: String},
    "sms_sent" : {type: String},
    "content" : {type: String},
    "from" : {type: String},
    "id" : {type: String},
} , {
            timestamps: true,
            createdby: true,
            updatedby: true
        }]
};