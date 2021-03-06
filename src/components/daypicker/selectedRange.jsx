import React from 'react'
import Helmet from 'react-helmet'
import DayPicker, {DateUtils} from 'react-day-picker'
import moment from 'moment'
import 'react-day-picker/lib/style.css'

export default class SelectedRange extends React.Component {
  static defaultProps = {
    numberOfMonths: 1,
  }

  constructor(props) {
    super(props)
    this.handleDayClick = this.handleDayClick.bind(this)
    this.state = this.getInitialState()
  }

  getInitialState() {
    return {
      from: this.props.start ? new Date(this.props.start) : undefined,
      to: this.props.end ? new Date(this.props.end) : undefined,
    }
  }

  handleDayClick(day) {
    const range = DateUtils.addDayToRange(day, this.state)
    const {from, to} = range
    if (!from && !to) {
      if (this.props.setStart && this.props.setEnd) {
        this.props.setStart(undefined)
        this.props.setEnd(undefined)

        this.props.setDate && this.props.setDate({})
      }

      this.props.refetch &&
        this.props.refetch({start: undefined, end: undefined})
    } else if (from && to) {
      console.log('from', from)
      console.log('to', to)
      const start = moment(from.toISOString())
        .startOf('day')
        .toISOString()
      const end = moment(to.toISOString())
        .endOf('day')
        .toISOString()
      // for use on Home page
      if (this.props.setStart && this.props.setEnd) {
        this.props.setStart(start)
        this.props.setEnd(end)
      }

      // for use in FilterMenu
      this.props.updateDateRange &&
        this.props.updateDateRange(
          start,
          end,
          this.props.qsFilters,
          this.props.filterAddress,
        )

      this.props.refetch && this.props.refetch({start, end})
    } // end else if

    this.setState(range)

    // for use on Home page
    this.props.setEventRange && this.props.setEventRange(undefined)
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.start !== prevProps.start ||
      this.props.end !== prevProps.end
    ) {
      this.setState({
        from: this.props.start ? new Date(this.props.start) : undefined,
        to: this.props.end ? new Date(this.props.end) : undefined,
      })
    }
  }

  render() {
    const {from, to} = this.state
    const modifiers = {start: from, end: to}
    return (
      <div>
        <DayPicker
          className='Selectable'
          numberOfMonths={this.props.numberOfMonths}
          selectedDays={[from, {from, to}]}
          modifiers={modifiers}
          onDayClick={this.handleDayClick}
        />
        <Helmet>
          <style>{`
  .Selectable .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
    background-color: rgba(255, 75, 77, 0.2) !important;
    color: #21242c;
  }

  .Selectable .DayPicker-Month{
    margin: 0;
  }

  .Selectable .DayPicker-Day {
    border-radius: 0 !important;
  }
  .Selectable .DayPicker-Day--start {
    border-top-left-radius: 50% !important;
    border-bottom-left-radius: 50% !important;
    background-color: #ff4b4d !important
  }
  .Selectable .DayPicker-Day--end {
    border-top-right-radius: 50% !important;
    border-bottom-right-radius: 50% !important;
    background-color: #ff4b4d !important
  }
`}</style>
        </Helmet>
      </div>
    )
  }
}
