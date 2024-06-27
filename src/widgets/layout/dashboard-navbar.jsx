import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Dialog,
  Card,
  CardBody
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
  IsLogin,
  Name,
} from "@/context";
import { useContext, useEffect, useState } from "react";
import { deleteCookie, getCookie } from "cookies-next";
import changePassword from "@/api/auth/changePasword";
import { toast } from "react-toastify";

export function DashboardNavbar() {
  const navigate = useNavigate();
  const isLogin = useContext(IsLogin);
  const name = useContext(Name)
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const [isDialogChangePasswordOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState('');
  console.log(name)


  const [formChangePassData, setFormChangePassData] = useState({
    newPassword: '',
    confirmNewPassword: ''
  });
  const handleDialog = (username) => {
    setIsDialogOpen(!isDialogChangePasswordOpen);
  };

  const handleInputChange = (formType) => (e) => {
    const { name, value } = e.target;

    // Update form data based on formType
    if (formType === 'changePassword') {
      setFormChangePassData({
        ...formChangePassData,
        [name]: value
      });
    } 
  };

  const handleChangePassword = async () => {
    const res = await changePassword({ newPassword: formChangePassData.newPassword, username: name }, getCookie('token'));
    if (res) {
      if (res.status === "200") {
        handleCloseDialog()
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

      else if (res.err.type === "validator" || res.err.type === "service") {
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
    if (formChangePassData.newPassword !== formChangePassData.confirmNewPassword) {
      setError('Passwords do not match');
      return false;
    } else {
      setError('');
      return true;
    }
  };

  useEffect(() => {
    if (formChangePassData.newPassword !== "" && formChangePassData.confirmNewPassword !== "")
        validatePasswords()
  },[formChangePassData.newPassword, formChangePassData.confirmNewPassword]) 

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // setSelectedUsername('');
  };

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
        }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${fixedNavbar ? "mt-1" : ""
              }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {page}
          </Typography>
        </div>
        <div className="flex flex-row-reverse md:flex-row">
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>

          {
            isLogin ?
              <div onClick={() => {
                deleteCookie('token')
                deleteCookie('refreshToken')
                deleteCookie('isReload')

                // setIsLogin(false)
                navigate(0)
              }}>
                <Button
                  variant="text"
                  color="blue-gray"
                  className="hidden items-center gap-1 px-4 xl:flex normal-case"
                >
                  <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                  <Typography
                    variant="small"
                    className="text-[14px] font-medium text-blue-gray-400"
                  >
                    {name}, 
                  Sign Out
                  </Typography>
                </Button>
                <IconButton
                  variant="text"
                  color="blue-gray"
                  className="grid xl:hidden"
                >
                  <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                </IconButton>
              </div>
              :
              <Link to="/auth/sign-in">
                <Button
                  variant="text"
                  color="blue-gray"
                  className="hidden items-center gap-1 px-4 xl:flex normal-case"
                >
                  <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                  Sign In
                </Button>
                <IconButton
                  variant="text"
                  color="blue-gray"
                  className="grid xl:hidden"
                >
                  <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                </IconButton>
              </Link>
          }
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={isLogin ? handleDialog: () => setOpenConfigurator(dispatch, true)}
            // onClick={handleDialog}
          >
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
          <Dialog
                  size="xxl"
                  open={isDialogChangePasswordOpen}
                  handler={handleDialog}
                  className="bg-transparent shadow-none mt-24"
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
                            {name}
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
                            // handleCloseDialog()
                            handleChangePassword()
                          }}>
                            SUBMIT
                          </Button>
                        </div>
                      </form>
                    </CardBody>
                  </Card>
                </Dialog>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
