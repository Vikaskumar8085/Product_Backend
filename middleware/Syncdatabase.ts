import Candidate from "../modals/Candidate/Candidate";
import CandidateReasons from "../modals/CandidateReasons/CandidateReasons";
import CandidateTags from "../modals/CandidateTags/CandidateTags";
import Client from "../modals/Client/Client";
import Degree from "../modals/DegreeProgram/Degree";
import Designation from "../modals/Designation/Designation";
import Education from "../modals/Eduction/Education";
import ReasonsForLeaving from "../modals/ReasonForLeaving/ReasonForLeaving";
import Region from "../modals/Region/Region";
import Tag from "../modals/Tag/Tag";
import Token from "../modals/Token/Token";
import User from "../modals/User/User";
import ClientSecurity from "../modals/ClientSecurity/ClientSecurity";

async function syncdatabase() {
  await ClientSecurity.sync();
  await User.sync();
  await Token.sync();
  await Tag.sync();
  await ReasonsForLeaving.sync();
  await Designation.sync();
  await Region.sync();
  await Candidate.sync();
  await CandidateTags.sync();
  await CandidateReasons.sync();
  await Education.sync();
  await Client.sync();
  await Degree.sync();
}
export default syncdatabase;
