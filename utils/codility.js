const request = require('request-promise');
const Skill = require('../models/skill');
const User = require('../models/user');

const auth = `Bearer ${process.env.CODILITY_API_KEY}`;
const auth2 = 'Bearer ckPiILjwLNFjVgsOpXb9';

const get = (apiPath, callback) => {
  const rootURL = 'https://codility.com/api/';
  const options = {
    url: rootURL + apiPath,
    json: true,
    method: 'GET',
    headers: {
      Authorization: auth,
    },
  };

  request(options, (error, { body }) => {
    if (error) {
      callback('Unable to connect to codility', undefined);
    } else {
      callback(undefined, body);
    }
  });
};

const syncSkills = async () => {
  const options = {
    uri: 'https://codility.com/api/tests',
    json: true,
    headers: {
      'User-Agent': 'Request-Promise',
      Authorization: auth2,
    },
  };

  try {
    const result = await request(options);
    const skills = result.results;

    skills.forEach(async (element) => {
      const found = await Skill.findOne({ codility_test_id: element.id });
      if (!found) {
        const skill = new Skill({
          url: element.url,
          name: element.name,
          public_test_link: element.public_test_link,
          invite_url: element.invite_url,
          sessions_url: element.sessions_url,
          codility_test_id: element.id,
        });
        await skill.save();
      }
    });
  } catch (error) {
    throw new Error(`Something wrong with Codility skills sync:\n ${error}`);
  }
};

const generateTestLink = async (email, skillId) => {
  try {
    // console.log(`Email is: ${email}`);
    const user = await User.findOne({ email });
    const skill = await Skill.findById(skillId);
    // console.log(`Invite URL is: ${skill.invite_url}`);
    const options = {
      method: 'POST',
      uri: skill.invite_url,
      json: true,
      headers: {
        'User-Agent': 'Request-Promise',
        Authorization: auth2,
      },
      body: {
        candidates: [{
          id: user._id,
          // redirect_url: 'http://localhost:3001/profile',
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
        }],
        rpt_emails: ['maxmas@7wolf.org'],
      },
    };

    // console.log(`Options for ${options.body.candidates[0].id} are: \n`);
    const result = await request(options);
    // console.log(result);
    await user.skills.push({
      skillId: skill._id,
      name: skill.name,
      test_link: result.candidates[0].test_link,
      session_url: result.candidates[0].session_url,
    });
    await user.save();
  } catch (error) {
    throw new Error(`Something wrong with Codility invitation:\n ${error}`);
  }
};

const getAccountStatus = async () => {
  const options = {
    uri: 'https://codility.com/api/account/credit-level',
    json: true,
    headers: {
      'User-Agent': 'Request-Promise',
      Authorization: auth2,
    },
  };

  try {
    const result = await request(options);
    return result;
  } catch (error) {
    throw new Error(`Something wrong with Codility account status:\n ${error}`);
  }
};

module.exports.get = get;
module.exports.getAccountStatus = getAccountStatus;
module.exports.syncSkills = syncSkills;
module.exports.generateTestLink = generateTestLink;
