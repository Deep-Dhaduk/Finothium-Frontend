// ** Icon Imports
import { Icon } from '@iconify/react'


const IconifyIcon = ({ icon, padding, transform, paddingLeft, color, ...rest }) => {
  return <Icon icon={icon} fontSize='1.5rem' {...rest} style={{ padding, transform, color, paddingLeft }} />
}

export default IconifyIcon
