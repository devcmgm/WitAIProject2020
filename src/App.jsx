import React, {useState, useEffect} from 'react';
import './App.css';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

const {Wit, log} = require('node-wit');


const client = new Wit({
    accessToken: 'WWEPV7GJEHGK3Y42FCJLFMNWT2GBS4WL',
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

export default () => {
    const classes = useStyles();
    const [state, setState] = useState(initState);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "audio.js";
        script.async = true;
        document.body.appendChild(script);
    });

    const handleChange = (e) => setState({utterance: e.target.value});

    const handleButton = async (e) => {
        e.preventDefault();

        await client.message(JSON.stringify(state.utterance), {})
            .then((data) => {
                var result = JSON.stringify(data.intents);

                if (result === '[]') {
                    result = 'Sorry, I did not understand. Please try again'
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

            <h2>
                ELIZA
            </h2>
            <h4>
                A Mock (Rogerian) Psychotherapist <br/>
                Running on WitAI
            </h4>
            <form onSubmit={handleButton} className={classes.root} noValidate autoComplete="off">
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <TextField
                            id="WitAIUtteranceText"
                            label="How are you feeling?"
                            rowsMax={4}
                            value={state.utterance || ""}
                            onChange={handleChange}
                        />
                        <p>Click To Record Input:</p>
                        <audio id="player" controls></audio>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="secondary"
                            endIcon={<Icon>send</Icon>}
                            onSubmit={handleButton}
                            onClick={handleButton}
                        >
                            submit
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        Response: {state.answer}
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}
