module.exports = function(mongoose){
    return [{
    name: {type: String},
    phone:   {type: String},
    reporting_center: {type: String},
    type: {type: String},
    person: {type: String},
    person_mobile: {type: String},
    vdc: {type: String},
    active: {type: Boolean},
    notes: {type: Boolean}
}, {
    timestamps: true,
    createdby: true,
    updatedby: true
}]
};
