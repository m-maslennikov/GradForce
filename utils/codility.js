const request = require('request-promise');
const Skill = require('../models/skill');
const User = require('../models/user');

const auth = `Bearer ${process.env.CODILITY_API_KEY}`;

const get = async (uri) => {
  const options = {
    uri,
    json: true,
    method: 'GET',
    headers: {
      Authorization: auth,
    },
  };
  try {
    const result = await request(options);
    return result;
  } catch (error) {
    throw new Error(`Something wrong with Codility Get:\n ${error}`);
  }
};


const post = async (uri) => {
  const options = {
    uri,
    json: true,
    method: 'POST',
    headers: {
      Authorization: auth,
    },
  };
  try {
    const result = await request(options);
    return result;
  } catch (error) {
    throw new Error(`Something wrong with Codility Post:\n ${error}`);
  }
};

const syncSkills = async () => {
  const options = {
    uri: 'https://codility.com/api/tests',
    json: true,
    headers: {
      'User-Agent': 'Request-Promise',
      Authorization: auth,
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
    const user = await User.findOne({ email });
    const skill = await Skill.findById(skillId);
    const generateTestOptions = {
      method: 'POST',
      uri: skill.invite_url,
      json: true,
      headers: {
        'User-Agent': 'Request-Promise',
        Authorization: auth,
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
    const generateTestResult = await request(generateTestOptions);

    const getSessionOptions = {
      method: 'GET',
      uri: generateTestResult.candidates[0].session_url,
      json: true,
      headers: {
        'User-Agent': 'Request-Promise',
        Authorization: auth,
      },
    };
    const getSessionResult = await request(getSessionOptions);

    return getSessionResult;
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
      Authorization: auth,
    },
  };

  try {
    const result = await request(options);
    return result;
  } catch (error) {
    throw new Error(`Something wrong with Codility account status:\n ${error}`);
  }
};

const getTestsCount = async () => {
  const options = {
    uri: 'https://codility.com/api/tests/',
    json: true,
    headers: {
      'User-Agent': 'Request-Promise',
      Authorization: auth,
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
module.exports.post = post;
module.exports.getAccountStatus = getAccountStatus;
module.exports.getTestsCount = getTestsCount;
module.exports.syncSkills = syncSkills;
module.exports.generateTestLink = generateTestLink;
