const http = require('http');
const Koa = require('koa');
const cors = require('@koa/cors');
const uuid = require('uuid');
const faker = require('faker');

const app = new Koa();

app.use(cors());

let previousRequestTs = Date.now();

const listOfRecentPosts  = (now) => {
  const maxAge = now - previousRequestTs;
  const messageAge = Math.floor(Math.random() * maxAge);
  return {
    id: uuid.v4(),
    author_id: faker.internet.email(),
    title: faker.random.words(4),
    author: faker.internet.username(),
    avatar: faker.internet.avatar(),
    image: faker.internet.url() ,
    created: now - messageAge
};

  const listOfRecentCommentsToThePost = (now) => {
  };



  const listOfRecentPosts = () => {
  const timestamp = Date.now();
  const messages = [
    listOfRecentPosts(timestamp),
    listOfRecentPosts(timestamp),
  ];
  previousRequestTs = timestamp;
  return { status: 'ok', timestamp, messages };
};

app.use((ctx) => {
  if (ctx.path !== '/messages/unread') {
    ctx.response.status = 404;
    return;
  }

  ctx.body = listOfRecentPosts();
  ctx.status = 200;
});

http.createServer(app.callback()).listen(process.env.PORT || 5555, () => console.log('Server is working'));
