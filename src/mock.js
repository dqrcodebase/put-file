import Mock from 'mockjs'

let chunkFile = {}

// 校验文件是否已经存在在服务器
Mock.mock(RegExp(`/api/inspect/*`), 'get', function (option) {
  console.log("🚀 ~ file: mock.js:8 ~ option:", option)
   if(option.body === '70829d59b118311e9cf04c93f3a5bf80') {
    return Mock.mock({
      code: '0000',
      data: true,
      message: 'ok',
      successfully: true
    });
  }else if(option.body === '9b8595dd9849b2b6b1c758521b393c98') {
    return Mock.mock({
      code: '0000',
      data: [
        '5ecf0bf8acd13de99d03b054751fd7bb',
        '18757f515e0dd2042da759edd3ed1be7',
        'cead096c472d9bdcab778fede7be71a1',
        '87d0ec6441034956cb232103a64d5b3a',
        'f2c94457a03e4294c96b0f58ca7508e4',
        '9d54c70dc675649963daa69b3ac6a768',
        'dd52066eb36468d31027396e44fcaa39',
      ],
      message: 'ok',
      successfully: true
    });
  }else if(option.body === '8e44aeb3f21fc69d092f440a7c84dbac') {
    return Mock.mock({
      code: '0000',
      data: [
        '5377466b0ccb4485aad614f9cfb594a7',
        '69898a5eee3f89e01acf5a63de05a1ab',
      ],
      message: 'ok',
      successfully: true
    })
  }else {
    return Mock.mock({
      code: '0000',
      data: false,
      message: 'ok',
      successfully: true
    });
  }
});

Mock.mock('/api/annex/oss/v2/upload','post',function(option) {
  console.log("🚀 ~ file: mock.js:51 ~ Mock.mock ~ option:", option)
  return Mock.mock({
    code: '0000',
    data: true,
    message: 'ok',
    successfully: true
  });
})