import Cookies from 'js-cookie'
import {withRouter, Link} from 'react-router-dom'

import './index.css'

const Header = props => {
  const onClickLogOut = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <ul className="header-container">
      <Link to="/" className="logo-button">
        <li>
          <img
            className="logo-image"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          />
        </li>
      </Link>
      <div className="home-jobs">
        <Link className="link-item" to="/">
          <li className="list-el">Home</li>
        </Link>
        <Link className="link-item" to="/jobs">
          <li className="list-el">Jobs</li>
        </Link>
      </div>
      <li className="list-el-button">
        <button type="button" className="logo-button" onClick={onClickLogOut}>
          Logout
        </button>
      </li>
    </ul>
  )
}
export default withRouter(Header)
