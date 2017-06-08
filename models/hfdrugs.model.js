/**
 * Created by Linhnv on 08-Jun-17.
 */

module.exports = function(mongoose){
    return [
        {
            "hf_name" : {type: String},
            "hf_id" : {type: String},
            "hf_drugs" : {type: Array},
            "drug_name": {type: String},
            "drug_code": {type: String},
            "drug_description": {type: String},
            "drug_id": {type: String},
            "drug_asl": {type: Number},
            "drug_eop": {type: Number},
            "drug_abs": {type: Number}

        } , {
            timestamps: true,
            createdby: true,
            updatedby: true
        }]
};