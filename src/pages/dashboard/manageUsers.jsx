import React, { useContext, useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  Chip,
  Button,
  Input,
  Select,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Checkbox,
  Option,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  PlusIcon,
  KeyIcon
} from "@heroicons/react/24/outline";
// import { Link, useLocation } from "react-router-dom";
import { IsLogin, Role } from "@/context";
import { getCookie, setCookie } from "cookies-next";
import ListUsers from "@/api/auth/listUsers";
import changePassword from "@/api/auth/changePasword";
import { ToastContainer, toast } from "react-toastify";
import createUser from "@/api/auth/createUser";
import { Navigate, useNavigate } from "react-router-dom";



export function ManageUsers() {
  const [data, setData] = useState([]);
  const isLogin = useContext(IsLogin);
  const isRole = useContext(Role);
  const navigate = useNavigate();

  const [selectedUsername, setSelectedUsername] = useState('');
  const [formChangePassData, setFormChangePassData] = useState({
    newPassword: '',
    confirmNewPassword: ''
  });
  const [formCreateUserData, setFormCreateUserData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: '',
  })
  const [isDialogChangePasswordOpen, setIsDialogOpen] = useState(false);
  const [isDialogCreateUser, setIsDialogCreateUser] = useState(false);
  const [error, setError] = useState('');

  const handleOpenDialog = (username) => {
    setSelectedUsername(username);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedUsername('');
  };

  const handleInputChange = (formType) => (e) => {
    const { name, value } = e.target;

    // Update form data based on formType
    if (formType === 'changePassword') {
      setFormChangePassData({
        ...formChangePassData,
        [name]: value
      });
    } else if (formType === 'createUser') {
      setFormCreateUserData({
        ...formCreateUserData,
        [name]: value
      });
    }
  };


  const handleInputSelectChange = (formType) => (e) => {
    const { name, value } = e.target;
    if (formType === 'createUser') {
      setFormCreateUserData({
        ...formCreateUserData,
        [name]: value
      });
    }
  }

  // const category = isProjectPath && "Business plan"


  async function getListUsers() {
    const res = await ListUsers(getCookie('token'));
    if (res) {
      if (res.status === "200") {
        // console.log(res)
        setData(res.data)
      }
    }
  }

  const handleChangePassword = async () => {
    const res = await changePassword({ newPassword: formChangePassData.newPassword, username: selectedUsername }, getCookie('token'));
    if (res) {
      if (res.status === '200') {
        toast.success(res.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // console.log("changed password")
      }

      if (res.err.type === "validator" || res.err.type === "service") {
        toast.error(res.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
    setFormChangePassData({
      newPassword: "",
      confirmNewPassword: ""
    })
  };

  const validatePasswords = () => {
    if (formCreateUserData.password !== formCreateUserData.confirmPassword || formChangePassData.newPassword !== formChangePassData.confirmNewPassword) {
      setError('Passwords do not match');
      return false;
    } else {
      setError('');
      return true;
    }
  };

  const handleCreateUser = async () => {
    if (!validatePasswords()) {
      return; // Cancel the process if passwords don't match
    }

    const res = await createUser({
      name: formCreateUserData.name,
      username: formCreateUserData.username,
      password: formCreateUserData.password,
      role: formCreateUserData.role,
    }, getCookie('token'));
    if (res) {
      if (res.status === '200') {
        toast.success(res.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

      }
      if (res.err.type === "validator" || res.err.type === "service") {
        toast.error(res.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
    setFormCreateUserData({
      name: '',
      username: '',
      password: '',
      confirmPassword: '',
      role: '',
    })
  }

  useEffect(() => {
    if (!getCookie("isReload") && getCookie("token")) {
      setCookie("isReload", "true");
      window.location.reload();
    }
    if (isRole === "super admin") {
      getListUsers();
    } else {
      navigate('/')
    }
    // getAnalyze();
    // getMasterData();
  }, []);

  useEffect(() => {
    validatePasswords();
  }, [formCreateUserData.password, formCreateUserData.confirmPassword, formChangePassData.newPassword, formChangePassData.confirmNewPassword])



  const headers = [
    "Username",
    "Name",
    "Role",
    "Action"
  ];

  // console.log(data)
  return (
    // <SearchBar.Provider value={{ searchData, setSearchData }}>
    <div className="mt-12">
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-1">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center gap-4 p-6 z-10"
          >
            <div className="flex items-center justify-between w-full gap-3 flex-wrap">
              <div
                className={` flex flex-wrap items-center gap-4 `}
              >

                <div className="py-4">
                  <Typography variant="h6" color="blue-gray" className="mb-1 align-middle">
                    Manage User
                  </Typography>
                </div>
                {
                  isLogin && (
                    <div className={`flex items-start md:flex-1`}>
                      {/* <Link to={`./upload`}> */}
                      <IconButton
                        size="sm"
                        variant="text"
                        color="blue-gray"
                        onClick={() => setIsDialogCreateUser(!isDialogCreateUser)}
                      >
                        <PlusIcon
                          strokeWidth={3}
                          fill="currenColor"
                          className="h-6 w-6"
                        />
                      </IconButton>
                      {/* </Link> */}
                    </div>
                  )
                }
              </div>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {headers.map((el) => {
                    return (
                      <th key={el} className="border-b border-blue-gray-50 py-3 px-6 text-center whitespace-nowrap">
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    );
                  }
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map(({ username, name, role }, key) => {
                  const className = `py-3 px-3 text-center ${key === data.length - 1 ? '' : 'border-b border-blue-gray-50'
                    }`;

                  return (
                    <tr key={key} className="even:bg-blue-gray-50/50">
                      <td
                        className={`w-60 ${className}`}
                      >
                        <Typography
                          variant="small"
                          className="text-xs font-bold text-blue-gray-900 text-center"
                        >
                          {username}
                        </Typography>
                      </td>
                      <td className={`${className} flex justify-center`}>
                        <div className="flex flex-col gap-4 ml-3">
                          <Typography
                            variant="small"
                            className="text-xs font-bold text-blue-gray-900 text-center"
                          >
                            {name}
                          </Typography>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography
                          variant="small"
                          className="text-xs font-medium text-blue-gray-600"
                        >
                          {role}
                        </Typography>
                      </td>
                      <td className={`${className}`}>
                        <IconButton
                          size="sm"
                          variant="text"
                          onClick={() => handleOpenDialog(username)}
                        >
                          <KeyIcon className="h-6 w-6" />
                        </IconButton>
                      </td>
                    </tr>
                  );
                })}

                <Dialog
                  size="xxl"
                  open={isDialogChangePasswordOpen}
                  handler={handleCloseDialog}
                  className="bg-transparent shadow-none"
                  dismiss={{ enabled: false }}
                >
                  <Card className="mx-auto">
                    <CardBody className="flex justify-center">
                      <form className="mt-4 mb-2 mx-auto w-80 max-w-screen-lg gap-4">
                        <Typography variant="h5" color="blue-gray" className="text-center">
                          Change Password
                        </Typography>
                        <div className="py-2">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-medium"
                          >
                            Username
                          </Typography>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-small pl-3"
                          >
                            {selectedUsername}
                          </Typography>
                        </div>

                        <div className="mb-1 flex flex-col gap-6">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="-mb-3 font-medium"
                          >
                            New Password
                          </Typography>
                          <Input
                            type="password"
                            size="lg"
                            placeholder="New password"
                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                              className: 'before:content-none after:content-none'
                            }}
                            name="newPassword"
                            value={formChangePassData.newPassword}
                            onChange={handleInputChange('changePassword')}
                          />
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="-mb-3 font-medium"
                          >
                            Confirm new password
                          </Typography>
                          <Input
                            type="password"
                            size="lg"
                            placeholder="Confirm new password"
                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                              className: 'before:content-none after:content-none'
                            }}
                            name="confirmNewPassword"
                            value={formChangePassData.confirmNewPassword}
                            onChange={handleInputChange('changePassword')}
                          />
                        </div>
                        {(error !== "") && (
                          <Typography
                            variant="small"
                            color="red"
                            className="mt-2"
                          >
                            {error}
                          </Typography>
                        )}
                        <div className="flex gap-2">
                          <Button variant="outlined" className="mt-6" fullWidth onClick={() => {
                            handleCloseDialog()
                            setFormChangePassData({
                              newPassword: '',
                              confirmNewPassword: ''
                            })
                          }}>
                            Close
                          </Button>
                          <Button className="mt-6" fullWidth onClick={() => {
                            handleCloseDialog()
                            handleChangePassword()
                          }}>
                            SUBMIT
                          </Button>
                        </div>
                      </form>
                    </CardBody>
                  </Card>
                </Dialog>

                <Dialog
                  size="xxl"
                  open={isDialogCreateUser}
                  handler={() => setIsDialogCreateUser(!isDialogCreateUser)}
                  className="bg-transparent shadow-none"
                  dismiss={{ enabled: false }}
                >
                  <Card className="mx-auto">
                    <CardBody className="flex justify-center">
                      <form className="mt-4 mb-2 mx-auto w-80 max-w-screen-lg gap-4">
                        <Typography variant="h5" color="blue-gray" className="text-center">
                          Create User
                        </Typography>
                        <div className="mb-1 flex flex-col gap-6">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="-mb-3 font-medium"
                          >
                            Name
                          </Typography>
                          <Input
                            type="text"
                            size="lg"
                            placeholder="Name"
                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                              className: 'before:content-none after:content-none'
                            }}
                            name="name"
                            value={formCreateUserData.name}
                            onChange={handleInputChange('createUser')}
                          />
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="-mb-3 font-medium"
                          >
                            Username
                          </Typography>
                          <Input
                            type="text"
                            size="lg"
                            placeholder="Username"
                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                              className: 'before:content-none after:content-none'
                            }}
                            name="username"
                            value={formCreateUserData.username}
                            onChange={handleInputChange('createUser')}
                          />
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="-mb-3 font-medium"
                          >
                            Password
                          </Typography>
                          <Input
                            type="password"
                            size="lg"
                            placeholder="Password"
                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                              className: 'before:content-none after:content-none'
                            }}
                            name="password"
                            value={formCreateUserData.password}
                            onChange={handleInputChange('createUser')}
                          />
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="-mb-3 font-medium"
                          >
                            Confirm Password
                          </Typography>
                          <Input
                            type="password"
                            size="lg"
                            placeholder="Confirm password"
                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                              className: 'before:content-none after:content-none'
                            }}
                            name="confirmPassword"
                            value={formCreateUserData.confirmPassword}
                            onChange={handleInputChange('createUser')}
                          />
                          {(error !== "") && (
                            <Typography
                              variant="small"
                              color="red"
                              className="mt-2"
                            >
                              {error}
                            </Typography>
                          )}
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="-mb-3 font-medium"
                          >
                            Role
                          </Typography>
                          <Select
                            size="md"
                            variant="standard"
                            value={formCreateUserData.role}
                            // onChange={(e, value) => handleInputSelectChange('createUser')(e, value)}                            
                            onChange={(e) => handleInputSelectChange('createUser')({ target: { name: 'role', value: e } })}
                            // onChange={(e) => {
                            //   handleChange({
                            //     target: { id: key, name: "status", value: e },
                            //   });
                            //   toggleRowStatus(key);
                            // }}
                            // className="w-32 "
                            // onChange={(e) => console.log(e)}

                            name="role"
                          >
                            <Option value="1">Admin</Option>
                            <Option value="2">Staff</Option>

                          </Select>
                          {/* <Input
                            type="password"
                            size="lg"
                            placeholder="re-type new password"
                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                              className: 'before:content-none after:content-none'
                            }}
                            name="reTypeNewPassword"
                            value={formData.reTypeNewPassword}
                            onChange={handleInputChange}
                          /> */}

                        </div>
                        <div className="flex gap-2">
                          <Button variant="outlined" className="mt-6" fullWidth onClick={() => {
                            setFormCreateUserData({
                              name: '',
                              username: '',
                              password: '',
                              confirmPassword: '',
                              role: '',
                            })
                            setIsDialogCreateUser(!isDialogCreateUser)
                          }}>
                            Close
                          </Button>
                          <Button className="mt-6" fullWidth onClick={() => {
                            setIsDialogCreateUser(!isDialogCreateUser)
                            handleCreateUser()
                          }}>
                            SUBMIT
                          </Button>
                        </div>
                      </form>
                    </CardBody>
                  </Card>
                </Dialog>
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
        transition:Bounce />
    </div>
    // </SearchBar.Provider>
  );
}

export default ManageUsers;
