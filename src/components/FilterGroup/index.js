import './index.css'

const FilterGroup = props => {
  const renderEmployeeTypes = () => {
    const {employmentTypesList} = props
    return employmentTypesList.map(eachType => {
      const {changeEmployment} = props
      const onChangeemploymentType = event =>
        changeEmployment(event.target.value)

      return (
        <li key={eachType.employmentTypeId} className="list-el-employeeType">
          <input
            onChange={onChangeemploymentType}
            id={eachType.employmentTypeId}
            value={eachType.employmentTypeId}
            name={eachType.employmentTypeId}
            type="checkbox"
          />
          <label className="label-el" htmlFor={eachType.employmentTypeId}>
            {eachType.label}
          </label>
        </li>
      )
    })
  }

  const renderSalary = () => {
    const {salaryRangesList} = props
    return salaryRangesList.map(eachOne => {
      const {changeSalary} = props
      const onChangeSalary = event => changeSalary(event.target.value)
      return (
        <li key={eachOne.salaryRangeId} className="list-el-employeeType">
          <input
            onChange={onChangeSalary}
            name="salary"
            id={eachOne.salaryRangeId}
            value={eachOne.salaryRangeId}
            type="radio"
          />
          <label className="label-el" htmlFor={eachOne.salaryRangeId}>
            {eachOne.label}
          </label>
        </li>
      )
    })
  }

  return (
    <div className="filter-container">
      <h1 className="employement-type-heading">Type of Employment</h1>
      <ul className="emploeyee-type-container">{renderEmployeeTypes()}</ul>
      <hr />
      <h1 className="employement-type-heading">Salary Range</h1>
      <ul className="emploeyee-type-container">{renderSalary()}</ul>
    </div>
  )
}

export default FilterGroup
