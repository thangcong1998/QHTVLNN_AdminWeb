import React, {useEffect, useState} from "react";
import {useDropzone} from "react-dropzone";
import preview from './upload-background.gif';

export default function Upload ({files, setFiles, limitHeight}) {
    const [fileUpload, setFileUpload] = useState([]);
    const [imageView, setImageView] = useState();
    const [loadingFist, setLoadingFist] = useState(true);
    useEffect(() => {
        if(files !== undefined && loadingFist === true) {
            setImageView(process.env.REACT_APP_UPLOAD_IMAGE_URL + '/storage/' + files);
            setFileUpload(fileUpload.concat({name: '', preview: process.env.REACT_APP_UPLOAD_IMAGE_URL + '/storage/' + files}));
            setLoadingFist(false);
        }
    });
    const {getRootProps, getInputProps} = useDropzone({
        onDrop: (acceptedFiles) => {
            setFileUpload(
                acceptedFiles.map(file => Object.assign(file, {
                    preview: URL.createObjectURL(file)
                }, setFiles(file), setLoadingFist(false))),
            )
        }
    });
    const images = fileUpload.map(value => {
        let temp = value.name;
        let arrayName = temp.split('.');
        let typeFile = arrayName[arrayName.length - 1];
        if( typeFile == 'jpg' || typeFile == 'png' || typeFile == 'gif' || typeFile == 'jpeg' ||
            typeFile == 'JPG' || typeFile == 'PNG' || typeFile == 'GIF' || typeFile == 'JPEG' || files !== undefined
        ) {
            return (
                <div key={value.name}>
                    <div style={{ textAlign: 'center'}}>
                        <img src={value.preview} style={ limitHeight ? { maxWidth: '100%', height: 'auto', maxHeight: 300} : { width: '100%'}} alt={'preview'} />
                    </div>
                </div>
            )
        }
        else {
            return (
                <p
                    style={{
                        minHeight: '200px',
                        width: '100%',
                        border: '#F44A00 solid 2px',
                        borderRadius: 5,
                        borderStyle: 'dotted',
                        textAlign: 'center',
                        paddingTop: '35%',
                        color: '#F44A00'
                    }}>File được chọn không phải là ảnh</p>
            )
        }
    });
    return (
        <div {...getRootProps()} >
            <input {...getInputProps()} />
            { files ? <div>{images}</div> : <p
                style={{
                    minHeight: '200px',
                    width: '100%',
                    border: '#c4c4c4 solid 2px',
                    borderRadius: 5,
                    borderStyle: 'dotted',
                    textAlign: 'center',
                    verticalAlign: 'middle'
                }}>Kéo thả hoặc nhấn để chọn ảnh</p>}
        </div>
    )

}