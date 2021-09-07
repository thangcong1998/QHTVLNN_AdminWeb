import React, {useState} from "react";
import {
    Fab,
    MenuItem,
    Menu,
    Button
} from "@material-ui/core";
import {useHistory} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import DescriptionIcon from '@material-ui/icons/Description';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import BusinessIcon from '@material-ui/icons/Business';
import LocationCityIcon from '@material-ui/icons/LocationCity';

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));

export default function AddButton() {
    const classes = useStyles();
    const [isOpen, setIsOpen] = useState(false);
    const history = useHistory();
    const setOpenMenu = () => {
        setIsOpen(true);
    };
    const setCloseMenu = () => {
        setIsOpen(false);
    }
    return (
        <div>
            <Fab variant="extended" color="primary" aria-label="add" className={classes.margin} onClick={() => setOpenMenu()}>
                <ControlPointIcon />
            </Fab>
            <Menu open={isOpen} onClose={() => setCloseMenu()} style={{ backgroundColor: null}}>
                <MenuItem style={{ position: "fixed", right: '20px', bottom: '100px', backgroundColor: "revert"}} >
                    <Fab
                        variant="extended"
                        size="medium"
                        color="primary"
                        aria-label="add"
                        className={classes.margin}
                        disableRipple={true}
                        disableFocusRipple={true}
                        onClick={() => history.push('/quanly/document/create')}
                    >
                        <DescriptionIcon className={classes.extendedIcon} />
                        Thêm mới tài liệu
                    </Fab>
                </MenuItem>
                <MenuItem style={{ position: "fixed", right: '20px', bottom: '150px', backgroundColor: "revert"}}>
                    <Fab
                        variant="extended"
                        size="medium"
                        color="primary"
                        aria-label="add"
                        className={classes.margin}
                        onClick={() => history.push('/quanly/article/create')}
                    >
                        <AssignmentIcon className={classes.extendedIcon} />
                        Thêm mới bài viết
                    </Fab>
                </MenuItem>
                <MenuItem style={{ position: "fixed", right: '20px', bottom: '200px', backgroundColor: "revert"}}>
                    <Fab
                        variant="extended"
                        size="medium"
                        color="primary"
                        aria-label="add"
                        className={classes.margin}
                        onClick={() => history.push('/quanly/setting/create')}
                    >
                        <ContactPhoneIcon className={classes.extendedIcon} />
                        Thêm mới thông tin liên lạc
                    </Fab>
                </MenuItem>
                <MenuItem style={{ position: "fixed", right: '20px', bottom: '250px', backgroundColor: "revert"}}>
                    <Fab
                        variant="extended"
                        size="medium"
                        color="primary"
                        aria-label="add"
                        className={classes.margin}
                        onClick={() => history.push('/quanly/companies/create')}
                    >
                        <BusinessIcon className={classes.extendedIcon} />
                        Thêm mới doanh nghiệp
                    </Fab>
                </MenuItem>
                <MenuItem style={{ position: "fixed", right: '20px', bottom: '300px', backgroundColor: "revert"}}>
                    <Fab
                        variant="extended"
                        size="medium"
                        color="primary"
                        aria-label="add"
                        className={classes.margin}
                        onClick={() => history.push('/quanly/laborDepartment/create')}
                    >
                        <LocationCityIcon className={classes.extendedIcon} />
                        Thêm mới sở lao động
                    </Fab>
                </MenuItem>
            </Menu>
        </div>
    )

}
