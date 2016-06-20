import React, {Component, PropTypes} from 'react'
import Relay from 'react-relay'
import Image from './image'

export default class ImageSlider extends Component{

  static displayName = 'ImageSlider'

  constructor(props){
    super(props)
  }

  componentDidMount() {
    // this.timer = setInterval(() => {
    //   this.props.nextImage()
    // }, this.props.interval)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render(){
    console.log(this.props)
    return null

    let image = this.props.kont.images[this.props.index]
    return (
      <Image
        url={image.url}
        index={this.props.index}
      />
    )
  }
}

ImageSlider.propTypes = {
  // nextImage: PropTypes.func.isRequired,
  // images: PropTypes.arrayOf(PropTypes.object).isRequired,
  // index: PropTypes.number.isRequired,
  // interval: PropTypes.number.isRequired,
}

export default Relay.createContainer(ImageSlider, {
  initialVariables: {
    boardId: 'choose'
  },
  fragments: {
    kont: () => Relay.QL`
      fragment on Images{
        images
      }
    `
  },
})

