import { ObjectId, DBRef } from 'mongodb'

export default [
  {
    _id: new ObjectId('6509d7dd7b29a7707748f1f0'),
    text: '<p>Крутой <strong>рецепт</strong>!</p>',
    owner: new DBRef('users', new ObjectId('6509d7217b29a7707748f1eb')),
    date: 1695143901892,
    courseId: new ObjectId('6509d7937b29a7707748f1ed'),
  },
  {
    _id: new ObjectId('6509d8037b29a7707748f1f2'),
    text: '<p><strong>Классно </strong>и <em>так </em><u>просто</u>!!!</p>',
    owner: new DBRef('users', new ObjectId('6509d7357b29a7707748f1ec')),
    date: 1695143939124,
    courseId: new ObjectId('6509d7ca7b29a7707748f1ee'),
  },
  {
    _id: new ObjectId('6509d8387b29a7707748f1f4'),
    text: '<p><strong><em><u>Начинайте курс!</u></em></strong></p>',
    owner: new DBRef('users', new ObjectId('6509d7037b29a7707748f1ea')),
    date: 1695143992389,
    courseId: new ObjectId('6509d8297b29a7707748f1f3'),
  },
  {
    _id: new ObjectId('6509d8817b29a7707748f1f7'),
    text: '<p>Класс!</p>',
    owner: new DBRef('users', new ObjectId('6509d7037b29a7707748f1ea')),
    date: 1695144065599,
    courseId: new ObjectId('6509d7ca7b29a7707748f1ee'),
  },
  {
    _id: new ObjectId('6509d8907b29a7707748f1f9'),
    text: '<p>Вкуснотища!</p>',
    owner: new DBRef('users', new ObjectId('6509d7037b29a7707748f1ea')),
    date: 1695144080243,
    courseId: new ObjectId('6509d7937b29a7707748f1ed'),
  },
  {
    _id: new ObjectId('6509d95e7b29a7707748f204'),
    text: '<p>Оууууу</p>',
    owner: new DBRef('users', new ObjectId('6509d7357b29a7707748f1ec')),
    date: 1695144286736,
    courseId: new ObjectId('6509d86f7b29a7707748f1f5'),
  },
  {
    _id: new ObjectId('6509d9657b29a7707748f206'),
    text: '<p>Вауууу</p>',
    owner: new DBRef('users', new ObjectId('6509d7357b29a7707748f1ec')),
    date: 1695144293387,
    courseId: new ObjectId('6509d8b87b29a7707748f1fb'),
  },
  {
    _id: new ObjectId('6509d96e7b29a7707748f209'),
    text: '<p>Ух ты</p>',
    owner: new DBRef('users', new ObjectId('6509d7357b29a7707748f1ec')),
    date: 1695144302554,
    courseId: new ObjectId('6509d8fd7b29a7707748f1fd'),
  },
]
