import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { InputError, AccessError } from './error.js';
import {
  getEmailFromAuthorization,
  getPosts,
  login,
  logout,
  register,
  save,
  createPost,
  savePost,
  sendMessage,
  deletePost,
  joinPost,
  leavePost,
  hidePost,
} from './service';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

const catchErrors = (fn) => async (req, res) => {
  try {
    await fn(req, res);
    save();
  } catch (err) {
    if (err instanceof InputError) {
      res.status(400).send({ error: err.message });
    } else if (err instanceof AccessError) {
      res.status(403).send({ error: err.message });
    } else {
      console.log(err);
      res.status(500).send({ error: 'A system error ocurred' });
    }
  }
};

/***************************************************************
                       Auth Function
***************************************************************/

const authed = (fn) => async (req, res) => {
  const email = getEmailFromAuthorization(req.header('Authorization'));
  await fn(req, res, email);
};

app.post(
  '/admin/auth/login',
  catchErrors(async (req, res) => {
    const { email, password } = req.body;
    const token = await login(email, password);
    return res.json({ token });
  })
);

app.post(
  '/admin/auth/register',
  catchErrors(async (req, res) => {
    const { email, password, name, dob, age, location } = req.body;
    const token = await register(email, password, name, dob, age, location);
    return res.json({ token });
  })
);

app.post(
  '/admin/auth/logout',
  catchErrors(
    authed(async (req, res, email) => {
      await logout(email);
      return res.json({});
    })
  )
);

/***************************************************************
                       Post Functions
***************************************************************/

app.get(
  '/usr/post/all',
  catchErrors(
    authed(async (req, res, email) => {
      return res.json({ posts: getPosts(email) });
    })
  )
);

app.put(
  '/usr/post/create',
  catchErrors(
    authed(async (req, res, email) => {
      const { postId, title, location, time, description, max_members, requirements } = req.body;

      await createPost(email, postId, title, location, time, description, max_members, requirements);
      return res.json({});
    })
  )
);

app.delete(
  '/usr/post/delete',
  catchErrors(
    authed(async (req, res, email) => {
      const { postId } = req.body;
      await deletePost(email, postId);
      return res.json({});
    })
  )
);

app.post(
  '/usr/post/join',
  catchErrors(
    authed(async (req, res, email) => {
      const { postId } = req.body;
      await joinPost(email, postId);
      return res.json({});
    })
  )
);

app.post(
  '/usr/post/leave',
  catchErrors(
    authed(async (req, res, email) => {
      const { postId } = req.body;
      await leavePost(email, postId);
      return res.json({});
    })
  )
);

app.post(
  '/usr/post/save',
  catchErrors(
    authed(async (req, res, email) => {
      const { postId } = req.body;
      await savePost(email, postId);
      return res.json({});
    })
  )
);

app.post(
  '/usr/post/hide',
  catchErrors(
    authed(async (req, res, email) => {
      const { postId } = req.body;
      await hidePost(email, postId);
      return res.json({});
    })
  )
);

/***************************************************************
                       Message Functions
***************************************************************/

app.get(
  '/usr/message/all',
  catchErrors(
    authed(async (req, res, email) => {
      return res.json({ messages: getMessages(email) });
    })
  )
);

app.post(
  '/usr/message/send',
  catchErrors(
    authed(async (req, res, email) => {
      const { postId, time, message } = req.body;
      await sendMessage(email, postId, time, message);
      return res.json({});
    })
  )
);

/***************************************************************
                     Add Friend Functions
***************************************************************/

app.post(
  '/usr/friend/add',
  catchErrors(
    authed(async (req, res, email) => {
      const { friendEmail } = req.body;
      await addFriend(email, friendEmail);
      return res.json({});
    })
  )
);

app.get(
  '/usr/friend/all',
  catchErrors(
    authed(async (req, res, email) => {
      return res.json({ friends: getFriends(email) });
    })
  )
);

/***************************************************************
                       Running Server
***************************************************************/

app.get('/', (req, res) => res.redirect('/docs'));

const configData = JSON.parse(fs.readFileSync('../frontend/src/config.json'));
const port = 'BACKEND_PORT' in configData ? configData.BACKEND_PORT : 5000;

const server = app.listen(port, () => {
  console.log(`Backend is now listening on port ${port}!`);
  console.log(`For API docs, navigate to http://localhost:${port}`);
});

export default server;
