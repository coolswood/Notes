import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Dialog from "@mui/material/Dialog";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export default () => {
    return (
        <Dialog
            open={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Авторизуйтесь"}
            </DialogTitle>
            <DialogContent>
                <TextField label="Outlined secondary" color="secondary" variant="filled" />
                <Button>Send</Button>
            </DialogContent>
        </Dialog>
    )
}