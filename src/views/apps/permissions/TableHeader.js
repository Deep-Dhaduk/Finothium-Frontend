// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import { Accordion, AccordionDetails, AccordionSummary, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useForm } from 'react-hook-form'
import Icon from 'src/@core/components/icon'


import { useDispatch, useSelector } from 'react-redux'
import { fetchChildMenuData } from 'src/store/apps/childMenu'
import { fetchParentMenuData } from 'src/store/apps/parentMenu'
import { addMenu } from 'src/store/apps/permissions'
import { fetchRoleData } from 'src/store/apps/role'
import * as yup from 'yup'

const schema = yup.object().shape({
  name: yup.string().required(),
})

const defaultValues = {
  rolename: '',
  selectedCheckbox: []
}

const TableHeader = props => {

  // ** Props
  const { handleFilter } = props

  // ** State
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(false);
  const [selectedCheckbox, setSelectedCheckbox] = useState([])
  const [personName, setPersonName] = useState();
  const [childData, setChildData] = useState([])
  const [value, setValue] = useState()

  const dispatch = useDispatch()

  const ITEM_HEIGHT = 70
  const ITEM_PADDING_TOP = 8

  const MenuProps = {
    PaperProps: {
      style: {
        width: 250,
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
      }
    }
  }

  const handleDialogToggle = () => {
    setOpen(!open)

  }

  const { reset, control, handleSubmit, formState: { errors } } = useForm({ defaultValues, mode: 'onChange' })


  const togglePermission = (id, item) => {
    const arr = selectedCheckbox

    if (selectedCheckbox.includes(id)) {
      arr.splice(arr.indexOf(id), 1)
      setSelectedCheckbox([...arr])
    } else {
      arr.push({ id, item })
      setSelectedCheckbox([...arr])
    }

    let childArray
    const dataArr = storeChild.data.map(permission => {
      return (
        childArray = { childId: permission.id, Add: 0, Edit: 0, Delete: 0, Read: 0, }
      )
    }
    )
    dataArr.map(permission => {
      if (permission.childId === id) {
        const data = [{
          childId: permission.childId,
          Add: permission.childId === id && item === "Add" ? 1 : 0,
          Edit: permission.childId === id && item === "Edit" ? 1 : 0,
          Delete: permission.childId === id && item === "Delete" ? 1 : 0,
          Read: permission.childId === id && item === "Read" ? 1 : 0,
        },
        ...dataArr];
        setChildData(data)
        return data
      }
    });
    setSelectedCheckbox(childData)
  }


  const handleChange = event => {
    setPersonName(event.target.value)
  }

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleClose = () => {
    setOpen(false)
    setSelectedCheckbox([])
    setValue('')
    setPersonName([])
  }

  const onSubmit = () => {
    dispatch(addMenu({ rolename: personName, childId: childId, selectedCheckbox: selectedCheckbox }))
    setSelectedCheckbox([])
    setOpen(false)
  }

  const storeRole = useSelector(state => state.role)
  const storeParent = useSelector(store => store.parentMenu)
  const storeChild = useSelector(store => store.childMenu)

  useEffect(() => {
    dispatch(fetchRoleData())
  }, [])

  useEffect(() => {
    dispatch(fetchParentMenuData())
    dispatch(fetchChildMenuData())

  }, [])

  function getChildsData(parentId) {
    const child = storeChild.data.filter(item => item.parent_id === parentId)
    return child
  }


  return (
    <>
      <Box
        sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <TextField
          size='small'
          value={value}
          sx={{ mr: 4, mb: 2.5 }}
          placeholder='Search Permission'
          onChange={e => handleFilter(e.target.value)}
        />
        <Button sx={{ mb: 2.5 }} variant='contained' onClick={handleDialogToggle}>
          Add Permission
        </Button>
      </Box>
      <Dialog fullWidth maxWidth='md' scroll='body' onClose={handleClose} open={open}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <Typography variant='h5' component='span'>
            {`Add Permission`}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 6, sm: 12 } }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ my: 4 }}>
              <FormControl fullWidth>
                <InputLabel id='role-select'>Role</InputLabel>
                <Select
                  label='Role'
                  value={personName}
                  MenuProps={MenuProps}
                  id='select-role'
                  onChange={handleChange}
                  labelId='role-select'
                >
                  {storeRole.data.map(item => {
                    return (
                      <MenuItem key={item.id} value={item.id}>
                        {item.rolename}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Box>
            <Typography variant='h6'>Permissions</Typography>
            <TableContainer>
              <Table size='small'>
                <TableBody>
                  {storeParent.data.map((i, index) => {
                    const id = index

                    return (
                      <TableRow key={index} sx={{ '& .MuiTableCell-root:first-of-type': { pl: '0 !important' } }}>
                        <Accordion expanded={expanded === id} onChange={handleAccordionChange(id)} sx={{ width: '100%' }}>
                          <AccordionSummary
                            expandIcon={<Icon icon='mdi:chevron-down' fontSize={20} />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                          >
                            <Typography sx={{ flexShrink: 0 }}>
                              {i.menu_name}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            {getChildsData(i.id).map((item) => {
                              return <TableRow key={item.id}>
                                <TableCell>
                                  <Typography>
                                    {item.menu_name}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <FormControlLabel
                                    label='Access'
                                    control={
                                      <Checkbox
                                        size='small'
                                        id={item.id}
                                        onChange={() => togglePermission(item.id, "Read")}
                                        checked={childData.includes(1)}
                                      />
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <FormControlLabel
                                    label='Add'
                                    control={
                                      <Checkbox
                                        size='small'
                                        id={item.id}
                                        onChange={() => togglePermission(item.id, "Add")}
                                        checked={selectedCheckbox.includes(1, "Add")}
                                      />
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <FormControlLabel
                                    label='Edit'
                                    control={
                                      <Checkbox
                                        size='small'
                                        id={item.id}
                                        onChange={() => togglePermission(item.id, "Edit")}
                                        checked={selectedCheckbox.includes(item.id, "Edit")}
                                      />
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <FormControlLabel
                                    label='Delete'
                                    control={
                                      <Checkbox
                                        size='small'
                                        id={item.id}
                                        onChange={() => togglePermission(item.id, "Delete")}
                                        checked={selectedCheckbox.includes(item.id, "Delete")}
                                      />
                                    }
                                  />
                                </TableCell>
                              </TableRow>

                            })}
                          </AccordionDetails>
                        </Accordion>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
                Submit
              </Button>
              <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
                Cancel
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TableHeader
