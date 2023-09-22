import { ObjectId, DBRef } from 'mongodb'

export default [
  {
    _id: new ObjectId('6509d7937b29a7707748f1ed'),
    title: 'Курс Кулинария',
    introduction:
      '<p><span style="color: rgb(0, 0, 0);">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed malesuada congue eros sit amet gravida. Quisque ut quam sed elit semper rutrum et sed enim. Cras nulla mi, venenatis semper sagittis ac, iaculis at eros. Morbi libero nulla, ultrices vitae eleifend vitae, fringilla sit amet mi. Nunc euismod cursus facilisis. Curabitur nisi nisi, commodo et tristique non, placerat a dolor. Proin eleifend elit in hendrerit elementum. Praesent blandit tellus aliquet elit sodales malesuada. Mauris id lacus vitae felis dapibus molestie. Donec ut egestas diam. Pellentesque eget dignissim nulla, quis vestibulum leo. Aliquam eleifend nisl id libero auctor, id lobortis sem porttitor. Praesent eu augue tincidunt nisi tristique finibus sed at lorem.</span></p>',
    description:
      '<p class="ql-align-justify">Cras eget ligula eget metus ultrices cursus. Curabitur fermentum pulvinar velit id gravida. Vivamus blandit pulvinar urna sed mollis. Maecenas lectus odio, semper sed urna ut, imperdiet pharetra magna. Etiam vel mattis nunc. Integer placerat sagittis sem eget molestie. In in felis luctus, feugiat tortor in, fringilla lectus. Mauris viverra convallis iaculis. Mauris at risus sapien. Pellentesque a libero pulvinar lorem pretium laoreet non eget ante. Nulla fermentum dignissim massa, at fermentum neque viverra a. Phasellus laoreet aliquam accumsan. Etiam at auctor est, ut fringilla metus. Nunc vehicula nibh nec metus fermentum euismod. Integer ac euismod massa.</p><p class="ql-align-justify">Cras ultricies massa eget leo vulputate fermentum. Morbi finibus tortor facilisis mauris venenatis, hendrerit semper nunc suscipit. Fusce sit amet nunc lectus. Morbi nec lacus pulvinar, rhoncus neque ut, ultrices nibh. Morbi in augue eget neque maximus gravida ac in est. Vivamus ultricies nibh lacinia sem iaculis ornare. Nam justo ex, vulputate vitae aliquet vitae, congue et massa.</p>',
    images: [
      {
        name: '16_0.png',
        uuidName: 'dc9808e1-d0c1-4e35-a141-5b3a61f10a88.png',
      },
      {
        name: '16_1.png',
        uuidName: 'dedcc509-561a-48c9-95fe-dafc2b45f4a3.png',
      },
      {
        name: '16_2.png',
        uuidName: '3bc2dba8-5084-4254-aebb-0d1f2b9070ea.png',
      },
    ],
    access: [],
    date: 1695143827097,
    owner: new DBRef('users', new ObjectId('6509d7357b29a7707748f1ec')),
    id: new ObjectId('6509d7937b29a7707748f1ed'),
  },
  {
    _id: new ObjectId('6509d7ca7b29a7707748f1ee'),
    title: 'Курс по GO',
    introduction:
      '<p><span style="color: rgb(0, 0, 0);">Quisque scelerisque sagittis arcu ac accumsan. Etiam ut auctor turpis. Donec non molestie magna. In placerat imperdiet dui, a sagittis tellus condimentum a. Nulla convallis magna sed mattis ullamcorper. Aenean porttitor libero nulla, non pulvinar nisi faucibus interdum. Duis interdum quam sem, id elementum urna eleifend id. Nam est mi, condimentum et fringilla et, posuere vitae diam.</span></p>',
    description:
      '<p><span style="color: rgb(0, 0, 0);">Nulla dui nibh, pulvinar non lectus et, sollicitudin malesuada sem. Phasellus at tellus sit amet nunc convallis porta. In dictum lacus nibh, id facilisis nisi cursus a. In et magna et nunc ultricies dignissim. Nulla eu facilisis lectus. Nunc venenatis at sem ut placerat. Vivamus finibus pharetra nisl, nec congue enim sodales vitae. Fusce rutrum sem odio, eu vulputate dolor porttitor eget. Nullam dictum dui nec augue malesuada, non vehicula diam fermentum. In hac habitasse platea dictumst. Duis tristique tortor sit amet nisi tristique mollis. Ut at risus scelerisque, tincidunt tellus pharetra, laoreet nibh. Nullam massa sem, blandit ac cursus eget, porttitor dignissim orci. Donec blandit elementum erat, eu tincidunt dolor fermentum eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span></p>',
    images: [
      {
        name: '16_2.png',
        uuidName: '4ebafab2-36a4-44f2-82da-bb76a04dd130.png',
      },
      {
        name: '114.gif',
        uuidName: '9717319c-777f-443c-994a-d70fb874195f.gif',
      },
      {
        name: 'harold.png',
        uuidName: '831b9e95-4dc8-40fb-a8d5-5f159fdcffec.png',
      },
    ],
    access: [],
    date: 1695143882530,
    owner: new DBRef('users', new ObjectId('6509d7217b29a7707748f1eb')),
    id: new ObjectId('6509d7ca7b29a7707748f1ee'),
  },
  {
    _id: new ObjectId('6509d8297b29a7707748f1f3'),
    title: 'Сделать сайт с нуля!',
    introduction:
      '<p><span style="color: rgb(0, 0, 0);">Etiam luctus ex sed erat pellentesque aliquet. Donec condimentum malesuada metus, eget iaculis ante sagittis non. Vestibulum eleifend metus dictum, porttitor purus nec, molestie orci. Aenean ultrices vel magna ac consequat. Sed quis pretium nisl, nec auctor magna. Proin malesuada non arcu nec faucibus. Cras tincidunt maximus dolor. Curabitur aliquet lacus turpis, vitae varius metus aliquam vitae. In ullamcorper elit lacus, ut lobortis dui consequat vitae. Aliquam vitae imperdiet est. Nunc mattis velit quis nibh pulvinar, sit amet tincidunt tortor vehicula!</span></p>',
    description:
      '<p class="ql-align-justify">Donec vestibulum purus est, in semper elit sagittis in. Quisque sit amet nisl nulla. Nullam at tortor felis. Proin eu euismod elit. Duis dolor felis, tincidunt a arcu non, facilisis ornare risus. Duis eget pulvinar orci. Aliquam euismod, augue vel hendrerit lobortis, neque urna posuere nibh, eget sollicitudin sem arcu id neque. Pellentesque in rutrum ligula, id gravida leo. Sed vitae porta erat. Aenean malesuada nec lacus sit amet consequat. Curabitur sed molestie urna, sed tincidunt lacus. Aenean viverra quis odio quis feugiat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam purus odio, pharetra eget mollis eu, sollicitudin eget dolor.</p><p class="ql-align-justify">Suspendisse ut ligula accumsan, laoreet tellus eget, tincidunt velit. Sed congue magna id ornare venenatis. Fusce aliquet, nibh sed posuere feugiat, augue ante bibendum justo, suscipit faucibus ante arcu ut quam. Sed ullamcorper velit aliquam nulla tincidunt porttitor. Aliquam gravida, est laoreet pretium fermentum, nisl mauris aliquet justo, quis malesuada arcu mauris eu augue. Mauris varius sem in ligula pulvinar, quis commodo mi porta. Suspendisse porta ultrices lacus, mattis scelerisque metus lacinia ac. Suspendisse id velit ante. Vestibulum commodo diam vitae nisl tristique, ac pretium est accumsan. Nam eu urna sed tellus bibendum sagittis. Ut velit neque, auctor at nisi ac, ullamcorper scelerisque dolor.</p>',
    images: [
      {
        name: '16_0.png',
        uuidName: '81a023e7-22eb-4e37-aee6-e5e83198c970.png',
      },
      {
        name: '16_1.png',
        uuidName: '96cf38b7-b61c-49a2-8043-e2f50054afc1.png',
      },
      {
        name: '16_2.png',
        uuidName: '36df858b-7fcc-4944-82c4-f8556847b895.png',
      },
    ],
    access: [
      {
        id: '6509d7357b29a7707748f1ec',
        firstName: 'Алена',
        lastName: 'Шпиц',
      },
      {
        id: '6509d7217b29a7707748f1eb',
        firstName: 'Сергей',
        lastName: 'Филомонов',
      },
    ],
    date: 1695143977783,
    owner: new DBRef('users', new ObjectId('6509d7037b29a7707748f1ea')),
    id: new ObjectId('6509d8297b29a7707748f1f3'),
  },
  {
    _id: new ObjectId('6509d86f7b29a7707748f1f5'),
    title: 'Курс по jQuery',
    introduction:
      '<p><span style="color: rgb(0, 0, 0);">Nam pulvinar dapibus diam, in dapibus dui fringilla ut. Etiam quis lorem ut elit blandit ultrices. Fusce imperdiet volutpat egestas. Donec eu dapibus purus. Sed luctus, diam sagittis volutpat tempor, lectus magna mollis est, sit amet ornare elit nisl nec enim. Duis a quam aliquet, volutpat lacus vitae, ullamcorper nibh. Pellentesque fringilla libero ligula, nec venenatis felis fermentum ac. Nulla fermentum aliquam magna eget dignissim. Proin commodo pretium massa non ultrices!</span></p>',
    description:
      '<p><span style="color: rgb(0, 0, 0);">Mauris accumsan varius erat id sagittis. Quisque ante urna, vehicula id nibh ac, auctor vulputate purus. Fusce rutrum bibendum tincidunt. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus diam augue, egestas ut posuere eget, molestie sit amet metus. Sed vitae gravida sem, vel pharetra arcu. Curabitur nunc arcu, faucibus ac mattis vel, auctor id orci. Aliquam aliquet non metus non finibus. Morbi ac aliquam sapien. Sed at tempus tellus, eleifend dignissim dolor. Aliquam vulputate, ante interdum porttitor efficitur, urna justo ullamcorper lectus, sit amet tempor leo mi at odio. Nam et libero in nibh cursus pulvinar quis vitae dolor. Donec in faucibus magna.</span></p>',
    images: [
      {
        name: '114.gif',
        uuidName: 'bd9322a3-52ed-4b8a-aed4-fdba4f6eaf5a.gif',
      },
      {
        name: 'harold.png',
        uuidName: 'db4ddbfc-4576-4d0a-a6bf-e55de5a9d939.png',
      },
    ],
    access: [
      {
        id: '6509d7357b29a7707748f1ec',
        firstName: 'Алена',
        lastName: 'Шпиц',
      },
      {
        id: '6509d7217b29a7707748f1eb',
        firstName: 'Сергей',
        lastName: 'Филомонов',
      },
    ],
    date: 1695144047684,
    owner: new DBRef('users', new ObjectId('6509d7037b29a7707748f1ea')),
    id: new ObjectId('6509d86f7b29a7707748f1f5'),
  },
  {
    _id: new ObjectId('6509d8b87b29a7707748f1fb'),
    title: 'Курс по Node.js',
    introduction:
      '<p><span style="color: rgb(0, 0, 0);">Nullam non fermentum metus. Cras velit est, consectetur et urna at, dapibus vestibulum nulla. Maecenas eu convallis libero, et hendrerit metus. Integer malesuada arcu in mi condimentum tristique. Quisque aliquet orci vitae lectus bibendum vehicula. Vivamus nibh ex, iaculis at feugiat a, blandit a nisi. In felis elit, viverra eget nisi at, consequat consectetur tortor. Donec lorem nunc, luctus rhoncus dignissim vitae, commodo laoreet dui!</span></p>',
    description:
      '<p><span style="color: rgb(0, 0, 0);">Mauris porttitor ullamcorper ante, at semper leo aliquet eu. Nam facilisis, dui ut laoreet egestas, mi eros lacinia neque, eu molestie nisl augue vel lorem. Mauris imperdiet, diam et pellentesque pulvinar, velit ipsum tincidunt enim, id eleifend nisl ipsum nec est. Vestibulum rutrum nisi lorem. Quisque ac nibh eget enim varius imperdiet molestie vitae ipsum. Cras a ipsum tincidunt urna rhoncus volutpat eget eget sapien. Donec sagittis efficitur tortor, sed facilisis quam luctus vitae. Quisque vehicula lobortis felis quis consequat. Quisque bibendum nibh vitae metus cursus, vitae condimentum tellus dictum. In ex metus, porta vitae ipsum ac, vehicula placerat risus. Nulla cursus tincidunt mauris, ut facilisis sapien dapibus quis. Vestibulum interdum magna non nisl congue, sed suscipit lorem cursus. Cras elementum est vitae dui bibendum, ut aliquet urna pretium. Sed at fringilla est.</span></p>',
    images: [
      {
        name: '16_0.png',
        uuidName: '13a5a7aa-eb8f-4a87-a3f9-6cec1e9f3a6d.png',
      },
      {
        name: '16_1.png',
        uuidName: 'f560342b-1495-43c6-8359-554732df4d1d.png',
      },
      {
        name: '16_2.png',
        uuidName: 'f14cf2c5-83cd-4888-b73c-a692914c3adb.png',
      },
    ],
    access: [
      {
        id: '6509d7357b29a7707748f1ec',
        firstName: 'Алена',
        lastName: 'Шпиц',
      },
      {
        id: '6509d7217b29a7707748f1eb',
        firstName: 'Сергей',
        lastName: 'Филомонов',
      },
    ],
    date: 1695144120615,
    owner: new DBRef('users', new ObjectId('6509d7037b29a7707748f1ea')),
    id: new ObjectId('6509d8b87b29a7707748f1fb'),
  },
  {
    _id: new ObjectId('6509d8fd7b29a7707748f1fd'),
    title: 'Курс по PHP',
    introduction:
      '<p><span style="color: rgb(0, 0, 0);">Cras mollis lacus ante, ac auctor dui pellentesque eu. Aenean euismod, justo in pellentesque convallis, mauris massa commodo leo, vitae tincidunt nibh eros sed libero. Aliquam aliquet pellentesque ipsum quis congue. Nulla venenatis elementum hendrerit. Nullam ac lectus at velit fermentum faucibus. Fusce ut volutpat nisi. Donec facilisis rhoncus lacus, vehicula ornare elit vehicula et. In augue orci, euismod eu porta non, mattis in urna!</span></p>',
    description:
      '<p><span style="color: rgb(0, 0, 0);">Nam ullamcorper scelerisque turpis eget molestie. Suspendisse velit lectus, luctus ac risus vel, vestibulum ullamcorper sapien. Morbi et sollicitudin justo. Vivamus sagittis hendrerit turpis, gravida cursus quam dignissim sit amet. Nam eu malesuada felis. Integer a pretium augue, ut rhoncus turpis. Praesent suscipit id mi rutrum laoreet. In ornare elit sed orci tincidunt, ac tempor est varius. Donec efficitur molestie arcu ut pellentesque. Sed vulputate nulla porttitor ligula posuere, sit amet malesuada arcu sagittis. Fusce quis tortor sed lacus blandit placerat. Donec lacinia accumsan urna et ultrices. Nunc vel tellus a eros sodales dictum vel nec augue. Sed consectetur nunc tempor commodo lobortis. Pellentesque bibendum tincidunt sagittis.</span></p>',
    images: [
      {
        name: '16_0.png',
        uuidName: 'f89229e4-fa70-45dd-a0c6-0172fb6aa9a5.png',
      },
      {
        name: '16_1.png',
        uuidName: 'ed75dbda-af26-4f7a-946d-7b8f95e1b5ea.png',
      },
      {
        name: '16_2.png',
        uuidName: '996f0eea-dcae-41bd-989b-91183500f2c3.png',
      },
    ],
    access: [],
    date: 1695144189467,
    owner: new DBRef('users', new ObjectId('6509d7037b29a7707748f1ea')),
    id: new ObjectId('6509d8fd7b29a7707748f1fd'),
  },
]
