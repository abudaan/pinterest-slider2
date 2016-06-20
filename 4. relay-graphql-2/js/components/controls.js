import React, {Component, PropTypes} from 'react'
import Range from './range_react'
import Relay from 'react-relay'

class Controls extends Component {

  constructor(){
    super()

  }


  render(){
    console.log(this.props)
    let boards = this.props.session.boards
    let options = [<option value={'choose'} key={'choose'}>{'choose a board'}</option>]
    boards.forEach(board => {
      options.push(<option value={board.id} key={board.id} disabled={board.id === this.props.selectedBoard}>{board.name}</option>)
    })

    return (
      <div>
        <select onChange={this.props.selectBoard} value={this.props.selectedBoard}>
          {options}
        </select>

        <Range
          classLabel={'label-interval'}
          classRange={'range-interval'}
          label={'interval: '}
          min={2000}
          max={20000}
          step={5}
          value={this.props.interval}
          onChange={this.props.selectInterval}
        />

        <button
          disabled={this.props.selectedBoard === 'choose'}
          onClick={() => {
            this.props.start(this.props.selectedBoard)
          }}
        >
          {'start'}
        </button>
      </div>
    )
  }
}


Controls.propTypes = {
//  boards: PropTypes.arrayOf(PropTypes.object),
  start: PropTypes.func.isRequired,
  interval: PropTypes.number.isRequired,
  selectBoard: PropTypes.func.isRequired,
  selectedBoard: PropTypes.string.isRequired,
  selectInterval: PropTypes.func.isRequired,
}


export default Relay.createContainer(Controls, {
  fragments: {
    session: () => Relay.QL`
      fragment on Session{
        boards {
          id,
          url,
          name,
        },
      }
    `
  },
})
