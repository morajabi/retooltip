import { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { generateId } from './utils'

class Retooltip extends PureComponent {
  static propTypes = {
    children: PropTypes.func,
    environment: PropTypes.shape({
      addEventListener: PropTypes.func,
      removeEventListener: PropTypes.func,
    }),
  }

  static defaultProps = {
    environment: typeof window === 'undefined' ? {} : window,
  }

  constructor(p) {
    super(p)
    this.tooltipId = generateId('retooltip')
  }

  state = {
    isOpen: false,
  }

  componentDidMount() {
    const { environment } = this.props
    if (environment) {
      environment.addEventListener('keydown', this.handleKeyPress)
    }
  }

  componentWillUnmount() {
    const { environment } = this.props
    if (environment) {
      environment.removeEventListener('keydown', this.handleKeyPress)
    }
  }

  render() {
    const { children } = this.props
    const { isOpen } = this.state

    const childrenProps = {
      isOpen,

      getNodeProps: this.getNodeProps,
      getTriggerButtonProps: this.getTriggerButtonProps,
      getTooltipProps: this.getTooltipProps,
    }

    return children ? children(childrenProps) : null
  }

  ////////// prop getters

  getNodeProps = () => {
    return {
      onMouseOver: this.onNodeMouseOver,
      onMouseLeave: this.onNodeMouseLeave,

      'aria-describedby': this.tooltipId,
    }
  }

  getTriggerButtonProps = () => {
    return {
      onClick: this.onTriggerButtonClick,

      'aria-controls': this.tooltipId,
      'role': 'button',
    }
  }

  getTooltipProps = () => {
    const { isOpen } = this.state
    return {
      // Keep the tooltip open
      onMouseOver: this.onTooltipMouseOver,
      onMouseUp: this.onTooltipMouseUp,

      id: this.tooltipId,
      role: 'tooltip',
      'aria-hidden': (!isOpen).toString(),
    }
  }

  //\\\\\\\\ prop getters
  ////////// children event handlers

  onNodeMouseOver = () => {
    this.openTooltip()
  }

  onNodeMouseLeave = () => {
    this.closeTooltip()
  }

  onTriggerButtonClick = () => {
    this.toggleTooltip()
  }

  onTooltipMouseOver = () => {
    this.openTooltip()
  }

  onTooltipMouseUp = () => {
    this.closeTooltip()
  }

  //\\\\\\\\ children event handlers

  openTooltip = () => {
    this.setState({ isOpen: true })
  }

  closeTooltip = () => {
    this.setState({ isOpen: false })
  }

  toggleTooltip = () => {
    this.setState(prev => ({ isOpen: !prev.isOpen }))
  }

  handleKeyPress = e => {
    if (e.keyCode === 27) {
      this.closeTooltip()
    }
  }
}

export default Retooltip
