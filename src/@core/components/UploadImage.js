// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'


// ** Third Party Imports
import { useDropzone } from 'react-dropzone'

// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        marginRight: theme.spacing(5)
    },
    [theme.breakpoints.down('md')]: {
        marginBottom: theme.spacing(4)
    },
    [theme.breakpoints.down('sm')]: {
        width: 250
    }
}))

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
        marginBottom: theme.spacing(4)
    }
}))

const FileUploaderSingle = () => {
    // ** State
    const [files, setFiles] = useState([])

    // ** Hook
    const { getRootProps, getInputProps } = useDropzone({
        multiple: false,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif']
        },
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file)))
        }
    })

    const handleLinkClick = event => {
        event.preventDefault()
    }

    const img = files.map(file => (
        <img key={file.name} alt={file.name} width="100px" height='150px' src={URL.createObjectURL(file)} />
    ))

    return (
        <Box {...getRootProps({ className: 'dropzone' })} sx={files.length ? { height: 450 } : {}}>
            <input {...getInputProps()} />
            {files.length ? (
                img
            ) : (
                <Box sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], textAlign: 'center', bgcolor: '#666CFF', borderRadius: "8px" }}>
                    {/* <Img width={300} alt='Upload img' src='/images/misc/upload.png' /> */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: ['center', 'center', 'inherit'] }} mx="auto" >
                        {/* <HeadingTypography variant='h5'>Drop files here or click to upload.</HeadingTypography> */}
                        <Typography color='white' display='flex' alignItems="center" justifyContent='center' p='10px'>
                            <Icon icon={'mdi:cloud-upload'} /> UPLOAD IMAGE
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    )
}

export default FileUploaderSingle
