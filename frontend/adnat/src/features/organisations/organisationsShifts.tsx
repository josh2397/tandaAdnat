import React, { FunctionComponent, useState, useContext } from 'react';
import { RouteComponentProps } from 'react-router';
import Cookies from '../../helpers/Cookies';
import AuthContext, { defaultUserDetails } from '../../components/authContext';
import { Typography, Container, Button, Table, TableRow, TableCell, TableBody, TextField, Grid, Divider } from '@material-ui/core';
import MaterialTable, { MTablePagination, MTableBody } from 'material-table';
import Axios, { AxiosResponse } from 'axios';
import { organisationShift, organisationCreateShiftDTO, organisationGetShifts } from '../../models/organisations';
import { useEffect } from 'react';
import produce from 'immer';
import { userDetails } from '../../models/users';
import OrganisationAddShift from './organisationAddShift';
import { Props } from 'react';
import { ADDRGETNETWORKPARAMS } from 'dns';

const OrganisationsShifts: FunctionComponent<RouteComponentProps> = ({location, history}) => {

    const authAPI = useContext(AuthContext);
    const updateUserDetails = authAPI.updateUserDetails ? authAPI.updateUserDetails : () => { console.log("updateUserDetails is undefined")};
    const userDetails = authAPI.userDetails ? authAPI.userDetails : defaultUserDetails;
    
    const [sessionId, setSessionId] = useState(location.state ? 
        location.state.sessionId : 
        Cookies.getCookieValue("sessionId")
    );

    const [users, setUsers] = useState([] as userDetails[]);

    const [orgHourlyRate, setOrgHourlyRate] = useState<number>(-1);

    
    console.log("rendering");
    
    const tableInputFields = [
        "date",
        "start",
        "finish",
        "break"
    ] 
    
    const [shifts, setShifts] = useState([] as organisationShift[]);
    
    const [noRows, setNoRows] = useState((shifts.length <= 10) ? shifts.length : 10)
    const [pageSizeOptions, setPageSizeOptions] = useState((shifts.length <= 10) ? [] as any[] : [10, 25, 50]);

    useEffect(() => {
        getOrganisationPayRate();
    }, [])

    useEffect(() => {
        if (orgHourlyRate !== -1) {
            getUsers();
        }
    }, [orgHourlyRate])

    useEffect(() => {
        if (shifts.length <= 25) {
            setNoRows(shifts.length);
        } else {
            setPageSizeOptions([10, 25, 50])
        }
    }, [shifts])

    useEffect(() => {
        getShifts();
    }, [users])

    const getShifts = async () => {
        try {
            const response: AxiosResponse<any> = await Axios.get("http://localhost:3000/shifts",
            {headers: {
                "Authorization" : sessionId,
                "Content-Type": "application/json"
            }});

            console.log("Get Shifts", response);
            const shifts = parseShifts(sortShifts(response.data));
            setShifts(shifts);
        } catch (ex) {
            console.log(ex)
        }
    };

    const getOrganisationPayRate = async () => {
        console.log("SessionId in get org:", sessionId);
        try {
            const response: AxiosResponse<any> = await Axios.get(
                `http://localhost:3000/organisations/${userDetails.organisationId}`,
                {headers: {
                    "Authorization": sessionId,
                    "Content-Type": "application/json"
            }});

            console.log(response);
            if (response.status === 200) {
                console.log(response.data.hourlyRate);
                setOrgHourlyRate(response.data.hourlyRate);
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    const getUsers = async () => {

        console.log("Getting users");
        try {
            const response: AxiosResponse<any> = await Axios.get("http://localhost:3000/users",
            {headers : {
                "Authorization" : sessionId,
                "Content-Type": "application/json"
            }});
            if (response.status === 200 ) {
                console.log(response.data);
                setUsers(response.data);
            }

        } catch (ex) {
            console.log(ex);
        }
    }

    const userComparison = () => {

    }

    const sortShifts = (shifts: organisationShift[]) => {
        return shifts.sort( shiftSortComparision );
    }

    const shiftSortComparision = (a: organisationShift, b: organisationShift) => {
        const aDate = new Date(a.start);
        const bDate = new Date(b.start);

        if (aDate < bDate) {
            return 1;
        } else if (aDate > bDate) {
            return -1;
        } else {
            return 0;
        }
    };

    const compareShiftValues = (a: number, b: number) => {
        if (a < b) {
             return -1;
        } else if (a > b) {
            return 1;
        }
    }

    const timesToStrings = (shiftTimes: Date[]) => {
        console.log("Incoming Shift Times:", shiftTimes);
        let shiftTimeStrings : string[] = [];
        for (let i = 0; i < shiftTimes.length; i++) {
            let timeNumber: number = shiftTimes[i].getHours() + (shiftTimes[i].getMinutes()  * 0.01);
            if (timeNumber >= 13) {
                timeNumber -= 12;
                // timeNumber = (Math.round(timeNumber * 100) / 100).toFixed(2);
                shiftTimeStrings.push((Math.round(timeNumber * 100) / 100).toFixed(2) + "pm");
            } else {
                shiftTimeStrings.push((Math.round(timeNumber * 100) / 100).toFixed(2) + 'am');
            }
        }
        console.log("Shift Time Strings: ", shiftTimeStrings);
        return shiftTimeStrings;
    }

    const calculateHoursWorked = (shiftTimes: Date[]) => {
        const finish: number = shiftTimes[1].getHours() + (shiftTimes[1].getMinutes() * 0.01);
        const start: number = shiftTimes[0].getHours() + (shiftTimes[0].getMinutes() * 0.01);
        const timeDiff = finish - start;

        const minuesToHours = ((timeDiff - Math.floor(timeDiff)) * 100 / 60);

        const hoursWorked = Math.floor(timeDiff) + minuesToHours;

        return Math.round(hoursWorked * 100) / 100;
    }

    const parseShifts = (data: organisationGetShifts[]) => {
        return data.map((shift) => {

            const start = new Date(shift.start);
            const finish = new Date(shift.finish);

            const shiftTimeStrings: string[] = timesToStrings([start, finish]);

            
            const dateDraft = new Date(shift.start);
            const dateString = `${dateDraft.getDate()}/${dateDraft.getMonth()}/${dateDraft.getFullYear()}`
            
            const hoursWorked = calculateHoursWorked([start, finish]);

            const cost = orgHourlyRate * hoursWorked;

            const modifiedShift: organisationShift = {
                id: shift.id,
                userId: shift.userId,
                // name: getUserName(shift.userId),
                date: dateString,
                start: shiftTimeStrings[0],
                finish: shiftTimeStrings[1],
                break: shift.breakLength ? shift.breakLength : 0,
                worked: hoursWorked,
                cost: cost
            }

            return modifiedShift;
        });
    }

    const handleDeleteShift = async (id: number) => {
        try {
            const response = await Axios.delete(`http://localhost:3000/shifts/${id}`,
            { headers :{
                "Authorization" : sessionId,
                "Content-Type": "application/json"
            }});
            if (response.status === 200 ) {
                console.log("Succesfully Deleted Shift");
                getShifts();
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    return (
        <div style={{width: "95%", margin: "0 auto 0 auto"}}>
            <MaterialTable
                columns={[
                    {title: "Name", field: "name", type: "string"},
                    {title: "Shift Date", field: "date", type: "date"},
                    {title: "Start", field: "start", type: "time"},
                    {title: "Finish", field: "finish", type: "time"},
                    {title: "Break Length (minutes)", field: "break", type: "numeric"},
                    {title: "Hours Worked", field: "worked", type: "numeric" },
                    {title: "Shift Cost", field: "cost", type: "numeric", render: rowData => `$${rowData.cost}`}
                ]}
                data={shifts}
                title="Shifts"
                options={{pageSize: noRows, pageSizeOptions: pageSizeOptions}}
                actions={[
                    {
                        icon: 'delete',
                        tooltip: 'delete shift',
                        onClick: (event, rowData: any) => handleDeleteShift(rowData.id)
                    }
                ]}
                components={{
                    Body: (props) => {
                        const extendedProps = {getShifts: getShifts, sessionId: sessionId, name: userDetails.name, userId: userDetails.id, ...props}
                        return (
                            <OrganisationAddShift {...extendedProps} />

                        )
                    }
                }}
            />
            <Button onClick={getUsers}>Get Users</Button>
            <Button onClick={getShifts}>Get Shifts</Button>
        </div>
    );
};

export default OrganisationsShifts;