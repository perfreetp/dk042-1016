export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/publish/index',
    'pages/map/index',
    'pages/mine/index',
    'pages/detail/index',
    'pages/clueSubmit/index',
    'pages/messages/index',
    'pages/expired/index',
    'pages/myPublish/index',
    'pages/participate/index',
    'pages/foundConfirm/index',
    'pages/broadcast/index',
    'pages/report/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '寻宠互助',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#FF6B35',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/publish/index',
        text: '发布'
      },
      {
        pagePath: 'pages/map/index',
        text: '地图'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
