import React, {Component, PropTypes} from 'react'
import Relay, {RootContainer} from 'react-relay'
import Authorize from '../components/authorize'
import Controls from '../components/controls'
import ImageSlider from '../components/image_slider'
import * as DisplayStates from '../constants/display_states'
import AppRoute from '../relay/app_route'
import BoardRoute from '../relay/board_route'
import * as PinterestAPI from '../pinterest/api'

// only component with state

class App extends Component{

  static displayName = 'App'

  constructor(){
    super()

    this.state = {
      displayState: DisplayStates.AUTHORIZE,
      message: 'checking session',
      selectedBoard: 'choose',
      interval: 6000,
      index: 0,
    }

    this._selectBoard = (e) => {
      let boardId = e.target.options[e.target.selectedIndex].value
      this.state = {...this.state, selectedBoard: boardId}
      this.props.relay.setVariables({boardId})
    }

    this._selectInterval = (e) => {
      let interval = parseInt(e.target.valueAsNumber, 10)
      this.state = {...this.state, interval}
      this.setState(this.state)
    }

    this._start = () => {
      this.state = {...this.state, displayState: DisplayStates.RUN}
      this.setState(this.state)
    }

    this._nextImage = () => {
      let index = this.state.index + 1
      let maxIndex = this.props.session.images.length
      if(index === maxIndex){
        index = 0
      }
      this.state = {...this.state, index}
      this.setState(this.state)
    }
  }

  componentWillMount(){
    let authorized = PinterestAPI.checkSession()
    if(authorized === true){
      this.state = {...this.state, displayState: DisplayStates.CONFIGURE}
      this.setState(this.state)
    }
  }

  render(){

    switch(this.state.displayState){

      case DisplayStates.AUTHORIZE:
        return <Authorize onClick={function(e){
          PinterestAPI.login()
        }}/>

      case DisplayStates.CONFIGURE:
        return (<RootContainer
          Component={Controls}
          route={new AppRoute()}
          renderFetched={(data) => {
            return (<Controls
              {...data}
              interval={this.state.interval}
              selectedBoard={this.state.selectedBoard}
              selectBoard={this._selectBoard}
              selectInterval={this._selectInterval}
              start={this._start}
            />)
          }}/>)

      case DisplayStates.RUN:
        return (<RootContainer
          Component={ImageSlider}
          route={new BoardRoute({boardId: this.state.selectedBoard})}
          renderFetched={(data) => {
            return (<ImageSlider
              {...data}
              index={this.state.index}
              interval={this.state.interval}
              nextImage={this._nextImage}
            />)
          }}/>)

      default:
        return false
    }
  }
}


export default Relay.createContainer(App, {
  initialVariables: {
    boardId: 'choose'
  },
  fragments: {
    session: () => Relay.QL`
      fragment on Session{
        authorized,
      }
    `
  },
})
