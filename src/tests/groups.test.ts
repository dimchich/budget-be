import request from 'supertest';
import App from '../app';
import GroupRoute from '../routes/groups.route';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Groups', () => {
  describe('[GET] /groups', () => {
    it('response statusCode 200', () => {
      const groupRoute = new GroupRoute();
      const app = new App([groupRoute]);

      return request(app.getServer()).get(`${groupRoute.path}`).expect(200);
    });
  });
  // TODO complete section
});
