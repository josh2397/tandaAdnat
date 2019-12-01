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

const OrganisationsShifts: FunctionComponent<RouteComponentProps> = ({location, history}) => {

    const authAPI = useContext(AuthContext);
    const updateUserDetails = authAPI.updateUserDetails ? authAPI.updateUserDetails : () => { console.log("updateUserDetails is undefined")};
    const userDetails = authAPI.userDetails ? authAPI.userDetails : defaultUserDetails;
    
    const [sessionId, setSessionId] = useState(location.state ? 
        location.state.sessionId : 
        Cookies.getCookieValue("sessionId")
    );

    const [userIdMap, setUserIdMap] = useState([] as userDetails[]);

    
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
    // let pageSizeOptions = [] as any[];

    useEffect(() => {
        getShifts();
    }, [])

    useEffect(() => {
        if (shifts.length <= 25) {
            setNoRows(shifts.length);
        } else {
            // pageSizeOptions = [25, 50]
            setPageSizeOptions([10, 25, 50])
        }
    }, [shifts])

    const getShifts = async () => {
        try {
            const response: AxiosResponse<any> = await Axios.get("http://localhost:3000/shifts",
            {headers: {
                "Authorization" : sessionId,
                "Content-Type": "application/json"
            }});

            console.log("Get Shifts", response);
            // parseShifts(response.data);
            setShifts(response.data);
        } catch (ex) {
            console.log(ex)
        }
    };

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
            }

        } catch (ex) {
            console.log(ex);
        }
    }

    // const parseShifts = (data: organisationGetShifts[]) => {
    //     const shifts = data.map((shift) => {
    //         return {
    //             id: shift.id,
    //             userId: shift.userId,
    //             name: getUserName(shift.userId),
    //             date: ,
    //             start: shift.start
    //         }
    //     })
    // }

    return (
        <div style={{width: "95%", margin: "0 auto 0 auto"}}>
            <MaterialTable
                columns={[
                    {title: "Name", field: "name", type: "string"},
                    {title: "Shift Date", field: "date", type: "date"},
                    {title: "Start", field: "start", type: "time"},
                    {title: "End", field: "end", type: "time"},
                    {title: "Break Length", field: "break", type: "numeric"},
                    {title: "Hours Worked", field: "worked", type: "numeric" },
                    {title: "Shift Cost", field: "cost", type: "numeric"},
                    {title: "", field:"", render: rowData => <>{""}</>}
                ]}
                data={shifts}
                title="Shifts"
                options={{pageSize: noRows, pageSizeOptions: pageSizeOptions}}
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
        </div>
    );
};

export default OrganisationsShifts;