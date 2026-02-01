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

  // Sync tab with whichever prop opened the modal
  useEffect(() => {
    if (signupOpen) {
      setActiveTab("signup");
    } else if (loginOpen) {
      setActiveTab("login");
    }
  }, [signupOpen, loginOpen]);

  /** LOGIC HANDLERS **/

  const handleCloseAll = () => {
    // Reset local state
    setMemberNick("");
    setMemberPhone("");
    setMemberPassword("");
    setMemberEmail("");
    // Close both potential parent states
    handleSignupClose();
    handleLoginClose();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: "login" | "signup") => {
    setActiveTab(newValue);
  };

  const handleUserName = (e: T) => setMemberNick(e.target.value);
  const handlePhone = (e: T) => setMemberPhone(e.target.value);
  const handlePassword = (e: T) => setMemberPassword(e.target.value);
  const handleEmail = (e: T) => setMemberEmail(e.target.value);

  const handlePasswordKeyDown = (e: T) => {
    if (e.key === "Enter") {
      activeTab === "signup" ? handleSignupRequest() : handleLoginRequest();
    }
  };

  const handleSignupRequest = async () => {
    try {
      const isFullfill = memberNick !== "" && memberPhone !== "" && memberPassword !== "" && memberEmail !== "";
      if (!isFullfill) throw new Error(Messages.error3);

      const signupInput: MemberInput = {
        memberNick,
        memberPhone,
        memberPassword,
        memberEmail,
      };

      const member = new MemberService();
      const result = await member.signup(signupInput);
      
      setAuthMember(result);
      toastSuccess("Successfully signed up!");
      handleCloseAll(); // Closes modal correctly
    } catch (err) {
      toastError(err);
    }
  };

  const handleLoginRequest = async () => {
    try {
      const isFullfill = memberNick !== "" && memberPassword !== "";
      if (!isFullfill) throw new Error(Messages.error3);

      const loginInput: LoginInput = {
        memberNick,
        memberPassword,
      };

      const member = new MemberService();
      const result = await member.login(loginInput);
      
      setAuthMember(result);
      toastSuccess("Successfully logged in!");
      handleCloseAll(); // Closes modal correctly
    } catch (err) {
      toastError(err);
    }
  };

  const isOpen = signupOpen || loginOpen;

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={isOpen}
        onClose={handleCloseAll}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
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
                        value={memberNick}
                        onChange={handleUserName}
                        fullWidth
                        className="auth-modal-field"
                      />
                      <TextField
                        id="password"
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={memberPassword}
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
                      <span onClick={() => setActiveTab("signup")}> Sign up</span>
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
                        value={memberNick}
                        onChange={handleUserName}
                        fullWidth
                        className="auth-modal-field"
                      />
                      <TextField
                        id="phone-number"
                        label="Phone Number"
                        variant="outlined"
                        value={memberPhone}
                        onChange={handlePhone}
                        fullWidth
                        className="auth-modal-field"
                      />
                      <TextField
                        id="email"
                        label="Email"
                        variant="outlined"
                        value={memberEmail}
                        onChange={handleEmail}
                        fullWidth
                        className="auth-modal-field"
                      />
                      <TextField
                        id="password"
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={memberPassword}
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
                      <span onClick={() => setActiveTab("login")}> Sign in</span>
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