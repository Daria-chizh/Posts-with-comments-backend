const http = require('http');
const Koa = require('koa');
const cors = require('@koa/cors');
const uuid = require('uuid');
const faker = require('faker');

const POST_COUNT = 3;

const generatePostComment = (postId) => ({
  id: uuid.v4(),
  post_id: postId,
  author_id: faker.datatype.number(),
  author: faker.internet.userName(),
  avatar: faker.internet.avatar(),
  content: faker.random.words(10),
  created: faker.date.past(),
});

const generatePost = (id) => ({
  id,
  author_id: faker.datatype.number(),
  title: faker.random.words(4),
  author: faker.internet.userName(),
  avatar: faker.internet.avatar(),
  image: faker.image.cats(),
  created: faker.date.past(),
  comments: [
    generatePostComment(id),
    generatePostComment(id),
    generatePostComment(id)
  ],
});

const generatePosts = () => {
  const res = [];
  for (let id = 1; id <= POST_COUNT; id++) {
    res.push(generatePost(id));
  }
  return res;
};

const posts = generatePosts();

const app = new Koa();

app.use(cors());

app.use((ctx) => {
  if (ctx.path === '/posts/latest') {
    ctx.body = {
      status: 'ok',
      data: posts.map(({ comments, ...post }) => post),
    };
    ctx.status = 200;
    return;
  }

  const match = ctx.path.match(/\/posts\/(\d+)\/comments\/latest/);
  if (match) {
    const postId = Number(match[1]);
    const post = posts.find(({ id }) => id === postId);

    ctx.body = {
      status: 'ok',
      data: post.comments,
    };
    ctx.status = 200;
    return;
  }

  ctx.response.status = 404;
});

http.createServer(app.callback()).listen(process.env.PORT || 5555, () => console.log('Server is working'));
