const User = require("./Users.model");
const Comment = require("./Comment.model");
const Post = require("./Post.model");

//Post mock data

let postData = [
  {
    title: "officia",
    post:
      "Proident pariatur occaecat cillum labore. Cillum reprehenderit commodo sint consequat excepteur labore. Esse occaecat mollit dolor duis eu sit sint ad. Adipisicing eu eu ad nisi magna fugiat laborum. Sit dolore cupidatat commodo irure adipisicing adipisicing sint duis.",
    votes: "-1"
  },
  {
    title: "ut",
    post:
      "Voluptate ex labore consequat duis eiusmod duis adipisicing sit labore cupidatat. Deserunt sit consequat ad duis exercitation commodo ut ex. Ullamco mollit fugiat qui aliqua amet minim. Occaecat mollit quis sunt aliquip pariatur aliqua non ea elit anim sit cillum. Exercitation et adipisicing fugiat voluptate.",
    votes: 0
  },
  {
    title: "cillum",
    post:
      "Est ex cupidatat culpa quis excepteur cupidatat pariatur consectetur et officia est Lorem labore. Ex ullamco incididunt cupidatat qui veniam duis ipsum. Aliqua laboris et veniam ullamco anim magna do duis dolor deserunt laboris do ad nostrud. Sit dolore proident adipisicing eu enim non mollit sunt commodo sit magna ut.",
    votes: 4
  },
  {
    title: "ea",
    post:
      "Eiusmod commodo eu sunt dolore sit ea. Fugiat commodo minim occaecat enim. Veniam deserunt adipisicing enim et anim sint esse minim magna id amet. Nostrud amet commodo tempor consequat officia eiusmod amet.",
    votes: "-2"
  },
  {
    title: "ullamco",
    post:
      "Duis qui adipisicing sit ut fugiat est aliquip adipisicing sint consequat. Ut deserunt cupidatat ipsum excepteur nostrud. Aute magna consequat nisi do aute enim voluptate laborum nostrud eu mollit eiusmod nulla ea. Occaecat consectetur ea ex mollit consectetur eiusmod esse aliqua ea ad nisi. Nisi consequat esse adipisicing elit consectetur. Anim voluptate irure et irure in.",
    votes: 2
  },
  {
    title: "laboris",
    post:
      "Ipsum tempor id sunt sunt veniam veniam fugiat. Cupidatat officia elit anim excepteur elit. Lorem eiusmod enim consequat magna magna magna aute. Ipsum proident sunt consequat quis magna minim. Tempor nisi duis in amet voluptate. In veniam qui mollit duis est veniam non irure duis adipisicing. Quis reprehenderit veniam esse occaecat quis ad et nulla enim.",
    votes: 2
  },
  {
    title: "minim",
    post:
      "Culpa incididunt voluptate incididunt et ullamco. Ut non ullamco magna ut veniam amet magna minim sunt. Deserunt veniam nulla ut esse fugiat mollit ut aute est id eu veniam aute. Nostrud nostrud nostrud deserunt ad excepteur aliquip do amet et qui.",
    votes: 2
  },
  {
    title: "voluptate",
    post:
      "Consequat non officia quis excepteur est incididunt excepteur cillum. Elit proident aliqua sint cillum consectetur pariatur ut. Anim qui duis officia excepteur consectetur irure duis duis dolor excepteur dolore. Ut eiusmod commodo Lorem dolore exercitation consequat officia est dolore quis nisi. Commodo ullamco in id pariatur aliqua occaecat commodo occaecat nisi anim adipisicing. Mollit consectetur ut minim consectetur consequat proident.",
    votes: 9
  },
  {
    title: "veniam",
    post:
      "Adipisicing adipisicing ad id amet duis ea veniam excepteur culpa. Irure duis tempor laborum culpa excepteur eiusmod do proident dolor nisi sit nisi. Pariatur nisi adipisicing est aute nostrud magna tempor officia esse do incididunt. Anim minim ullamco labore id occaecat quis dolor nostrud eiusmod veniam. Sint ex voluptate dolor aute voluptate anim sint eu velit incididunt laboris. Veniam sit sit officia aliqua mollit. Irure proident sit deserunt excepteur labore anim ea.",
    votes: "-1"
  },
  {
    title: "dolor",
    post:
      "In proident cupidatat esse laborum ad enim et fugiat enim labore. Tempor quis cillum do excepteur duis ut elit ex consectetur eu et ea. Id magna non enim do Lorem tempor laborum qui sit quis reprehenderit sit velit do. Aliqua voluptate Lorem amet tempor id anim tempor adipisicing veniam anim qui et nisi. Cillum anim in sunt commodo id.",
    votes: 10
  }
];

