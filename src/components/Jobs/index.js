import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'

import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import Header from '../Header'
import JobCard from '../JobCard'
import FilterGroup from '../FilterGroup'

import './index.css'

const apiConstans = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

class Jobs extends Component {
  state = {
    apiStatus: apiConstans.initial,
    profileData: {},
    jobsapiStatus: apiConstans.initial,
    jobsList: [],
    input: '',
    employmentType: '',
    minPackage: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    this.setState({apiStatus: apiConstans.inProgress})
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }

    const response = await fetch(profileApiUrl, options)
    const fetchedProfileData = await response.json()

    if (response.ok) {
      const profile = fetchedProfileData.profile_details
      const profileData = {
        name: profile.name,
        profileImageUrl: profile.profile_image_url,
        shortBio: profile.short_bio,
      }
      this.setState({profileData, apiStatus: apiConstans.success})
    } else {
      this.setState({apiStatus: apiConstans.failure})
    }
  }

  getJobs = async () => {
    const {input, employmentType, minPackage} = this.state
    const jwtToken = Cookies.get('jwt_token')

    this.setState({jobsapiStatus: apiConstans.inProgress})
    const jobsapiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${minPackage}&search=${input}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(jobsapiUrl, options)
    const jobsData = await response.json()
    if (response.ok === true) {
      const fetchedJobsData = jobsData.jobs.map(eachJob => ({
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        jobsapiStatus: apiConstans.success,
        jobsList: fetchedJobsData,
      })
    } else {
      this.setState({jobsapiStatus: apiConstans.failure})
    }
  }

  retryButton = () => this.getProfile()

  renderFailureView = () => (
    <button className="retry-button" type="button" onClick={this.retryButton}>
      Retry
    </button>
  )

  renderSuccessView = () => {
    const {profileData} = this.state

    const {name, profileImageUrl, shortBio} = profileData

    return (
      <div className="profile-view">
        <img alt={name} className="profile-image" src={profileImageUrl} />
        <h1 className="profile-heading">{name}</h1>
        <p className="profile-para">{shortBio}</p>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader
        type="ThreeDots"
        data-testid="loader"
        color="#ffffff"
        height="50"
        width="50"
      />
    </div>
  )

  renderProfile = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstans.inProgress:
        return this.renderLoadingView()
      case apiConstans.success:
        return this.renderSuccessView()
      case apiConstans.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  onClickRetryJobsButton = () => {
    this.getJobs()
  }

  renderJobsFailureView = () => (
    <div className="failure-view">
      <img
        className="failure-image"
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        className="retry-button"
        onClick={this.onClickRetryJobsButton}
        type="button"
      >
        Retry
      </button>
    </div>
  )

  noJobsView = () => (
    <div className="no-jobs-container">
      <img
        className="no-jobs"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-para">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderJobsSuccessView = () => {
    const {jobsList} = this.state
    const isShowJobsList = jobsList.length > 0

    return isShowJobsList ? (
      <ul className="jobs-container">
        {jobsList.map(eachJob => (
          <JobCard jobDetails={eachJob} key={eachJob.id} />
        ))}
      </ul>
    ) : (
      this.noJobsView()
    )
  }

  renderJobs = () => {
    const {jobsapiStatus} = this.state
    switch (jobsapiStatus) {
      case apiConstans.inProgress:
        return this.renderLoadingView()
      case apiConstans.success:
        return this.renderJobsSuccessView()

      case apiConstans.failure:
        return this.renderJobsFailureView()
      default:
        return null
    }
  }

  onEnterSearchInput = event => {
    this.setState({input: event.target.value})
  }

  searchInput = () => {
    this.getJobs()
  }

  changeEmployment = employmentType => {
    this.setState({employmentType}, this.getJobs)
  }

  changeSalary = minPackage => {
    this.setState({minPackage}, this.getJobs)
  }

  render() {
    const {input} = this.state
    console.log(input)
    return (
      <div className="jobs-container">
        <Header />
        <div className="jobs-bottom">
          <div className="left-jobs">
            {this.renderProfile()}

            <hr />

            <div>
              <FilterGroup
                employmentTypesList={employmentTypesList}
                salaryRangesList={salaryRangesList}
                changeEmployment={this.changeEmployment}
                changeSalary={this.changeSalary}
              />
            </div>
          </div>
          <div className="right-jobs">
            <div className="search-input-container">
              <input
                onChange={this.onEnterSearchInput}
                value={input}
                className="search-input"
                placeholder="Search"
                type="search"
              />
              <button
                onClick={this.searchInput}
                type="button"
                className="btn-search"
                data-testid="searchButton"
              >
                <BsSearch className="search-icon" data-testid="searchButton" />
              </button>
            </div>
            <div className="renderjobs-container">{this.renderJobs()}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
