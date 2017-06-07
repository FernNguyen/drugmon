module.exports = function(mongoose){
    return [{
    hf_id:  String,
    hf_name: {type: String, required: true},
    hf_phone:   {type: String},
    hf_reporting_center: {type: String},
    hf_type: {type: String},
    contact_person: {type: String},
    municipality_name: {type: String},
    active: {type: Boolean}
}, {
    timestamps: true,
    createdby: true,
    updatedby: true
}]
};
