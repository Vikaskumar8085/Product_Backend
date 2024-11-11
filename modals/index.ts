// src/models/index.ts
import Candidate from './Candidate/Candidate';
// import Contact from './Contacts/Contact';
// import WorkExperience from './WorkExperience/WorkExperience';
// import Education from './Eduction/Education';
import Designation from './Designation/Designation';
import ReasonsForLeaving from './ReasonForLeaving/ReasonForLeaving';


// // Candidate and Contact Association
// Candidate.hasMany(Contact, { foreignKey: 'candidateId' });
// Contact.belongsTo(Candidate, { foreignKey: 'candidateId' });

// // Candidate and WorkExperience Association
// Candidate.hasOne(WorkExperience, { foreignKey: 'candidateId' });
// WorkExperience.belongsTo(Candidate, { foreignKey: 'candidateId' });

// // Candidate and Education Association
// Candidate.hasOne(Education, { foreignKey: 'candidateId' });
// Education.belongsTo(Candidate, { foreignKey: 'candidateId' });

// Candidate and Designation Association
Designation.hasMany(Candidate, { foreignKey: 'designationId' });
Candidate.belongsTo(Designation, { foreignKey: 'designationId' });

// Candidate and ReasonsForLeaving Association
Candidate.hasMany(ReasonsForLeaving, { foreignKey: 'candidateId' });
ReasonsForLeaving.belongsTo(Candidate, { foreignKey: 'candidateId' });
