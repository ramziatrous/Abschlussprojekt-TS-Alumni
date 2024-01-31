import React, { useState, useEffect } from 'react';
import '../newsfeed.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';


const NewsFeed = () => {
  const [Posts, setPosts] = useState([]);
  const [Comments, setComments] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    RealName: '',
    EmailAddress: '',
    BirthDate: '',
    Course: '',
    ProfileImg: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [userRealNames, setUserRealNames] = useState({});
  const [commentRealNames, setCommentRealNames] = useState({});
  const [commentphotos, setCommentphotos] = useState({});
  const [userphotos, setUserphotos] = useState({});
  const [showComments, setShowComments] = useState();
  const [newcomment, setNewcomment] = useState('');
  const [postId, setPostId] = useState(null);
  const [userDataFetched, setUserDataFetched] = useState(false);
  const [realNames, setRealNames] = useState([]);
  const [user_ids, setUser_ids] = useState([])
  const [name, setName] = useState('');
  const [searchliste, setSearchListe] = useState('nicht');
  const [Commentscount,setCommentscount] = useState('')
  const fetchUserData = async () => {

    try {
      const response = await fetch('https://845d97vw4k.execute-api.eu-central-1.amazonaws.com/getAllPosts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      // console.log(data);


      if (data.status === 'ok') {
        setPosts(data.posts);

      } else {
        console.error('Error fetching user data', data);
      }
    } catch (error) {
      console.error('Network error', error);
    } finally {
      setIsLoading(false);
    }
  };
  // console.log(Posts)
  useEffect(() => {


    const isconnected = async () => {

      try {
        const user_id = localStorage.getItem("UserID");
        if (!user_id) {
          navigate("/");
        } else {
          if (!userDataFetched) {

            await fetchUserData();
            setUserDataFetched(true);
          }



          const fetchUserUserData = async (postUserIds) => {
            try {
              const realNames = {};
              const photos = {};
              for (const userId of new Set(postUserIds)) {
                const url = `https://845d97vw4k.execute-api.eu-central-1.amazonaws.com/getUser/${userId}`;
                const response = await fetch(url, {
                  method: 'GET',
                  headers: { 'Content-Type': 'application/json' },
                });
                const userData = await response.json();

                realNames[userId] = userData.RealName;
                photos[userId] = userData.ProfileImg;
              }
              setUserRealNames(realNames);
              setUserphotos(photos)
            } catch (error) {
              console.error('Error fetching user real names', error);
            }
          };
          const fetchcommentUserData = async (commentUserIds) => {
            try {
              const realNames = {};
              const photos = {};
              for (const userId of new Set(commentUserIds)) {
                const url = `https://845d97vw4k.execute-api.eu-central-1.amazonaws.com/getUser/${userId}`;
                const response = await fetch(url, {
                  method: 'GET',
                  headers: { 'Content-Type': 'application/json' },
                });
                const CommentuserData = await response.json();

                realNames[userId] = CommentuserData.RealName;
                photos[userId] = CommentuserData.ProfileImg;
              }
              setCommentRealNames(realNames);
              setCommentphotos(photos)
            } catch (error) {
              console.error('Error fetching user real names', error);
            }
          };

          const changeClassSearchListe = (name) => {
            if (name == '') {
              setSearchListe("nicht");
            } else {
              setSearchListe("search-liste");
            }


          };



          getUser();
          changeClassSearchListe(name)

          fetchUserUserData(Posts.map((post) => post.user_id));
          fetchcommentUserData(Comments.map((comment) => comment.UserID));

        }

      } catch (error) {
        console.error('auth error', error);
      }
    };
    isconnected();
  }, [Posts, setUserDataFetched, Comments, name, realNames]);


  const getUser = async () => {
    try {
      const user_id = localStorage.getItem("UserID");
      const url = 'https://845d97vw4k.execute-api.eu-central-1.amazonaws.com/getUser/' + user_id
      const response = await fetch(url,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
      const userData = await response.json()
      setUser(userData)
      // console.log(userData)

    } catch (error) {
      console.error("Fehler beim Bearbeiten des Profils", error);
    }
  };

  const handleSendMessage = async () => {
    try {
      const response = await fetch('https://845d97vw4k.execute-api.eu-central-1.amazonaws.com/addPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: localStorage.getItem("UserID"),
          content: newMessage,
          media_link: uploadedImage,
        }),
      });

      const data = await response.json();

      // console.log('Data:', data);
      setNewMessage('')
    } catch (error) {
      console.error('Network error', error);
    }
  };

  const addComment = async () => {
    try {
      const response = await fetch('https://845d97vw4k.execute-api.eu-central-1.amazonaws.com/addComment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: localStorage.getItem("UserID"),
          post_id: postId,
          content: newcomment,
        }),
      });

      const data = await response.json();

      // console.log('Data:', data);
      fetchUserData();
      setNewcomment('');
      handleToggle(null, postId);

    } catch (error) {
      console.error('Network error', error);
    }
  }


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const fetchComments = async () => {
    try {
      const url = `https://845d97vw4k.execute-api.eu-central-1.amazonaws.com/getComments/${postId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const CommentsData = await response.json();


      if (CommentsData.status === 'ok') {
        setComments(CommentsData.comments);

      } else {
        console.error('Error fetching user data', CommentsData);
      }



    } catch (error) {
      console.error('Error fetching user real names', error);
    }
  };
  const handleToggle = (index, postId) => {
    setShowComments(index === showComments ? null : index);
    setPostId(postId);
    fetchComments();

  };
  const profil = () => {
    navigate("/profil");
  }
  const handlelogout = () => {
    localStorage.removeItem("UserID")
  }
  const handelpostid = (index, postid) => {
    setPostId(postid);
    fetchComments();
    setCommentscount(Comments.length);
  }
  const handelcount = () =>{
    setCommentscount('')
  }
  const fetchUserDatas = async (name) => {
    try {
      const url = `https://845d97vw4k.execute-api.eu-central-1.amazonaws.com/getUserByName`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({
          name: name
        })
      });
      const datas = await response.json();
      const extractedRealNames = datas.map(user => user.RealName);
      setRealNames(extractedRealNames);
      const extractedUserID = datas.map(user => user.UserID);
      setUser_ids(extractedUserID);

      console.log("datas:", datas)
    } catch (error) {
      console.error('Error fetching user data:', error);

      console.log(error)
    }
  };

  const handleInputChange = (e) => {
    setName(e.target.value);
    fetchUserDatas(name);
  };
  return (

    <div className="appnewsfeed">
      <div className="header">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            className="search-bar-input"
            value={name}
            onChange={handleInputChange}

          />
          <button >Search</button>
        </div>
        <div className="user-info-container">
          <div className="user-photo">
            <img src={user.ProfileImg} alt="User Photo" />
          </div>
          <div className="user-details" >
            <div className="dropdown-container">
              <span className="menu-item">{user.RealName}</span>
              <div className="dropdown-content">
                <a href={"/profil/" + localStorage.getItem("UserID")} className="menu-item">Profile</a>
                <a href="#" className="menu-item" onClick={handlelogout}>Logout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={searchliste}>

        <ul>
          {realNames.slice(-1000).map((name, index) => (
            <li key={index}>
              <div>
                <a href={`/profil/${user_ids.slice(-1000)[index]}`}>{name}</a>
              </div>
            </li>
          ))}
        </ul>

      </div>

      <div className="chat-container">
        <div className="Posts-container">
          {isLoading ? (
            <p>Loading Posts...</p>
          ) : (
            Posts.slice(-1000).map((post, index) => (

              <div className="message" key={index} onMouseOver={() => handelpostid(index, post.id)} onMouseDown={handelcount}>
                <div className='user'>
                  <img src={userphotos[post.user_id]} width='30px'></img>
                  <a href={"/profil/" + post.user_id}>
                    <strong>{userRealNames[post.user_id]}</strong>
                  </a>
                  <div className="space-between"></div>
                  <p >
                    <strong>{post.CreatedAt}</strong>
                  </p>
                </div>
                <div className="post">
                  <p>
                    {post.content}
                  </p>
                </div>
                <div className="postimg">
                  <img src={post.MediaLink} className="post-media" />
                </div>
                <div className="comment-button" onClick={() => handleToggle(index, post.id)}>
                  <p>Comments {Commentscount}</p>
                </div>
                {showComments === index && (
                  <div className="comments-container">
                    <div className="comments">
                      {isLoading ? (
                        <p>Loading comments...</p>
                      ) : (
                        Comments.slice(-1000).map((comment, index) => (
                          <div className="comment" key={index}>

                            <div className='commentuser'>
                              <img src={commentphotos[comment.UserID]} width='30px'></img>
                              <a href={"/profil/" + post.user_id}>
                                <strong>{commentRealNames[comment.UserID]}</strong>
                              </a>
                              <p >
                                <strong>{comment.CreatedAt}</strong>
                              </p>
                            </div>
                            <div className="comment-text">
                              <p>
                                {comment.Content}
                              </p>
                            </div>

                          </div>
                        ))
                      )}
                    </div>
                    <div className="comments-input">
                      <input
                        type='text'
                        placeholder='Type a Comment'
                        value={newcomment}
                        onChange={(e) => setNewcomment(e.target.value)}>
                      </input>
                      <button onClick={addComment}>Send</button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        <div className="input-container">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            id="fileInput"
          />
          <label htmlFor="fileInput" className="upload-button">Upload Image</label>
          <button onClick={handleSendMessage} className="send-button">Send</button>
        </div>
      </div>

    </div>
  );
};

export default NewsFeed;