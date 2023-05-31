import React from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { toast } from "react-toastify"
import TextField from '@material-ui/core/TextField';
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function App() {
  const [listBookmarks, setListBookmarks] = React.useState([]);
  const classes = useStyles();
  const searchByTitle = (title: any) => {
    chrome.bookmarks.search(
      title,
      (result: any) => {
        console.log("Search Result", result);
        if (result.length > 0) {
          setListBookmarks(result);
        } else if (result.length === 0) {
          setListBookmarks([]);
        }
      }
    )
    if (title.length == 0) {
      setListBookmarks([]);
      getAllBookmarks()
    }
  }
  const getAllBookmarks = () => {
    chrome.bookmarks.getTree(
      (results: any) => {
        var children: any = []
        results[0].children.map((item: any, index: any) => {
          children.push([].concat(...item.children))
        })
        var allBookmarks: any = [].concat(...children)
        setListBookmarks(allBookmarks)
        console.log("All Bookmark", allBookmarks);

      })


    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log("Tabsss data From GetALlBookmark", tabs);
    })
  }
  const removeSpecificBookmark = (id: any) => {
    chrome.bookmarks.remove(
      id,
      () => {
        setListBookmarks([]);
        getAllBookmarks()
        toast.success("Bookmark is removed successfully")
      }
    )
  }
  const addNewBookmark = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log("Tabsss data", tabs);

      var activeTab = tabs[0];
      var activeTabURL = activeTab.url;
      chrome.bookmarks.create({
        url: activeTabURL,
        'title': tabs[0].title
      }, (newFolder) => {
        setListBookmarks([]);
        getAllBookmarks()
        toast.success("Bookmark is added successfully")
      })
    })
  }
  React.useEffect(() => {
    getAllBookmarks()
  }, [])
  return (
    <div>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5">All Bookmarks</Typography>
        <TextField id="standard-secondary" label="Search Title" color="primary" onChange={(e) => {
          console.log("Value", e.target.value);
          searchByTitle(e.target.value)
        }} />
        <Button variant="contained" color="primary" onClick={() => {
          addNewBookmark()
        }}>
          Add Bookmark
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Visit</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listBookmarks.length > 0 ? listBookmarks.map((item: any, index: any) => (
              <TableRow key={item.id}>
                <TableCell component="th" scope="row">
                  {item.title}
                </TableCell>
                <TableCell align="center">
                  <a href={item.url} target="_blank"><VisibilityIcon /></a>
                </TableCell>
                <TableCell align="center">
                  <DeleteOutlineIcon onClick={() => { removeSpecificBookmark(item.id) }} />
                </TableCell>
              </TableRow>
            ))
              :
              <TableRow>
                <TableCell component="th" scope="row" colSpan={3}>
                  No Result Found
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
