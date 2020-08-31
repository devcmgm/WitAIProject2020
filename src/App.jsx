import React, {useState }from 'react';
import './App.css';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
const {Wit, log} = require('node-wit');

const client = new Wit({
    accessToken: ***NOTE REPLACE_WITH_YOUR_TOKEN****,
    logger: new log.Logger(log.DEBUG) // optional
});

const useStyles = makeStyles((theme) =>
    createStyles({
        button: {
            margin: theme.spacing(1),
        },
        root: {
            flexGrow: 1,
            '& .MuiTextField-root': {
                margin: theme.spacing(1),
                width: '60ch',
            },
        },
    }),
);

const initState = {
    utterance: '',
    answer: ''
}

function App() {
    const classes = useStyles();
    const [state, setState] = useState(initState);

    const handleChange = (e) => setState({ utterance: e.target.value});

    const handleButton = (e) => {
            e.preventDefault()
            console.log(state.utterance);
            //alert(JSON.stringify(state.utterance));

        client.message(JSON.stringify(state.utterance), {})
            .then((data) => {
                var result = JSON.stringify(data.intents);
                console.log("FOO(" + result + ")");
                if (result == '[]') {
                    result = 'Ask a different Way ?'
                } else {
                    result = data.intents[0].name;
                }
                setState({answer: result})
               // setState({utterance: ''})
            })
            .catch(console.error);

        };

    return (
        <div className="App">
            <h1>Montgomery Now<br/>Effective Information for your Now needs.</h1>
            <form onSubmit={handleButton} className={classes.root} noValidate autoComplete="off">
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <TextField
                        id="WitAIUtteranceText"
                        label="How are you feeling ?"
                        rowsMax={4}
                        value={state.utterance || ""}
                        onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button className={classes.button} variant="contained"
                                color="secondary"
                                endIcon={<Icon>send</Icon>}
                        onSubmit={handleButton}>Ask Now !</Button>;
                    </Grid>
                    <Grid item xs={12}>
                       Answer {state.answer}
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}

export default App;
