const supertest = require('supertest');
const server = require('./server.js');
const knex = require('../data/dbConfig');

beforeAll(async () => {
  await knex.migrate.latest();
  await knex.seed.run();
});

afterAll(async () => {
  await knex.destroy();
});

describe('Successfull testing routes', () => {
  describe('Receiving jokes successfully.', () => {
    it('GET /api/jokes', async () => {
      const userInfo = {
        username: 'TestUser',
        password: 'testing123',
      };

      const { token } = (
        await supertest(server).post('/api/auth/login').send(userInfo)
      ).body;

      const jokes = await supertest(server)
        .get('/api/jokes')
        .set('Authorization', token);

      expect(jokes.status).toBe(200);
      expect(jokes.headers['content-type']).toBe(
        'application/json; charset=utf-8'
      );
      expect(jokes.body.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Registering a user successfully.', () => {
    test('POST /api/auth/register |', async () => {
      const res = await supertest(server).post('/api/auth/register');

      expect(res.status).toBe(400);
      expect(res.headers['content-type']).toBe(
        'application/json; charset=utf-8'
      );
    });
  });
});
