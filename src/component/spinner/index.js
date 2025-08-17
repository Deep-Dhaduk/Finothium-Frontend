import { Dialog } from '@mui/material'
import FallbackSpinner from 'src/@core/components/spinner'

const Spinner = (props) => {
    const { loading } = props
    return (
        <Dialog maxWidth='sm' fullWidth open={loading} PaperProps={{
            sx: {
                backgroundColor: 'transparent',
                boxShadow: 'none',
            },
        }}>
            <FallbackSpinner />
        </Dialog>
    )
}

export default Spinner