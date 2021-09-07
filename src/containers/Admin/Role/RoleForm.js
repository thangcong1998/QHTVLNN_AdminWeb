import React, { useState, useEffect, useMemo } from "react";
import { useAPI, useFetch } from "../../../api/api";
import { useParams, useHistory } from "react-router-dom";
import Forms from "../../../components/Admin/form/Form";
import { useFormik } from "formik";
import { Button, Card, Checkbox, Grid } from "@material-ui/core";
import "./RoleForm.css";
import Moment from "moment";
import { useDialog } from "../../../components/Dialog";
import {makeStyles} from "@material-ui/styles";
import loading from "../../../assets/image/25.gif";
import {loadingStyle} from '../../../common/constants';

export default function RoleForm() {
  const classes = useStyle();
  const date = new Date();
  const dialog = useDialog();
  const history = useHistory();
  const params = useParams();
  const api = useAPI();
  const [state, setState] = useState(false);
  const [permission, setPermission] = useState([]);
  const [checkType, setCheckType] = useState();
  const [checkAllFile, setCheckAllFile] = useState(0);
  const [updateData, setUpdateData] = useState();
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState([false, false, false, false, false]);
  const [pick, setPick] = useState([0, 0, 0, 0, 0]);
  const [allPick, setAllPick] = useState(0);
  const [action, setAction] = useState({
    mode: params.id ? "update" : "create",
  });

  const [data, setData] = useState({
    name: [
      "Quản trị hệ thống",
      "Quản lý danh mục",
      "Quản lý cổng thông tin điện tử",
      "Quản lý thông tin doanh nghiệp",
        "Quản lý quyết toán",
    ],
    type1: [],
    type2: [],
    type3: [],
    type4: [],
    type5: [],
  });
  const [total, setTotal] = useState([0, 0, 0, 0, 0]);
  const [showRoleName, setShowRoleName] = useState();
  const [showRole, setShowRole] = useState([]);
  const fetcher = useFetch(["get", "/admin/all-permissions"], {
    onSuccess: (res) => {
      let _temp1 = [];
      let _temp2 = [];
      let _temp3 = [];
      let _temp4 = [];
      let _temp5 = [];
      let _tempData = { ...data };
      let _total = [...total];
      res.map((value, i) => {
        if (value.group === 1) {
          _temp1 = _temp1.concat({
            id: value.id,
            name: value.name,
            display_name: value.display_name,
            group: 1,
            check: 0,
            permissions: value.permissions.map((role) => {
              return {
                id: role.id,
                name: role.name,
                display_name: role.display_name,
                check: 0,
                group: 1,
              };
            }),
          });
          _total[0] = _total[0] + value.permissions.length;
        }
        if (value.group === 2) {
          _temp2 = _temp2.concat({
            id: value.id,
            name: value.name,
            display_name: value.display_name,
            group: 2,
            check: 0,
            permissions: value.permissions.map((role) => {
              return {
                id: role.id,
                name: role.name,
                display_name: role.display_name,
                check: 0,
                group: 2,
              };
            }),
          });
          _total[1] = _total[1] + value.permissions.length;
        }
        if (value.group === 3) {
          _temp3 = _temp3.concat({
            id: value.id,
            name: value.name,
            display_name: value.display_name,
            group: 3,
            check: 0,
            permissions: value.permissions.map((role) => {
              return {
                id: role.id,
                name: role.name,
                display_name: role.display_name,
                check: 0,
                group: 3,
              };
            }),
          });
          _total[2] = _total[2] + value.permissions.length;
        }
        if (value.group === 4) {
          _temp4 = _temp4.concat({
            id: value.id,
            name: value.name,
            display_name: value.display_name,
            group: 4,
            check: 0,
            permissions: value.permissions.map((role) => {
              return {
                id: role.id,
                name: role.name,
                display_name: role.display_name,
                check: 0,
                group: 4,
              };
            }),
          });
          _total[3] = _total[3] + value.permissions.length;
        }

        if (value.group === 5) {
          _temp5 = _temp5.concat({
            id: value.id,
            name: value.name,
            display_name: value.display_name,
            group: 5,
            check: 0,
            permissions: value.permissions.map((role) => {
              return {
                id: role.id,
                name: role.name,
                display_name: role.display_name,
                check: 0,
                group: 5,
              };
            }),
          });
          _total[4] = _total[4] + value.permissions.length;
        }
      });
      _tempData.type1 = _temp1;
      _tempData.type2 = _temp2;
      _tempData.type3 = _temp3;
      _tempData.type4 = _temp4;
      _tempData.type5 = _temp5;
      setTotal(_total);
      setData(_tempData);
      setState(true);
      setActive([true, false, false, false, false]);
      setShowRoleName("Quản trị hệ thống");
      setShowRole(_temp1);
      setAllPick(_total[0]);
      setCheckType({ type: 1 });
    },
  });

  const fetcher2 = useFetch(
    params?.id ? ["get", "/admin/role/" + params?.id] : ["get", "/admin/role"],
    {
      onSuccess: (res) => {
        formik.setFieldValue("display_name", res.role.display_name);
        setUpdateData(res.role.permissions);
      },
    }
  );
  useEffect(() => {
    if (
      loading === false &&
      data.type1.length !== 0 &&
      updateData !== undefined
    ) {
      let _data = { ...data };
      let _updateData = [...updateData];
      let _pick = [...pick];
      _data.type1 = [...data.type1];
      _data.type2 = [...data.type2];
      _data.type3 = [...data.type3];
      _data.type4 = [...data.type4];
      _data.type5 = [...data.type5];
      _updateData.map((value) => {
        _data.type1.map((role) => {
          if (value.module_id === role.id) {
            role.check = 1;
          }
          role.permissions.map((subRole) => {
            if (value.id === subRole.id) {
              subRole.check = 1;
              _pick[0] = _pick[0] + 1;
            }
          });
        });
        _data.type2.map((role) => {
          if (value.module_id === role.id) {
            role.check = 1;
          }
          role.permissions.map((subRole) => {
            if (value.id === subRole.id) {
              subRole.check = 1;
              _pick[1] = _pick[1] + 1;
            }
          });
        });
        _data.type3.map((role) => {
          if (value.module_id === role.id) {
            role.check = 1;
          }
          role.permissions.map((subRole) => {
            if (value.id === subRole.id) {
              subRole.check = 1;
              _pick[2] = _pick[2] + 1;
            }
          });
        });
        _data.type4.map((role) => {
          if (value.module_id === role.id) {
            role.check = 1;
          }
          role.permissions.map((subRole) => {
            if (value.id === subRole.id) {
              subRole.check = 1;
              _pick[3] = _pick[3] + 1;
            }
          });
        });

        _data.type5.map((role) => {
          if (value.module_id === role.id) {
            role.check = 1;
          }
          role.permissions.map((subRole) => {
            if (value.id === subRole.id) {
              subRole.check = 1;
              _pick[4] = _pick[4] + 1;
            }
          });
        });
      });
      _data.type1.map((value) => {
        let _value = 1;
        value.permissions.map((children) => {
          if (children.check === 0) {
            _value = 0;
          }
        });
        if (_value === 0) {
          value.check = 0;
        } else {
          value.check = 1;
        }
      });
      _data.type2.map((value) => {
        let _value = 1;
        value.permissions.map((children) => {
          if (children.check === 0) {
            _value = 0;
          }
        });
        if (_value === 0) {
          value.check = 0;
        } else {
          value.check = 1;
        }
      });
      _data.type3.map((value) => {
        let _value = 1;
        value.permissions.map((children) => {
          if (children.check === 0) {
            _value = 0;
          }
        });
        if (_value === 0) {
          value.check = 0;
        } else {
          value.check = 1;
        }
      });
      _data.type4.map((value) => {
        let _value = 1;
        value.permissions.map((children) => {
          if (children.check === 0) {
            _value = 0;
          }
        });
        if (_value === 0) {
          value.check = 0;
        } else {
          value.check = 1;
        }
      });

      _data.type5.map((value) => {
        let _value = 1;
        value.permissions.map((children) => {
          if (children.check === 0) {
            _value = 0;
          }
        });
        if (_value === 0) {
          value.check = 0;
        } else {
          value.check = 1;
        }
      });
      setData(_data);
      setPick(_pick);
      setLoading(true);
    }
  });
  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values, { setFieldError }) => {
      let _temp = [...permission];
      data.type1.map((value) => {
        value.permissions.map((role) => {
          if (role.check === 1) {
            _temp.push(role.name);
          }
        });
      });
      data.type2.map((value) => {
        value.permissions.map((role) => {
          if (role.check === 1) {
            _temp.push(role.name);
          }
        });
      });
      data.type3.map((value) => {
        value.permissions.map((role) => {
          if (role.check === 1) {
            _temp.push(role.name);
          }
        });
      });
      data.type4.map((value) => {
        value.permissions.map((role) => {
          if (role.check === 1) {
            _temp.push(role.name);
          }
        });
      });

      data.type5.map((value) => {
        value.permissions.map((role) => {
          if (role.check === 1) {
            _temp.push(role.name);
          }
        });
      });
      try {
        let res;
        action.mode === "create"
          ? (res = await api.fetcher("post", "/admin/role", {
            ...values,
            permissions: _temp,
          }))
          : (res = await api.fetcher("put", "/admin/role/" + params?.id, {
            ...values,
            updated_at: Moment(date).format('YYYY-MM-DD HH:mm:ss'),
            permissions: _temp,
            id: params?.id
          }));
        if (res) {
          history.push('/quanly/role');
        }
      } catch (e) {
        if (e.data?.errors) {
          Object.keys(e.data.errors).forEach((field) => {
            setFieldError(field, e.data.errors[field][0]);
          });
        }
      }
    },
  });
  const inputs = useMemo(
    () => [
      [
        {
          label: "Tên nhóm người dùng",
          type: "text",
          value: formik.values?.display_name,
          variant: "outlined",
          required: true,
          handleChange: (e) => formik.setFieldValue("display_name", e),
          error: api.error?.display_name,
          grid: { xs: 12, sm: 12, md: 12 },
        },
      ],
    ],
    [formik]
  );
  const showData = (name, value) => {
    let temp = [false, false, false, false, false];
    temp[value] = true;
    setActive(temp);
    setShowRoleName(name);
    if (value === 0) {
      setShowRole(data.type1);
      setAllPick(total[0]);
      setCheckType({ type: 1 });
    }
    if (value === 1) {
      setShowRole(data.type2);
      setAllPick(total[1]);
      setCheckType({ type: 2 });
    }
    if (value === 2) {
      setShowRole(data.type3);
      setAllPick(total[2]);
      setCheckType({ type: 3 });
    }
    if (value === 3) {
      setShowRole(data.type4);
      setAllPick(total[3]);
      setCheckType({ type: 4 });
    }
    if (value === 4) {
      setShowRole(data.type5);
      setAllPick(total[4]);
      setCheckType({ type: 5 });
    }
  };
  const checkValue = (value) => {
    let _temp = { ...data };
    let _pick = [...pick];
    if (value.group === 1) {
      _temp.type1 = [...data.type1];
      _temp.type1.map((role) => {
        role.permissions.map((role2) => {
          if (value.id === role2.id) {
            if (role2.check === 0) {
              role2.check = 1;
              _pick[0] = _pick[0] + 1;
            } else {
              role2.check = 0;
              _pick[0] = _pick[0] - 1;
            }
          }
        });
      });
    }
    if (value.group === 2) {
      _temp.type2 = [...data.type2];
      _temp.type2.map((role) => {
        role.permissions.map((role2) => {
          if (value.id === role2.id) {
            if (role2.check === 0) {
              _pick[1] = _pick[1] + 1;
              role2.check = 1;
            } else {
              _pick[1] = _pick[1] - 1;
              role2.check = 0;
            }
          }
        });
      });
    }
    if (value.group === 3) {
      _temp.type3 = [...data.type3];
      _temp.type3.map((role) => {
        role.permissions.map((role2) => {
          if (value.id === role2.id) {
            if (role2.check === 0) {
              _pick[2] = _pick[2] + 1;
              role2.check = 1;
            } else {
              _pick[2] = _pick[2] - 1;
              role2.check = 0;
            }
          }
        });
      });
    }
    if (value.group === 4) {
      _temp.type4 = [...data.type4];
      _temp.type4.map((role) => {
        role.permissions.map((role2) => {
          if (value.id === role2.id) {
            if (role2.check === 0) {
              _pick[3] = _pick[3] + 1;
              role2.check = 1;
            } else {
              _pick[3] = _pick[3] - 1;
              role2.check = 0;
            }
          }
        });
      });
    }
    if (value.group === 5) {
      _temp.type5 = [...data.type5];
      _temp.type5.map((role) => {
        role.permissions.map((role2) => {
          if (value.id === role2.id) {
            if (role2.check === 0) {
              _pick[4] = _pick[4] + 1;
              role2.check = 1;
            } else {
              _pick[4] = _pick[4] - 1;
              role2.check = 0;
            }
          }
        });
      });
    }
    _temp.type1 = [...data.type1];
    _temp.type2 = [...data.type2];
    _temp.type3 = [...data.type3];
    _temp.type4 = [...data.type4];
    _temp.type5 = [...data.type5];
    _temp.type1.map((value) => {
      let _value = 1;
      value.permissions.map((children) => {
        if (children.check === 0) {
          _value = 0;
        }
      });
      if (_value === 0) {
        value.check = 0;
      } else {
        value.check = 1;
      }
    });
    _temp.type2.map((value) => {
      let _value = 1;
      value.permissions.map((children) => {
        if (children.check === 0) {
          _value = 0;
        }
      });
      if (_value === 0) {
        value.check = 0;
      } else {
        value.check = 1;
      }
    });
    _temp.type3.map((value) => {
      let _value = 1;
      value.permissions.map((children) => {
        if (children.check === 0) {
          _value = 0;
        }
      });
      if (_value === 0) {
        value.check = 0;
      } else {
        value.check = 1;
      }
    });
    _temp.type4.map((value) => {
      let _value = 1;
      value.permissions.map((children) => {
        if (children.check === 0) {
          _value = 0;
        }
      });
      if (_value === 0) {
        value.check = 0;
      } else {
        value.check = 1;
      }
    });
    _temp.type5.map((value) => {
      let _value = 1;
      value.permissions.map((children) => {
        if (children.check === 0) {
          _value = 0;
        }
      });
      if (_value === 0) {
        value.check = 0;
      } else {
        value.check = 1;
      }
    });
    setData(_temp);
    setPick(_pick);
  };
  const checkPermissionGroup = (value) => {
    let _temp = { ...data };
    let _pick = [...pick];
    if (value.group === 1) {
      _temp.type1 = [...data.type1];
      _temp.type1.map((role) => {
        if (role.id === value.id) {
          if (role.check === 0) {
            role.check = 1;
            role.permissions.map((role2) => {
              if (role2.check === 0) {
                _pick[0] = _pick[0] + 1;
              }
              role2.check = 1;
            });
          } else {
            role.check = 0;
            role.permissions.map((role2) => {
              if (role2.check === 1) {
                _pick[0] = _pick[0] - 1;
              }
              role2.check = 0;
            });
          }
        }
      });
    }
    if (value.group === 2) {
      _temp.type2 = [...data.type2];
      _temp.type2.map((role) => {
        if (role.id === value.id) {
          if (role.check === 0) {
            role.check = 1;
            role.permissions.map((role2) => {
              if (role2.check === 0) {
                _pick[1] = _pick[1] + 1;
              }
              role2.check = 1;
            });
          } else {
            role.check = 0;
            role.permissions.map((role2) => {
              if (role2.check === 1) {
                _pick[1] = _pick[1] - 1;
              }
              role2.check = 0;
            });
          }
        }
      });
    }
    if (value.group === 3) {
      _temp.type3 = [...data.type3];
      _temp.type3.map((role) => {
        if (role.id === value.id) {
          if (role.check === 0) {
            role.check = 1;
            role.permissions.map((role2) => {
              if (role2.check === 0) {
                _pick[2] = _pick[2] + 1;
              }
              role2.check = 1;
            });
          } else {
            role.check = 0;
            role.permissions.map((role2) => {
              if (role2.check === 1) {
                _pick[2] = _pick[2] - 1;
              }
              role2.check = 0;
            });
          }
        }
      });
    }
    if (value.group === 4) {
      _temp.type4 = [...data.type4];
      _temp.type4.map((role) => {
        if (role.id === value.id) {
          if (role.check === 0) {
            role.check = 1;
            role.permissions.map((role2) => {
              if (role2.check === 0) {
                _pick[3] = _pick[3] + 1;
              }
              role2.check = 1;
            });
          } else {
            role.check = 0;
            role.permissions.map((role2) => {
              if (role2.check === 1) {
                _pick[3] = _pick[3] - 1;
              }
              role2.check = 0;
            });
          }
        }
      });
    }
    if (value.group === 5) {
      _temp.type5 = [...data.type5];
      _temp.type5.map((role) => {
        if (role.id === value.id) {
          if (role.check === 0) {
            role.check = 1;
            role.permissions.map((role2) => {
              if (role2.check === 0) {
                _pick[4] = _pick[4] + 1;
              }
              role2.check = 1;
            });
          } else {
            role.check = 0;
            role.permissions.map((role2) => {
              if (role2.check === 1) {
                _pick[4] = _pick[4] - 1;
              }
              role2.check = 0;
            });
          }
        }
      });
    }
    setData(_temp);
    setPick(_pick);
  };
  const checkAll = () => {
    let _temp = { ...data };
    let _pick = [...pick];
    if (checkType.type === 1) {
      _temp.type1 = [...data.type1];
      _temp.type1.map((value) => {
        if (checkAllFile === 0) {
          value.check = 1;
          _pick[0] = 5;
          value.permissions.map((role) => {
            role.check = 1;
          });
          setCheckAllFile(1);
        } else {
          value.check = 0;
          _pick[0] = 0;
          value.permissions.map((role) => {
            role.check = 0;
          });
          setCheckAllFile(0);
        }
      });
    }
    if (checkType.type === 2) {
      _temp.type2 = [...data.type2];
      _temp.type2.map((value) => {
        if (checkAllFile === 0) {
          value.check = 1;
          _pick[1] = 9;
          value.permissions.map((role) => {
            role.check = 1;
          });
          setCheckAllFile(1);
        } else {
          value.check = 0;
          _pick[1] = 0;
          value.permissions.map((role) => {
            role.check = 0;
          });
          setCheckAllFile(0);
        }
      });
    }
    if (checkType.type === 3) {
      _temp.type3 = [...data.type3];
      _temp.type3.map((value) => {
        if (checkAllFile === 0) {
          value.check = 1;
          _pick[2] = 7;
          value.permissions.map((role) => {
            role.check = 1;
          });
          setCheckAllFile(1);
        } else {
          value.check = 0;
          _pick[2] = 0;
          value.permissions.map((role) => {
            role.check = 0;
          });
          setCheckAllFile(0);
        }
      });
    }
    if (checkType.type === 4) {
      _temp.type4 = [...data.type4];
      _temp.type4.map((value) => {
        if (checkAllFile === 0) {
          value.check = 1;
          _pick[3] = 4;
          value.permissions.map((role) => {
            role.check = 1;
          });
          setCheckAllFile(1);
        } else {
          value.check = 0;
          _pick[3] = 0;
          value.permissions.map((role) => {
            role.check = 0;
          });
          setCheckAllFile(0);
        }
      });
    }
    if (checkType.type === 5) {
      _temp.type5 = [...data.type5];
      _temp.type5.map((value) => {
        if (checkAllFile === 0) {
          value.check = 1;
          _pick[4] = 3;
          value.permissions.map((role) => {
            role.check = 1;
          });
          setCheckAllFile(1);
        } else {
          value.check = 0;
          _pick[4] = 0;
          value.permissions.map((role) => {
            role.check = 0;
          });
          setCheckAllFile(0);
        }
      });
    }
    setData(_temp);
    setPick(_pick);
  };
  const deleteConfirm = async (row) => {
    console.log(row.data.role.id);
    try {
      const res = await api.fetcher("delete", "admin/role/" + row.data.role.id);
      if (res) {
        history.push('/quanly/role');
      }
    } catch (e) { }
  };
  return (
    <div>
      <Card
        style={{ borderRadius: 10, minHeight: 500, width: "100%", padding: 20 }}
        className={api.loading ? classes.loading : classes.action}
      >
        {data.type1.length !== 0 && <Forms inputs={inputs} />}
        {state === true && (
          <b3
            style={{
              fontSize: 18,
              color: "#1A4973",
              fontWeight: "bold",
              margin: "10px 0px",
              paddingLeft: 10,
            }}
          >
            Danh sách quyền
          </b3>
        )}
        <hr />
        <Grid container spacing={2} style={{ paddingLeft: 10 }}>
          <Grid
            item
            xs={3}
            style={{
              minHeight: 200,
              width: "100%",
              padding: "0px 0px 50px 0px",
              borderRight: "#f3f3f3 solid 1px",
            }}
          >
            {data.type1.length !== 0 &&
              data.type2.length !== 0 &&
              data.type3.length !== 0 &&
              data.type4.length !== 0 &&
                data.type5.length !== 0 &&
              state === true && (
                <span>
                  {data.name.map((value, i) => {
                    return (
                      <div
                        onClick={() => showData(value, i)}
                        style={
                          active[i] === false
                            ? { borderBottom: "#f3f3f3 solid 1px", padding: 10 }
                            : {
                              borderBottom: "#f3f3f3 solid 1px",
                              backgroundColor: "#abd1f7",
                              padding: 10,
                            }
                        }
                      >
                        <strong style={{ fontSize: 15 }}>{value}</strong>
                        <br />
                        <span
                          style={{
                            width: 40,
                            height: 20,
                            borderRadius: 5,
                            backgroundColor: "#0060bf",
                            marginRight: 5,
                            padding: "0px 5px",
                            color: "white",
                          }}
                        >
                          {pick[i]}/{total[i]}
                        </span>
                        <span style={{ fontSize: 15 }}> quyền được chọn</span>
                      </div>
                    );
                  })}
                </span>
              )}
          </Grid>
          <Grid item xs={9} style={{ minHeight: 300 }}>
            <b3 style={{ fontSize: 18, color: "#1A4973", fontWeight: "bold" }}>
              {showRoleName}
              <span style={{ color: "red", fontSize: 13 }}>
                {formik.errors?.permissions}
              </span>
            </b3>
            {showRoleName !== undefined && (
              <span style={{ float: "right" }}>
                <Button minimal style={{ color: "#0060bf" }} onClick={checkAll}>
                  Chọn tất cả ({allPick})
                </Button>
              </span>
            )}
            {data.type1.length !== 0 &&
              data.type2.length !== 0 &&
              data.type3.length !== 0 &&
              data.type4.length !== 0 &&
              data.type5.length !== 0 && (
                <Grid container spacing={2}>
                  {showRole.map((value) => {
                    return (
                      <Grid item xs={6} style={{ padding: 20 }}>
                        <div
                          style={ api.loading ? {
                            padding: 20,
                            borderRadius: "6px",
                          } : {
                            backgroundColor: "#F9F9F9",
                            padding: 20,
                            borderRadius: "6px",
                          }}
                        >
                          <Checkbox
                            onChange={(e) => checkPermissionGroup(value)}
                            checked={value.check === 0 ? false : true}
                            color={"primary"}
                          />
                          <b style={{ fontSize: 15 }}>{value.display_name}</b>
                          {value.permissions.map((value) => {
                            return (
                              <div>
                                <Checkbox
                                  onChange={(e) => checkValue(value)}
                                  checked={value.check === 0 ? false : true}
                                  color={"primary"}
                                />
                                <span style={{ fontSize: 14 }}>
                                  {value.display_name}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
          </Grid>
        </Grid>
        {data.type1.length !== 0 && (
          <div className={"col-md-12"} style={{ float: "right" }}>
            {action.mode === "create" && (
              <span style={{ float: "right" }}>
                <Button
                  variant="contained"
                  onClick={formik.handleSubmit}
                  loading={api.loading}
                  color="primary"
                >
                  {"Thêm mới"}
                </Button>
              </span>
            )}
            {action.mode === "update" && (
              <span style={{ float: "right" }}>
                <Button
                  variant="contained"
                  color={"secondary"}
                  style={{ marginRight: 20 }}
                  onClick={() => deleteConfirm(fetcher2)}
                >
                  {"Xóa"}
                </Button>
                <Button
                  variant="contained"
                  onClick={formik.handleSubmit}
                  loading={api.loading}
                  color="primary"
                >
                  {"Cập nhật"}
                </Button>
              </span>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
const useStyle = makeStyles((theme) => ({
  root: {
    padding: 10,
  },
  action: {
    paddingLeft: 10,
  },
  loading: loadingStyle
}));
