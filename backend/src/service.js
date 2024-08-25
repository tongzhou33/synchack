import fs from 'fs';
import jwt from 'jsonwebtoken';
import AsyncLock from 'async-lock';
import { InputError, AccessError } from './error.js';

const lock = new AsyncLock();

const JWT_SECRET = 'Bananallamasquad3421';
const DATABASE_FILE = './database.json';
const POSTCODE_FILE = '../assets/postcodes.json';

/***************************************************************
                       State Management
***************************************************************/

let admins = {};
let posts = {};
let postcodes = {};
let postIds = [];

const sessionTimeouts = {};

const update = (admins) =>
  new Promise((resolve, reject) => {
    lock.acquire('saveData', () => {
      try {
        fs.writeFileSync(
          DATABASE_FILE,
          JSON.stringify(
            {
              admins,
              posts,
              postIds,
            },
            null,
            2
          )
        );
        resolve();
      } catch {
        reject(new Error('Writing to database failed'));
      }
    });
  });

export const save = () => update(admins);
export const reset = () => {
  update({});
  admins = {};
};

try {
  const data = JSON.parse(fs.readFileSync(DATABASE_FILE));
  admins = data.admins;
  posts = data.posts;
  postIds = data.postIds;

  const postcodes = JSON.parse(fs.readFileSync(POSTCODE_FILE));
} catch {
  console.log('WARNING: No database found, create a new one');
  save();
}

/***************************************************************
                       Helper Functions
***************************************************************/

export const userLock = (callback) =>
  new Promise((resolve, reject) => {
    lock.acquire('userAuthLock', callback(resolve, reject));
  });

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

const getLatLon = (suburb) => {
  for (let postcode in postcodes) {
    if (postcode.suburb.toLowerCase() === suburb.toLowerCase()) {
      return {
        lat: postcode.lat,
        lon: postcode.lon,
      };
    }
  }

  throw new InputError('Invalid suburb');
};

/***************************************************************
                       Auth Functions
***************************************************************/

export const getEmailFromAuthorization = (authorization) => {
  try {
    const token = authorization.replace('Bearer ', '');
    const { email } = jwt.verify(token, JWT_SECRET);
    if (!(email in admins)) {
      throw new AccessError('Invalid Token');
    }
    return email;
  } catch {
    throw new AccessError('Invalid token');
  }
};

export const login = (email, password) =>
  userLock((resolve, reject) => {
    if (email in admins) {
      if (admins[email].password === password) {
        resolve(jwt.sign({ email }, JWT_SECRET, { algorithm: 'HS256' }));
      }
    }
    reject(new InputError('Invalid username or password'));
  });

export const logout = (email) =>
  userLock((resolve, reject) => {
    admins[email].sessionActive = false;
    resolve();
  });

export const register = (email, password, name, dob, age, location) =>
  userLock((resolve, reject) => {
    if (email in admins) {
      return reject(new InputError('Email address already registered'));
    }
    admins[email] = {
      name,
      password,
      dob,
      age,
      location,
      likes: [],
      friends: [],
      posts: [],
    };
    const token = jwt.sign({ email }, JWT_SECRET, { algorithm: 'HS256' });
    resolve(token);
  });

/***************************************************************
                       Post Functions
***************************************************************/
export const createPost = (email, postId, title, location, time, description, max_members, requirements) => {
  userLock((resolve, reject) => {
    if (email in admins) {
      admins[email].posts.push(postId);
      posts[postId] = {
        id: postId,
        admin: email,
        title,
        location,
        time,
        description,
        requirements,
        max_members,
        members: [email],
        messages: [],
        saved: [],
        visibility: true,
      };

      postIds.push(postId);
      resolve();
    }

    reject(new AccessError('Invalid email'));
  });
};

export const getPosts = (email) => {
  if (email in admins) {
    let arrayPosts = [];

    for (const postId of postIds) {
      arrayPosts.push(posts[postId]);
    }

    return arrayPosts;
  }

  throw new AccessError('Invalid email');
};

export const joinPost = (email, postId) => {
  userLock((resolve, reject) => {
    if (email in admins && postId in posts) {
      posts[postId].members.push(email);
      admins[email].posts.push(postId);
      resolve();
    }

    reject(new AccessError('Invalid email or post'));
  });
};

