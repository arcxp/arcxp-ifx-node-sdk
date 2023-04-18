const supertest = require('supertest');
const { createServer } = require('./server');

const stubbedMethod = (body) => {
  console.log('Method called with: ', body);
  return {
    status: 'good',
  };
};

const app = createServer(stubbedMethod);

describe('When the server receives a POST at /ifx/local/invoke', () => {
  it('Returns a 500 response when there is no body', async () => {
    await supertest(app)
      .post('/ifx/local/invoke')
      .expect(500);
  });

  it('Returns a 200 response when there is a body', async () => {
    const body = {
      key: 'story:update',
      body: {
        key1: 'value1',
      },
    };

    await supertest(app)
      .post('/ifx/local/invoke')
      .send(body)
      .expect(200);
  });
});

test('POST to unknown route returns a 404', async () => {
  await supertest(app)
    .post('/ifx/fake')
    .expect(404);
});
