import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Fab, TextField, Typography, Box, Tab, Tabs } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { T } from "../../../lib/types/common";
import { Messages } from "../../../lib/config";
import { LoginInput, MemberInput } from "../../../lib/types/member";
import MemberService from "../../../services/MemberService";
import { toastError, toastSuccess } from "../../../lib/toastAlert";
import { useGlobals } from "../../hooks/useGlobals";
import "../../../css/authModal.css";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: "white",
    borderRadius: "20px",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
    padding: 0,
    border: "none",
    overflow: "hidden",
    maxWidth: "850px",
    width: "90%",
    maxHeight: "90vh",
    overflowY: "auto",
    outline: "none",
  },
}));

interface AuthenticationModalProps {
  signupOpen: boolean;
  loginOpen: boolean;
  handleSignupClose: () => void;
  handleLoginClose: () => void;
}

export default function AuthenticationModal(props: AuthenticationModalProps) {
  const { signupOpen, loginOpen, handleSignupClose, handleLoginClose } = props;
  const classes = useStyles();

  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [memberNick, setMemberNick] = useState<string>("");
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");
  const [memberEmail, setMemberEmail] = useState<string>("");
  const { setAuthMember } = useGlobals();

  // Determine which modal is open and set active tab
  useEffect(() => {
    if (signupOpen) {
      setActiveTab("signup");
    } else if (loginOpen) {
      setActiveTab("login");
    }
  }, [signupOpen, loginOpen]);

  // Get the correct close handler based on active tab
  const getCloseHandler = () => {
    return activeTab === "signup" ? handleSignupClose : handleLoginClose;
  };

  /** HANDLERS **/
  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: "login" | "signup",
  ) => {
    setActiveTab(newValue);
    // Clear form fields when switching tabs
    if (newValue === "login") {
      setMemberPhone("");
      setMemberEmail("");
    }
  };

  const handleUserName = (e: T) => {
    setMemberNick(e.target.value);
  };
  const handlePhone = (e: T) => {
    setMemberPhone(e.target.value);
  };
  const handlePassword = (e: T) => {
    setMemberPassword(e.target.value);
  };
  const handleEmail = (e: T) => {
    setMemberEmail(e.target.value);
  };
  const handlePasswordKeyDown = (e: T) => {
    if (e.key === "Enter") {
      if (activeTab === "signup") {
        handleSignupRequest().then();
      } else {
        handleLoginRequest().then();
      }
    }
  };

  const handleSignupRequest = async () => {
    try {
      console.log(
        "inputs",
        memberNick,
        memberPassword,
        memberPhone,
        memberEmail,
      );
      const isFullfill =
        memberNick !== "" &&
        memberPhone !== "" &&
        memberPassword !== "" &&
        memberEmail !== "";
      if (!isFullfill) throw new Error(Messages.error3);

      const signupInput: MemberInput = {
        memberNick: memberNick,
        memberPhone: memberPhone,
        memberPassword: memberPassword,
        memberEmail: memberEmail,
      };

      const member = new MemberService();
      const result = await member.signup(signupInput);
      // Saving Authenticated user
      setAuthMember(result);
      handleSignupClose();
      toastSuccess("Successfully signed up!");
    } catch (err) {
      toastError(err);
    }
  };

  const handleLoginRequest = async () => {
    try {
      console.log("Logininputs", memberNick, memberPassword);
      const isFullfill = memberNick !== "" && memberPassword !== "";
      if (!isFullfill) throw new Error(Messages.error3);

      const loginInput: LoginInput = {
        memberNick: memberNick,
        memberPassword: memberPassword,
      };

      const member = new MemberService();
      const result = await member.login(loginInput);
      // Saving Authenticated user
      setAuthMember(result);
      handleLoginClose();
      toastSuccess("Successfully logged in!");
    } catch (err) {
      toastError(err);
    }
  };

  const switchToSignup = () => setActiveTab("signup");
  const switchToLogin = () => setActiveTab("login");

  // Determine if modal should be open
  const isOpen = signupOpen || loginOpen;

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={isOpen}
        onClose={getCloseHandler()}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isOpen}>
          <div className={classes.paper}>
            <div className="auth-modal-content">
              <div className="auth-modal-image" />
              <div className="auth-modal-form">
                <Box className="auth-modal-tabs">
                  <Tabs value={activeTab} onChange={handleTabChange} centered>
                    <Tab label="Sign In" value="login" />
                    <Tab label="Create Account" value="signup" />
                  </Tabs>
                </Box>

                {activeTab === "login" ? (
                  <>
                    <Typography variant="h2" className="auth-modal-title">
                      Welcome Back
                    </Typography>
                    <Typography variant="body1" className="auth-modal-subtitle">
                      Sign in to your account to continue
                    </Typography>
                    <div className="auth-modal-fields">
                      <TextField
                        id="username"
                        label="Username"
                        variant="outlined"
                        onChange={handleUserName}
                        fullWidth
                        className="auth-modal-field"
                      />
                      <TextField
                        id="password"
                        label="Password"
                        type="password"
                        variant="outlined"
                        onChange={handlePassword}
                        onKeyDown={handlePasswordKeyDown}
                        fullWidth
                        className="auth-modal-field"
                      />
                    </div>
                    <Fab
                      variant="extended"
                      onClick={handleLoginRequest}
                      className="auth-modal-button"
                    >
                      <LoginIcon sx={{ mr: 1 }} />
                      Sign In
                    </Fab>
                    <div className="auth-modal-switch">
                      Don't have an account?
                      <span onClick={switchToSignup}> Sign up</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Typography variant="h2" className="auth-modal-title">
                      Create Account
                    </Typography>
                    <Typography variant="body1" className="auth-modal-subtitle">
                      Join our community and start shopping
                    </Typography>
                    <div className="auth-modal-fields">
                      <TextField
                        id="username"
                        label="Username"
                        variant="outlined"
                        onChange={handleUserName}
                        fullWidth
                        className="auth-modal-field"
                      />
                      <TextField
                        id="phone-number"
                        label="Phone Number"
                        variant="outlined"
                        onChange={handlePhone}
                        fullWidth
                        className="auth-modal-field"
                      />
                      <TextField
                        id="email"
                        label="Email"
                        variant="outlined"
                        onChange={handleEmail}
                        fullWidth
                        className="auth-modal-field"
                      />
                      <TextField
                        id="password"
                        label="Password"
                        type="password"
                        variant="outlined"
                        onChange={handlePassword}
                        onKeyDown={handlePasswordKeyDown}
                        fullWidth
                        className="auth-modal-field"
                      />
                    </div>
                    <Fab
                      variant="extended"
                      onClick={handleSignupRequest}
                      className="auth-modal-button"
                    >
                      <PersonAddIcon sx={{ mr: 1 }} />
                      Sign Up
                    </Fab>
                    <div className="auth-modal-switch">
                      Already have an account?
                      <span onClick={switchToLogin}> Sign in</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
