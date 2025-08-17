// ** Mock
import mock from 'src/@fake-db/mock'

const data = {
  users: [
    {
      id: 1,
      userName: 'gslixby0',
      fullName: 'Galen Slixby',
      email: "galen3@gmail.com",
      password: "fffee",
      confirmPassword: "fffee",
      avatar: '/images/avatars/3.png',
      role: 'editor',
      company: 'Yotz PVT LTD',
      status: 'InActive',
    },
    {
      id: 2,
      userName: 'hredmore1',
      fullName: 'Halsey Redmore',
      email: "galen3@gmail.com",
      password: "fffee",
      confirmPassword: "fffee",
      avatar: '/images/avatars/3.png',
      role: 'author',
      company: 'Skinder PVT LTD',
      status: 'Active',
    },
    {
      id: 3,
      userName: 'msicely2',
      fullName: 'Marjory Sicely',
      email: 'msicely2@who.int',
      password: "12345",
      confirmPassword: "12345",
      avatar: '/images/avatars/1.png',
      role: 'maintainer',
      company: 'Oozz PVT LTD',
      status: 'Active',

    },
    {
      id: 4,
      userName: 'crisby3',
      fullName: 'Cyrill Risby',
      email: 'crisby3@wordpress.com',
      password: '7410',
      confirmPassword: '7410',
      avatar: '/images/avatars/3.png',
      role: 'maintainer',
      company: 'Oozz PVT LTD',
      status: 'InActive',
    },
    {
      id: 5,
      userName: 'mhurran4',
      fullName: 'Maggy Hurran',
      email: 'mhurran4@yahoo.co.jp',
      password: 'scdscf',
      confirmPassword: 'scdscf',
      avatar: '/images/avatars/1.png',
      role: 'subscriber',
      company: 'Aimbo PVT LTD',
      status: 'InActive'
    },
    {
      id: 6,
      userName: 'shalstead5',
      fullName: 'Silvain Halstead',
      email: 'shalstead5@shinystat.com',
      password: 'scdscf',
      confirmPassword: 'scdscf',
      avatar: '',
      role: 'author',
      company: 'Jaxbean PVT LTD',
      status: 'Active',
    },
    {
      id: 7,
      userName: 'bgallemore6',
      fullName: 'Breena Gallemore',
      email: 'bgallemore6@boston.com',
      password: 'scdscf',
      confirmPassword: 'scdscf',
      avatar: '',
      role: 'subscriber',
      company: 'Jazzy PVT LTD',
      status: 'Active',
    },
    // {
    //   id: 8,
    //   userName: 'kliger7',
    //   fullName: 'Kathryne Liger',
    //   email: 'kliger7@vinaora.com',
    //   password: 'scdscf',
    //   confirmPassword: 'scdscf',
    //   avatar: '/images/avatars/4.png',
    //   role: 'author',
    //   company: 'Pixoboo PVT LTD',
    //   status: 'Active',
    // },
    // {
    //   id: 9,
    //   userName: 'fscotfurth8',
    //   fullName: 'Franz Scotfurth',
    //   email: 'fscotfurth8@dailymotion.com',
    //   password: 'scdscf',
    //   confirmPassword: 'scdscf',
    //   avatar: '/images/avatars/2.png',
    //   role: 'subscriber',
    //   company: 'Tekfly PVT LTD',
    //   status: 'Active',
    // },
    // {
    //   id: 10,
    //   userName: 'kliger7',
    //   fullName: 'Kathryne Liger',
    //   email: 'kliger7@vinaora.com',
    //   password: 'scdscf',
    //   confirmPassword: 'scdscf',
    //   avatar: '/images/avatars/4.png',
    //   role: 'author',
    //   company: 'Pixoboo PVT LTD',
    //   status: 'Active',
    // },
  ]
}

