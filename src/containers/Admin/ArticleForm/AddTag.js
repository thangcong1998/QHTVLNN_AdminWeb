import React, {useEffect, useState} from "react";
import { makeStyles } from '@material-ui/core/styles';
import Chip from "@material-ui/core/Chip";
import {Paper} from "@material-ui/core";
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import './ArticleForm.css';
import {array} from "yup";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
    },
    chip: {
        margin: theme.spacing(0.5),
    },
    input: {
        display: 'none',
    },
}));

export default function AddTag ({tags, setTags}) {
    const classes = useStyles();
    const [tagList, setTagList] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [firstTime , setFirstTime] = useState(true);

    useEffect(() => {
        if(tags.length !== 0 && firstTime === true) {
            let temp = (tags + '').split(',');
            let tempTagList = [...tagList];
            temp.map((value, index) => {
                let temp_tag = { key: '', label: ''};
                temp_tag.key = index;
                temp_tag.label = value;
                tempTagList.push(temp_tag);
            });
            setTagList(tempTagList);
            setFirstTime(false);
        }
    });
    const addTag = (e) => {
        if(e.key === 'Enter' || e.key === ',') {
            if(e.target.value !== '') {
                let temp = {key: '',label: ''};
                if(tagList.length === 0) {
                    temp.key = 0;
                }
                else {
                    temp.key = tagList.length;
                }
                temp.label = e.target.value;
                setTagList(tagList.concat(temp));
                setTagInput('');
                setTags(tags.concat(e.target.value));
                setFirstTime(false);
            }
        }
    };
    const showTagInput = (e) => {
        setTagInput(e.target.value);
    };
    const deleteTag = (e,value) => {
        let temp = [...tagList];
        let temp_tags = [];
        tagList.map((data, index) => {
            if(value.key === data.key) {
                temp.splice(index, 1);
            }
        });
        setTagList(temp);
        temp.map((data, index) => {
            temp_tags = temp_tags.concat(data.label);
        });
        setTags(temp_tags);
    };
    return (
        <div style={{ border: '#c4c4c4 solid 2px', borderRadius: 5}}>
            <div className={classes.root}>
                {tagList.map((value, key) => {
                    return (
                        <li key={value.key}>
                            <Chip
                                icon={<LocalOfferIcon />}
                                className={classes.chip}
                                label={value.label.length > 20 ? value.label.substring(0,20)+'...' : value.label}
                                onDelete={e => deleteTag(e,value)}
                                variant={'outlined'}
                                color={'primary'}
                            />
                        </li>
                    )
                })}
            </div>
            <input
                type={'text'}
                onKeyDown={e => addTag(e)}
                style={{ border: '0px', width: '100%', height: '40px'}}
                onChange={e => showTagInput(e)}
                value={tagInput}
                className={'form-control'}
            />
        </div>
    );
}
