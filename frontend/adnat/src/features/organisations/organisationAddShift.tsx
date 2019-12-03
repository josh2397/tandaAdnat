import React, { useState } from 'react';
import { MTableBody } from 'material-table';
import { TableCell, TextField, Button } from '@material-ui/core';
import produce from 'immer';
import { organisationCreateShiftDTO } from '../../models/organisations';
import Axios, { AxiosResponse } from 'axios';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
  } from '@material-ui/pickers';

export default function OrganisationAddShift(props: any) {

    const currentDate = new Date();

    const [newShift, setNewShift] = useState<organisationCreateShiftDTO>({
        userId: props.userId,
        date: new Date(),
        start: new Date(),
        finish: new Date(Date.now() + 1000 * 60 * 60 * 8)
    })

    const tableInputFields = [
        "date",
        "start",
        "finish",
        "break"
    ]

    const updateDates = (date: Date, shiftTimes: Date[]) => {
        const dd = date.getDate();
        const mm = date.getMonth();
        const yyyy = date.getFullYear();

        for (let i = 0; i < shiftTimes.length; i++) {
            shiftTimes[i].setDate(dd);
            shiftTimes[i].setMonth(mm);
            shiftTimes[i].setFullYear(yyyy);
        }
        return shiftTimes;
    }

    const updateNewShift = (property: string, value: any) => {
        const updatedNewShift = produce(newShift, draftNewShift => {
            switch (property) {
                case "date":
                    const shiftDates = updateDates(value, [newShift.start, newShift.finish])
                    draftNewShift.start = shiftDates[0];
                    draftNewShift.finish = shiftDates[1];
                    draftNewShift.date = value;
                    break;
                case "start":
                    draftNewShift.start = value;
                    break;
                case "finish":
                    draftNewShift.finish = value;
                    break;
                case "break":
                    draftNewShift.breakLength = +value;
                    break;
            }
        });

        setNewShift(updatedNewShift);

    }

    const handleAddShift = async () => {
        try {
            const response: AxiosResponse<any> = await Axios.post(
                "http://localhost:3000/shifts",
                newShift,
                {headers: {
                    "Authorization" : props.sessionId,
                    "Content-Type": 'application/json'
            }});

            if (response.status === 200) {
                props.getShifts();
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    return (
        <>
            <MTableBody {...props}/>
            <TableCell
                variant="body">
                {props.name}
            </TableCell>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <TableCell>
                    <KeyboardDatePicker
                        label="Date"
                        color="secondary"
                        format="dd/MM/yyyy"
                        value={newShift.date}
                        onChange={(event: Date | null) => updateNewShift('date', event)}
                    />
                </TableCell>
                <TableCell>
                    <KeyboardTimePicker
                        label="Start"
                        color="secondary"
                        value={newShift.start}
                        onChange={(event: Date | null) => updateNewShift('start', event)}
                    />
                </TableCell>
                <TableCell>
                    <KeyboardTimePicker
                        label="Finish"
                        color="secondary"
                        value={newShift.finish}
                        onChange={(event: Date | null) => updateNewShift('finish', event)}
                    />
                </TableCell>
            
            </MuiPickersUtilsProvider>
            <TableCell>
                <TextField
                    label={"Break"}
                    color="secondary"
                    value={newShift['breakLength']}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateNewShift('break', event.target.value)}
                
                />
            </TableCell>
            <Button
                onClick={handleAddShift}
                color="secondary"
                variant="outlined"
                style={{margin: "30px 20px 0px 0px"}}
            > Add </Button>
        </>
    );
};