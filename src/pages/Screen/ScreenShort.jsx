import React, { useState, useCallback } from 'react';
import "./ScreenShort.css";
import Cropper from 'react-easy-crop'
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
    const [screenshort, setScreenshort] = React.useState("")
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    }
    const openInNewWindow = () => {
        chrome.runtime.sendMessage({ type: "OPEN_SCREENSHORT_IN_WINDOW", data: croppedImage }, function (response) {
            console.log("JSX Res", response.dataUrl);
        });
    }
    const handleClose = () => {
        setOpen(false);
    };
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])
    React.useEffect(() => {
        chrome.storage.local.get("data", (data) => {
            setScreenshort(JSON.parse(data.data))
        });
    }, [])
    useEffect(async () => {
        try {
            const croppedImage = await getCroppedImg(
                screenshort,
                croppedAreaPixels,
                rotation
            )
            let saveImg = document.getElementById('downloadScreenshort');
            saveImg.href = croppedImage;
            let currentDate = new Date().toLocaleString();
            let completeData = currentDate.split(",")
            saveImg.download = `screenshort_${completeData[0] + completeData[1]}.jpg`;
            setCroppedImage(croppedImage)
        } catch (e) {
            console.error(e)
        }
    }, [croppedAreaPixels])
    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                screenshort,
                croppedAreaPixels,
                rotation
            )
            let saveImg = document.getElementById('downloadScreenshort');
            saveImg.href = croppedImage
            saveImg.download = "screenshort.jpg";
            setCroppedImage(croppedImage)
        } catch (e) {
            console.error(e)
        }
    }, [croppedAreaPixels])
    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image()
            image.addEventListener('load', () => resolve(image))
            image.addEventListener('error', (error) => reject(error))
            image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
            image.src = url
        })

    function getRadianAngle(degreeValue) {
        return (degreeValue * Math.PI) / 180
    }

    /**
     * Returns the new bounding area of a rotated rectangle.
     */
    function rotateSize(width, height, rotation) {
        const rotRad = getRadianAngle(rotation)

        return {
            width:
                Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
            height:
                Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
        }
    }

    async function getCroppedImg(
        imageSrc,
        pixelCrop,
        rotation = 0,
        flip = { horizontal: false, vertical: false }
    ) {
        const image = await createImage(imageSrc)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
            return null
        }

        const rotRad = getRadianAngle(rotation)

        // calculate bounding box of the rotated image
        const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
            image.width,
            image.height,
            rotation
        )

        // set canvas size to match the bounding box
        canvas.width = bBoxWidth
        canvas.height = bBoxHeight

        // translate canvas context to a central location to allow rotating and flipping around the center
        ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
        ctx.rotate(rotRad)
        ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
        ctx.translate(-image.width / 2, -image.height / 2)

        // draw rotated image
        ctx.drawImage(image, 0, 0)

        // croppedAreaPixels values are bounding box relative
        // extract the cropped image using these values
        const data = ctx.getImageData(
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height
        )

        // set canvas width to final desired crop size - this will clear existing context
        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height

        // paste generated rotate image at the top left corner
        ctx.putImageData(data, 0, 0)

        // As Base64 string
        // return canvas.toDataURL('image/jpeg');

        // As a blob
        return new Promise((resolve, reject) => {
            canvas.toBlob((file) => {
                resolve(URL.createObjectURL(file))
            }, 'image/jpeg')
        })
    }


    return (
        <div className="App">
            <div className="crop-container">
                <Cropper
                    image={screenshort}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </div>
            <div className="controls">
                <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => {
                        setZoom(e.target.value)
                    }}
                    className="zoom-range"
                />
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
