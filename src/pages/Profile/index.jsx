import Cookies from 'js-cookie'
import Header from '../../components/Header'
import './index.css'

const Profile = () => {
  const username = Cookies.get('username')

  return (
    <>
      <Header />

      <div className="profile-container">
        <div className="profile-card">
          <img
            src="https://res.cloudinary.com/dlvle38po/image/upload/v1780984973/ChatGPT_Image_Jun_9_2026_11_31_28_AM_cpinvf.png"
            alt="profile"
            className="profile-image"
          />

          <h1 className="profile-name">{username}</h1>

          <p className="profile-role">Food Explorer</p>

          <p className="profile-description">
            Welcome to Tasty Kitchens. Discover delicious restaurants and
            explore amazing food around you.
          </p>
        </div>
      </div>
    </>
  )
}

export default Profile
