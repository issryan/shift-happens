const request = require('supertest');
const app = require('../server');
const Event = require('../models/Event');
const Schedule = require('../models/Schedule');
const User = require('../models/User');

describe('Event Routes', () => {
  let token;
  let scheduleId;

  beforeAll(async () => {
    await User.deleteMany();
    await Schedule.deleteMany();
    await Event.deleteMany();

    const userRes = await request(app).post('/api/auth/register').send({
      name: 'Test Manager',
      email: 'manager@example.com',
      password: 'password123',
    });

    token = userRes.body.token;

    const scheduleRes = await request(app)
      .post('/api/schedule/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ month: 1, year: 2025 });

    scheduleId = scheduleRes.body.schedule._id;
  });

  afterAll(async () => {
    await User.deleteMany();
    await Schedule.deleteMany();
    await Event.deleteMany();
  });

  test('should fetch events by schedule ID', async () => {
    const res = await request(app)
      .get(`/api/events/${scheduleId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test('should update an event', async () => {
    const newEvent = new Event({
      scheduleId,
      details: 'Sample Event',
      startTime: new Date(),
      endTime: new Date(),
    });
    await newEvent.save();

    const res = await request(app)
      .put(`/api/events/${newEvent._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        details: 'Updated Event',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('details', 'Updated Event');
  });

  test('should return validation error for invalid startTime', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        scheduleId,
        details: 'Invalid Event',
        startTime: 'invalid-date',
        endTime: new Date(),
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});