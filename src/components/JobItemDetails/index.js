import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Header from '../Header'
import EachJobDetails from '../EachJobDetails'
import './index.css'

const apiStatusConstans = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobsList: [],
    apiStatus: apiStatusConstans.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstans.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = `https://apis.ccbp.in/jobs/${id}`

    const jobDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(jobDetailsApiUrl, options)
    const fetchedData = await response.json()

    if (response.ok === true) {
      const data = fetchedData.job_details
      const jobDetails = {
        id: data.id,
        companyLogoUrl: data.company_logo_url,
        companyWebsiteUrl: data.company_website_url,
        employmentType: data.employment_type,
        jobDescription: data.job_description,
        lifeAtCompany: data.life_at_company,
        location: data.location,
        packagePerAnnum: data.package_per_annum,
        rating: data.rating,
        skills: data.skills.map(eachItem => ({
          name: eachItem.name,
          imageUrl: eachItem.image_url,
        })),
        title: data.title,
      }

      const similarJobsList = fetchedData.similar_jobs.map(eachItem => ({
        id: eachItem.id,
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jobDetails,
        similarJobsList,
        apiStatus: apiStatusConstans.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstans.failure})
    }
  }

  loadingView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  retryJobItemDetails = () => this.getJobDetails()

  failureView = () => (
    <div>
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        onClick={this.retryJobItemDetails()}
        className="btn"
        type="button"
      >
        Retry
      </button>
    </div>
  )

  successView = () => {
    const {jobDetails, similarJobsList} = this.state

    return (
      <EachJobDetails
        jobDetails={jobDetails}
        similarJobsList={similarJobsList}
      />
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstans.inProgress:
        return this.loadingView()
      case apiStatusConstans.success:
        return this.successView()
      case apiStatusConstans.failure:
        return this.failureView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-details-container">
        <Header />
        <div className="job-details">{this.renderJobDetails()}</div>
      </div>
    )
  }
}

export default JobItemDetails
