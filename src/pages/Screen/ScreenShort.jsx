import React, { useState, useCallback } from 'react';
import "./ScreenShort.css";
import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ScreenShort() {
    const [screenshort, setScreenshort] = React.useState("");
    const [croppedImage, setCroppedImage] = useState(null)
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const imgRef = React.useRef(null);
    const previewCanvasRef = React.useRef(null);
    const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 16 / 9 });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [copyImage, setcopyImage] = useState({ copy: "Copy", colour: "#f706ee" });

    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);

    useEffect(() => {
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
            return;
        }
        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedCrop;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio;

        canvas.width = crop.width * pixelRatio * scaleX;
        canvas.height = crop.height * pixelRatio * scaleY;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
        );
        // As a blob
        return new Promise((resolve, reject) => {
            canvas.toBlob((file) => {
                resolve(URL.createObjectURL(file));
                setcopyImage({ copy: "Copy", colour: "#f706ee" })
                setCroppedImage(URL.createObjectURL(file))
            }, 'image/jpeg')
        })
    }, [completedCrop]);

    const handleClickOpen = () => {
        setOpen(true);
    }
    const showCroppedImage = () => {
        let saveImg = document.getElementById('downloadScreenshort');
        saveImg.href = croppedImage;
        let currentDate = new Date().toLocaleString();
        let completeData = currentDate.split(",")
        saveImg.download = `screenshort_${completeData[0] + completeData[1]}.jpg`;
    }
    const openInNewWindow = () => {
        chrome.runtime.sendMessage({ type: "OPEN_SCREENSHORT_IN_WINDOW", data: croppedImage }, function (response) {
            console.log("JSX Res", response.dataUrl);
        });
    }
    const handleClose = () => {
        setOpen(false);
    };
    const createImage = (options) => {
        options = options || {};
        const img = document.createElement("img");
        if (options.src) {
            img.src = options.src;
        }
        return img;
    };

    const copyToClipboard = async (pngBlob) => {
        try {
            await navigator.clipboard.write([
                // eslint-disable-next-line no-undef
                new ClipboardItem({
                    [pngBlob.type]: pngBlob
                })
            ]);
            setcopyImage({ copy: "Copied", colour: "green" });
            console.log("Image copied");
        } catch (error) {
            console.error(error);
        }
    };

    const convertToPng = (imgBlob) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const imageEl = createImage({ src: window.URL.createObjectURL(imgBlob) });
        imageEl.onload = (e) => {
            canvas.width = e.target.width;
            canvas.height = e.target.height;
            ctx.drawImage(e.target, 0, 0, e.target.width, e.target.height);
            canvas.toBlob(copyToClipboard, "image/png", 1);
        };
    };
    const copyToClipboardImage = async () => {
        const img = await fetch(croppedImage);
        const imgBlob = await img.blob();
        const extension = croppedImage.split(".").pop();
        const supportedToBeConverted = ["jpeg", "jpg", "gif"];
        if (supportedToBeConverted.indexOf(extension.toLowerCase())) {
            return convertToPng(imgBlob);
        } else if (extension.toLowerCase() === "png") {
            return copyToClipboard(imgBlob);
        }
        console.error("Format unsupported");
        return;
    }
    React.useEffect(() => {
        chrome.storage.local.get("data", (data) => {
            setScreenshort(JSON.parse(data.data))
        });
    }, [])

    return (
        <div className="App">
            <div className="crop-container">
                <ReactCrop
                    className='cropping'
                    src={screenshort}
                    onImageLoaded={onLoad}
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                />
            </div>
            <div>
                <canvas
                    ref={previewCanvasRef}
                    style={{
                        width: Math.round(completedCrop?.width ?? 0),
                        height: Math.round(completedCrop?.height ?? 0)
                    }}
                />
            </div>
            <div className="controls">

                <a
                    onClick={showCroppedImage}
                    id="downloadScreenshort"
                    href='#'
                >
                    Download
                </a>
                <a
                    onClick={openInNewWindow}
                    id="openInWindow"
                // href='#'
                >
                    Open in window
                </a>
                <a
                    onClick={handleClickOpen}
                    id="showResult"
                >
                    Show Result
                </a>
                <a
                    onClick={() => copyToClipboardImage()}
                    id="copy"
                    style={{ backgroundColor: `${copyImage.colour}` }}
                >
                    {copyImage.copy}
                </a>
            </div>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            ScreenShort
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Grid item xs={12}>
                    <img src={croppedImage} alt="No Image" width="100%" className='croppedImageDialog' />
                </Grid>
            </Dialog>
        </div>);
}

export default ScreenShort;
