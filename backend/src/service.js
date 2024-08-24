import fs from 'fs';
import jwt from 'jsonwebtoken';
import AsyncLock from 'async-lock';
import { InputError, AccessError } from './error';

const lock = new AsyncLock();

const JWT_SECRET = 'Bananallamasquad3421';
const DATABASE_FILE = './database.json';
const POSTCODE_FILE = '../assets/postcodes.json';

/***************************************************************
                       State Management
***************************************************************/

let admins = {};
let posts = [];
let postcodes = {};

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

export const register = (email, password, name, dob, age) =>
  userLock((resolve, reject) => {
    if (email in admins) {
      return reject(new InputError('Email address already registered'));
    }
    admins[email] = {
      name,
      password,
      dob,
      age,
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
export const createPost = (
  email,
  postId,
  title,
  location,
  time,
  description,
  max_members,
  requirements
) => {
  userLock((resolve, reject) => {
    if (email in admins) {
      admins[email].posts.push(postId);
      posts[postId] = {
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

      resolve();
    }

    reject(new AccessError('Invalid email'));
  });
};

export const getPosts = () => posts;

export const joinPost = (email, postId) => {
  userLock((resolve, reject) => {
    if (email in admins && postId in post) {
      admins[email].posts.push(postId);
      resolve();
    }

    reject(new AccessError('Invalid email or post'));
  });
};

export const leavePost = (email, postId) => {
  userLock((resolve, reject) => {
    if (email in admins && postId in post) {
      admins[email].posts = admins[email].posts.filter(
        (post) => post !== postId
      );

      posts[postId].members = posts[postId].members.filter(
        (members) => members !== email
      );

      resolve();
    }

    reject(new AccessError('Invalid email or post'));
  });
};

export const deletePost = (email, postId) => {
  userLock((resolve, reject) => {
    if (email in admins && postId in posts) {
      if (posts[postId].admin === email) {
        delete posts[postId];
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
      admins[email].friends = admins[email].friends.filter(
        (friend) => friend !== friendEmail
      );
      resolve();
    }

    reject(new AccessError('Invalid email or friend email'));
  });
};

export const getFriends = (email) => {
  if (email in admins) {
    return admins[email].friends;
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

  return filteredPosts;
};
