import Candidate from "../modals/Candidate/Candidate";
import CandidateReasons from "../modals/CandidateReasons/CandidateReasons";
import CandidateTags from "../modals/CandidateTags/CandidateTags";
import Client from "../modals/Client/Client";
import Designation from "../modals/Designation/Designation";
import Education from "../modals/Eduction/Education";
import ReasonsForLeaving from "../modals/ReasonForLeaving/ReasonForLeaving";
import Region from "../modals/Region/Region";
import Tag from "../modals/Tag/Tag";
import Token from "../modals/Token/Token";
import User from "../modals/User/User";

async function syncdatabase() {
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
}
export default syncdatabase;