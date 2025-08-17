// ** React Imports
import { useContext, useEffect, useState } from 'react'

// ** MUI Imports
import { Accordion, AccordionDetails, AccordionSummary, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Actions Imports
import { getDecodedToken, showErrorToast, showSuccessToast } from 'src/allFunction/commonFunction'
import Spinner from 'src/component/spinner'
import { LoadingContext } from 'src/pages/_app'
import { fetchActiveChildData } from 'src/store/active/childActive'
import { fetchActiveParentData } from 'src/store/active/parentActive'
import { fetchActiveRoleData } from 'src/store/active/roleActive'
// import { addMenu, fetchMenuData, resetMenu } from 'src/store/apps/permissions'
import { adminRoleName, superAdminRoleName, tenantMaster } from 'src/varibles/constant'
import { cancelIcon, resetFilter, resetPermission, saveIcon } from 'src/varibles/icons'
import { addMenu, fetchMenuData, resetMenu } from 'src/api/utility/menuAccess'

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

const PermissionsTable = () => {
  // ** State
  const [roleId, setRoleId] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [permission, setPermissions] = useState([])
  const { showSpinner, setShowSpinner } = useContext(LoadingContext)

  const dispatch = useDispatch()
  const storeRole = useSelector(store => store.roleActive)// ** Hooks
  const filterRoleData = storeRole.data.filter(item => item.rolename.toLowerCase() !== adminRoleName && item.rolename.toLowerCase() !== superAdminRoleName)
  const storeParent = useSelector(store => store.parentActive)
  const sortedParentData = [...storeParent.data].sort((a, b) => a.display_rank - b.display_rank);
  const storeChild = useSelector(store => store.childActive)
  const sortedChildData = [...storeChild.data].sort((a, b) => a.display_rank - b.display_rank);

  const { tenantExpire } = getDecodedToken()

  function getChildsData(parentId) {
    const children = sortedChildData.filter(item => item.parent_id === parentId && item.menu_name !== tenantMaster);
    return children;
  }

  const togglePermission = (id, permissionType) => {
    const permissionIndex = rolePermissions.findIndex(entry => entry.child_id === id);

    if (permissionIndex !== -1) {
      setRolePermissions(prevPermissions => {
        const updatedPermissions = [...prevPermissions];
        const updatedPermission = { ...updatedPermissions[permissionIndex] };
        // Toggle the specific permission type
        updatedPermission[permissionType] = updatedPermission[permissionType] === 1 ? 0 : 1;

        // Automatically set allow_access based on other permissions
        if (updatedPermission.allow_add || updatedPermission.allow_edit || updatedPermission.allow_delete) {
          updatedPermission.allow_access = 1;
        } else if (updatedPermission.allow_access) {
          updatedPermission.allow_access = 1;
        } else {
          updatedPermission.allow_access = 0;
        }

        updatedPermissions[permissionIndex] = updatedPermission;

        return updatedPermissions;
      });
    } else {
      // Permission not found, add a new permission
      setRolePermissions(prevPermissions => [
        ...prevPermissions,
        {
          child_id: id,
          [permissionType]: 1,
          allow_access: 1,  // Set allow_access to 1 by default
          // Add other properties as needed
        }
      ]);
    }
  };

  const handleRoleChange = (event) => {
    const selectedRoleId = event.target.value;
    setRoleId(selectedRoleId);
    console.log(permission);
    const updatedDataArr = permission.filter(item => item.role_id === selectedRoleId)// Destructure to remove role_id
    setRolePermissions(updatedDataArr);
  }

  const handleSubmit = async () => {
    try {
      setShowSpinner(true);
      const modifiedPermissions = rolePermissions.map(permission => {
        // Include allow_add only if it's defined
        const modifiedPermission = {
          child_id: permission.child_id,
        };

        if (permission.hasOwnProperty('allow_add')) {
          modifiedPermission.allow_add = permission.allow_add;
        }

        if (permission.hasOwnProperty('allow_edit')) {
          modifiedPermission.allow_edit = permission.allow_edit;
        }

        if (permission.hasOwnProperty('allow_access')) {
          modifiedPermission.allow_access = permission.allow_access;
        }

        if (permission.hasOwnProperty('allow_delete')) {
          modifiedPermission.allow_delete = permission.allow_delete;
        }
        return modifiedPermission;
      });


      const allData = { roleId, permission: modifiedPermissions };

      // const response = await addMenu(allData);
      const response = await addMenu(allData)
      setPermissions(response.data)


      // setPermissionsData(response.data)
      if (!response.success) {
        showSuccessToast("Menu Access Saved Successfully.");
      }
      setRoleId(null)
    } catch (error) {
      console.error("An error occurred asynchronously:", error);
      showErrorToast(error.response.data.message ? error.response.data.message : "An unexpected error occurred. Please try again later.");
    } finally {
      setShowSpinner(false);
    }
  };

  const handleClose = () => {
    setRoleId(null)
  };

  const resetFields = async () => {
    // setRoleId(null);
    try {
      setShowSpinner(true)
      const response = await resetMenu(roleId)
      setPermissions(response.data)
      setRolePermissions(response.data.filter(x => x.role_id === roleId))
      // handleClose()
    } catch (error) {
      console.log(error);
    } finally {
      setShowSpinner(false)
    }
  };

  const fetchData = async () => {
    try {
      setShowSpinner(true)
      const response = await fetchMenuData()
      setPermissions(response.data)
    } catch (error) {
      console.log(error);
    } finally {
      setShowSpinner(false)
    }
  }

  useEffect(() => {
    dispatch(fetchActiveParentData())
    dispatch(fetchActiveChildData())
    dispatch(fetchActiveRoleData())
    fetchData()
  }, [])

  return (
    <>

      <Grid container spacing={6}>
        <Grid item xs={12} className='module-heading'>
          <PageHeader
            title={<Typography variant='h6'>Menu Access</Typography>}
          />
        </Grid>
        <Grid item xs={12}>
          <Card>
            <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormControl fullWidth>
                <InputLabel id='role-select'>Role</InputLabel>
                <Select
                  label='Role'
                  value={roleId}
                  MenuProps={MenuProps}
                  id='select-role'
                  onChange={handleRoleChange}
                  labelId='role-select'
                >
                  {filterRoleData.map(item => {
                    return (
                      <MenuItem key={item.id} value={item.id}>
                        {item.rolename}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Box>
          </Card>
          {roleId &&
            <Card sx={{ mt: 5, pb: 5 }}>
              <TableContainer>
                <Table size='small'>
                  <TableBody>
                    {sortedParentData.map((i, index) => {
                      const id = index
                      const isFirstAccordion = id === 0;

                      return (
                        <TableRow key={index} sx={{ '& .MuiTableCell-root:first-of-type': { pl: '10 !important' } }}>
                          <Accordion defaultExpanded={isFirstAccordion} sx={{ width: '100%' }}>
                            <AccordionSummary
                              expandIcon={<Icon icon='mdi:chevron-down' fontSize={20} />}
                              id={i.id}
                            >
                              <Typography sx={{ flexShrink: 0 }}>
                                {i.menu_name}
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              {getChildsData(i.id).map((item) => {
                                return <Table size="small">
                                  <TableRow key={item.id}>
                                    <TableCell width="300rem">
                                      <Typography>
                                        {item.menu_name}
                                      </Typography>
                                    </TableCell>
                                    <TableCell width="20rem">
                                      <FormControlLabel
                                        label='Access'
                                        control={
                                          <Checkbox
                                            size='small'
                                            id={item.id}
                                            onChange={() => togglePermission(item.id, "allow_access")}
                                            checked={rolePermissions.some(entry => entry.child_id === item.id && entry.allow_access === 1)}
                                          />
                                        }
                                      />
                                    </TableCell>
                                    <TableCell width="20rem">
                                      <FormControlLabel
                                        label='Add'
                                        control={
                                          <Checkbox
                                            size='small'
                                            id={item.id}
                                            onChange={() => togglePermission(item.id, "allow_add")}
                                            checked={rolePermissions.some(entry => entry.child_id === item.id && entry.allow_add === 1)}
                                          />
                                        }
                                      />
                                    </TableCell>
                                    <TableCell width="20rem">
                                      <FormControlLabel
                                        label='Edit'
                                        control={
                                          <Checkbox
                                            size='small'
                                            id={item.id}
                                            onChange={() => togglePermission(item.id, "allow_edit")}
                                            checked={rolePermissions.some(entry => entry.child_id === item.id && entry.allow_edit === 1)}
                                          />
                                        }
                                      />
                                    </TableCell>
                                    <TableCell width="20rem">
                                      <FormControlLabel
                                        label='Delete'
                                        control={
                                          <Checkbox
                                            size='small'
                                            id={item.id}
                                            onChange={() => togglePermission(item.id, "allow_delete")}
                                            checked={rolePermissions.some(entry => entry.child_id === item.id && entry.allow_delete === 1)}
                                          />
                                        }
                                      />
                                    </TableCell>
                                  </TableRow>
                                </Table>
                              })}
                            </AccordionDetails>
                          </Accordion>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>


              <Box sx={{ display: 'flex', flexFlow: 'row', alignItems: 'center', justifyContent: 'space-between', mt: 5, px: 3 }}>
                <Box sx={{ display: "flex" }}>
                  {tenantExpire === 0 && <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} onClick={handleSubmit}>
                    <Typography sx={{ display: 'flex', paddingRight: "3px", color: "white" }}><Icon icon={saveIcon} fontSize={20} /></Typography>
                    <Typography sx={{ color: "white" }}>Save</Typography>
                  </Button>}
                  <Button size='large' variant='outlined' color='secondary' sx={{ display: 'flex', alignItems: "center" }} onClick={handleClose}>
                    <Typography sx={{ display: 'flex', paddingRight: "3px" }}> <Icon icon={cancelIcon} fontSize={20} /> </Typography>
                    <Typography>Cancel</Typography>
                  </Button>
                </Box>
                <Box>
                  {tenantExpire === 0 && <Button size='large' variant='contained' sx={{
                    display: 'flex', alignItems: "center", backgroundColor: 'error.main',
                    '&:hover': {
                      backgroundColor: 'error.light'
                    }
                  }} onClick={resetFields} >
                    <Typography sx={{ display: 'flex' }}> <Icon icon={resetPermission} fontSize={20} transform={'rotate(90deg)'} /> </Typography>
                    <Typography sx={{ marginLeft: "8px" }}>Reset</Typography>
                  </Button>}
                </Box>
              </Box>
            </Card>
          }
        </Grid>
      </Grid>
      <Spinner loading={showSpinner} />

    </>
  )
}

export default PermissionsTable