let commentData = [
  {
    comment:
      "Sint mollit officia eu dolore nisi aliqua elit elit qui ex nulla amet voluptate. Laboris culpa reprehenderit magna aute fugiat reprehenderit aute officia ad elit cupidatat.",
    votes: 1
  },
  {
    comment:
      "Pariatur aliquip aute sint sint id velit consectetur irure ea commodo elit qui. Fugiat exercitation commodo ea ex velit veniam nostrud voluptate exercitation irure adipisicing.",
    votes: 0
  },
  {
    comment:
      "Nulla cupidatat velit est irure laboris cillum cillum. Et in quis cupidatat excepteur dolor eiusmod laboris culpa tempor ad exercitation ea mollit.",
    votes: 4
  },
  {
    comment:
      "Consequat adipisicing incididunt sunt culpa labore consequat et. Consectetur sunt sit non consectetur cillum officia amet.",
    votes: 4
  },
  {
    comment:
      "Consequat sit aute culpa aliquip dolor deserunt fugiat proident ex sunt tempor dolore et nostrud. In proident tempor incididunt dolore nisi est minim commodo occaecat pariatur duis ipsum eu cillum.",
    votes: 10
  }
];

//TODO: Remove Collections from all tables
[User, Comment, Post].map(model => {
  model.deleteMany(err => {
    if(err) console.error(err);
  })
})

//TODO: declare mock data for tables and save

// User mock data
let user1 = new User({
  username: "Kratos",
  password: "test"
});

let user2 = new User({
  username: "Monkey",
  password: "test"
});

user1.setPassword("test");
user2.setPassword("test");

// Array of posts that will be saved to db
let posts = [];
//Save posts through loop
for (let i = 0; i < postData.length; i++) {
  // select random user for post
  let poster = Math.random() * 10 > 5 ? user1 : user2;
  postData[i].poster = poster._id;

  // set random created dates
  postData[i].created_at = randomDate(new Date(2018, 01, 01), new Date());
  postData[i].updated_at = randomDate(new Date(2018, 01, 01), new Date());

  // push new post to posts array
  posts.push(new Post(postData[i]));

  // create an array of comments to be assigned to current post
  let postComments = getShuffleArray(commentData).splice(
    0,
    Math.floor(Math.random() * commentData.length) + 1
  );

  for (let j = 0; j < postComments.length; j++) {
    let commenter = Math.random() * 10 > 5 ? user1 : user2;

    postComments[j] = new Comment(postComments[j]); // convernt postComment to Model object
    postComments[j].post = posts[i]._id; // assign comment to post
    postComments[j].commenter = commenter._id; // assign comment to user
    // assign random creation date from when post was created to now
    postComments[j].created_at = randomDate(posts[i].created_at, new Date());
    postComments[j].updated_at = randomDate(posts[i].created_at, new Date());

    // push comment to list of users comments
    commenter.comments.push(postComments[j]);

    postComments[j].save().catch(err => { console.error(err)});
  }

  posts[i].comments = postComments;
  
  // push post to list of users post
  poster.posts.push(posts[i]);

  posts[i].save().catch(err => console.error(err));
}

// save users
user1.save();
user2.save();

//Utils

// Shuffle an array through recursion
function getShuffleArray(arr) {
  if (arr.length === 1) {
    return arr;
  }
  const rand = Math.floor(Math.random() * arr.length);
  return [arr[rand], ...getShuffleArray(arr.filter((_, i) => i != rand))];
}

// Get a random date between a range of two dates
function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}