export const leavePost = (email, postId) => {
  userLock((resolve, reject) => {
    if (email in admins && postId in post) {
      admins[email].posts = admins[email].posts.filter((post) => post !== postId);

      posts[postId].members = posts[postId].members.filter((members) => members !== email);

      resolve();
    }

    reject(new AccessError('Invalid email or post'));
  });
};

export const deletePost = (email, postId) => {
  userLock((resolve, reject) => {
    if (email in admins && postId in posts) {
      if (posts[postId].admin === email) {
        for (let member of posts[postId].members) {
          admins[member].posts = admins[member].posts.filter((post) => post !== postId);
        }

        delete posts[postId];
        postIds = postIds.filter((id) => id !== postId);
        resolve();
      }

      reject(new AccessError('User is not admin of post'));
    }

    reject(new AccessError('Invalid email or post'));
  });
};

export const hidePost = (email, postId) => {
  userLock((resolve, reject) => {
    if (email in admins && postId in posts) {
      if (posts[postId].admin === email) {
        posts[postId].visibility = false;
        resolve();
      }

      reject(new AccessError('User is not admin of post'));
    }

    reject(new AccessError('Invalid email or post'));
  });
};

export const savePost = (email, postId) => {
  userLock((resolve, reject) => {
    if (email in admins && postId in posts) {
      admins[email].saved.push(postId);
      resolve();
    }

    reject(new AccessError('Invalid email or post'));
  });
};

/***************************************************************
                     Message Functions
***************************************************************/
export const sendMessage = (email, postId, time, message) => {
  userLock((resolve, reject) => {
    if (email in admins && postId in posts) {
      posts[postId].messages.push({
        email,
        time,
        message,
      });

      resolve();
    }

    reject(new AccessError('Invalid email or post'));
  });
};

export const getMessages = (postId) => {
  if (postId in posts) {
    return posts[postId].messages;
  }

  throw new AccessError('Invalid post');
};

/***************************************************************
                     Add Friend Functions
***************************************************************/
export const addFriend = (email, friendEmail) => {
  userLock((resolve, reject) => {
    if (email in admins && friendEmail in admins) {
      admins[email].friends.push(friendEmail);
      resolve();
    }

    reject(new AccessError('Invalid email or friend email'));
  });
};

export const removeFriend = (email, friendEmail) => {
  userLock((resolve, reject) => {
    if (email in admins && friendEmail in admins) {
      admins[email].friends = admins[email].friends.filter((friend) => friend !== friendEmail);
      resolve();
    }

    reject(new AccessError('Invalid email or friend email'));
  });
};

export const getFriends = (email) => {
  if (email in admins) {
    let friends = [];
    for (let friend of admins[email].friends) {
      friends.push(admins[friend].name);
    }
    return friends;
  }

  throw new AccessError('Invalid email');
};

/***************************************************************
                    Search Post Functions
***************************************************************/

export const searchPosts = (email, search) => {
  if (!email in admins) {
    throw new AccessError('Invalid email');
  }

  const searchWords = search.split(' ');

  const filteredPosts = posts.filter((post) => {
    for (let word of searchWords) {
      if (
        post.title.includes(word) ||
        post.location.includes(word) ||
        post.description.includes(word) ||
        post.requirements.includes(word)
      ) {
        return true;
      }
    }

    return false;
  });

  // Sort the posts by the distance from the user
  // If the distance is the same, sort by the time it was posted
  filteredPosts = filteredPosts.sort((a, b) => {
    const latLonUser = getLatLon(admins[email].location);
    const latLonA = getLatLon(postcodes[a.location]);
    const latLonB = getLatLon(postcodes[b.location]);

    const distanceA = getDistanceFromLatLonInKm(latLonUser.lat, latLonUser.lon, latLonA.lat, latLonA.lon);

    const distanceB = getDistanceFromLatLonInKm(latLonUser.lat, latLonUser.lon, latLonB.lat, latLonB.lon);

    return distanceA - distanceB === 0 ? a.time - b.time : distanceA - distanceB;
  });

  return filteredPosts;
};