const projectListData = [
  {
    id: 1,
    hours: '18:42',
    progressValue: 78,
    totalTask: '122/240',
    progressColor: 'success',
    projectType: 'React Project',
    projectTitle: 'BGC eCommerce App',
    img: '/images/icons/project-icons/react.png'
  },
  {
    id: 2,
    hours: '20:42',
    progressValue: 18,
    totalTask: '9/56',
    progressColor: 'error',
    projectType: 'Figma Project',
    projectTitle: 'Falcon Logo Design',
    img: '/images/icons/project-icons/figma.png'
  },
  {
    id: 3,
    hours: '120:87',
    progressValue: 62,
    totalTask: '290/320',
    progressColor: 'primary',
    projectType: 'VueJs Project',
    projectTitle: 'Dashboard Design',
    img: '/images/icons/project-icons/vue.png'
  },
  {
    id: 4,
    hours: '89:19',
    progressValue: 8,
    totalTask: '7/63',
    progressColor: 'error',
    projectType: 'Xamarin Project',
    projectTitle: 'Foodista Mobile App',
    img: '/images/icons/project-icons/xamarin.png'
  },
  {
    id: 5,
    hours: '230:10',
    progressValue: 49,
    totalTask: '120/186',
    progressColor: 'warning',
    projectType: 'Python Project',
    projectTitle: 'Dojo React Project',
    img: '/images/icons/project-icons/python.png'
  },
  {
    id: 6,
    hours: '342:41',
    progressValue: 92,
    totalTask: '99/109',
    progressColor: 'success',
    projectType: 'Sketch Project',
    projectTitle: 'Blockchain Website',
    img: '/images/icons/project-icons/sketch.png'
  },
  {
    id: 7,
    hours: '12:45',
    progressValue: 88,
    totalTask: '98/110',
    progressColor: 'success',
    projectType: 'HTML Project',
    projectTitle: 'Hoffman Website',
    img: '/images/icons/project-icons/html5.png'
  }
]

// POST: Add new user
mock.onPost('/apps/users/add-user').reply(config => {
  // Get event from post data
  const user = JSON.parse(config.data).data
  const { length } = data.users
  let lastIndex = 0
  if (length) {
    lastIndex = data.users[length - 1].id
  }
  user.id = lastIndex + 1
  data.users.unshift({ ...user, avatar: '', status: 'Active' })

  return [201, { user }]
})

// GET: DATA
mock.onGet('/apps/users/list').reply(config => {
  const { q = '', role = null, status = null } = config.params ?? ''
  const queryLowered = q.toLowerCase()

  const filteredData = data.users.filter(
    user =>
      (user.userName.toLowerCase().includes(queryLowered) ||
        user.fullName.toLowerCase().includes(queryLowered) ||
        user.role.toLowerCase().includes(queryLowered) ||
        (user.email.toLowerCase().includes(queryLowered) &&
          user.status.toLowerCase().includes(queryLowered))) &&
      user.role === (role || user.role) &&
      user.status === (status || user.status)
  )

  return [
    200,
    {
      allData: data.users,
      users: filteredData,
      params: config.params,
      total: filteredData.length
    }
  ]
})

// DELETE: Deletes User
mock.onDelete('/apps/users/delete').reply(config => {
  // Get user id from URL
  const userId = config.data
  const userIndex = data.users.findIndex(t => t.id === userId)
  data.users.splice(userIndex, 1)
  return [200]
})

// GET: DATA
mock.onGet('/apps/users/project-list').reply(config => {
  const { q = '' } = config.params ?? ''
  const queryLowered = q.toLowerCase()

  const filteredData = projectListData.filter(
    user =>
      user.projectTitle.toLowerCase().includes(queryLowered) ||
      user.projectType.toLowerCase().includes(queryLowered) ||
      user.totalTask.toLowerCase().includes(queryLowered) ||
      user.hours.toLowerCase().includes(queryLowered) ||
      String(user.progressValue).toLowerCase().includes(queryLowered)
  )

  return [200, filteredData]
})
