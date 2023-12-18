import request from 'supertest';
import app from '../../server.js';

const dashboardSummaryEnpoint = '/api/dashboard/summary';

describe(`[GET] ${dashboardSummaryEnpoint}`, () => {
  it('Should raise an error when the provided token is invalid or expired', async () => {
    const res = await request(app)
      .get(dashboardSummaryEnpoint)
      .set('Authorization', `Bearer 7fk8579jfhk398fj3985`);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual({ message: 'Unauthorized access. Please authenticate to proceed' });
  });

  it('Should get the summary information for admin', async () => {
    const res = await request(app)
      .get(dashboardSummaryEnpoint)
      .set('Authorization', `Bearer ${global.mockUsers.adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.totalRevenue).toEqual(0);
    expect(res.body.totalOrder).toEqual(0);
    expect(res.body.totalProduct).toEqual(30);
    expect(res.body.totalCategory).toEqual(5);
    expect(res.body.totalUser).toEqual(2);
  });
});
