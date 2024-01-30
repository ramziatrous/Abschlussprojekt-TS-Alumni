import React, { useState, useEffect } from 'react';
import '../newsfeed.css';
import { useNavigate } from 'react-router-dom';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';


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

  useEffect(() => {


    const isconnected = async () => {

      try {
        const user_id = localStorage.getItem("UserID");
        if (!user_id) {
          navigate("/");
        } else {
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






          fetchUserData();
          getUser();
          fetchUserUserData(Posts.map((post) => post.user_id));
          fetchcommentUserData(Comments.map((comment) => comment.UserID));

        }

      } catch (error) {
        console.error('auth error', error);
      }
    };
    isconnected();
  }, [Posts]);




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

      console.log('Data:', data);
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

      console.log('Data:', data);

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


  return (

    <div className="app">
      <div className="header">
        <div className="logo-container">
          <img src="https://cdn.discordapp.com/attachments/1195301143161606205/1195301598507827240/techst_logo_rz_white.png?ex=65b37e5c&is=65a1095c&hm=951cba6cabd865ab2f4e7c4fd8e295c18bb4f3b9a3474d434849184a84fcbd48&" alt="Logo" className="logo" />
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search..." className="search-bar-input" />
          <button>Search</button>
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

      <div className="chat-container">
        <div className="Posts-container">
          {isLoading ? (
            <p>Loading Posts...</p>
          ) : (
            Posts.slice(-1000).map((post, index) => (

              <div className="message" key={index}>
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
                  <p>Comments</p>
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