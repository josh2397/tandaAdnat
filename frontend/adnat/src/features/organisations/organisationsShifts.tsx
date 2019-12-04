import React, { FunctionComponent, useState, useContext } from 'react';
import { RouteComponentProps } from 'react-router';
import Cookies from '../../helpers/Cookies';
import AuthContext, { defaultUserDetails } from '../../components/authContext';
import MaterialTable from 'material-table';
import Axios, { AxiosResponse } from 'axios';
import { organisationShift, organisationGetShifts } from '../../models/organisations';
import { useEffect } from 'react';
import { userDetails } from '../../models/users';
import OrganisationAddShift from './organisationAddShift';

const OrganisationsShifts: FunctionComponent<RouteComponentProps> = ({location}) => {

    const authAPI = useContext(AuthContext);
    const userDetails = authAPI.userDetails ? authAPI.userDetails : defaultUserDetails;
    
    const [sessionId, setSessionId] = useState(location.state ? 
        location.state.sessionId : 
        Cookies.getCookieValue("sessionId")
    );

    const [users, setUsers] = useState([] as userDetails[]);

    const [userIdMap, setUserIdMap] = useState(new Map<number, string>());

    const [orgHourlyRate, setOrgHourlyRate] = useState<number>(-1);
    
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
        if (shifts.length <= 10) {
            console.log(shifts.length);
            setNoRows(shifts.length);
            setPageSizeOptions([]);
        } else {
            setPageSizeOptions([10, 25, 50])
        }
    }, [shifts])

    useEffect(() => {
        mapUserIdsToName();
        getShifts();
    }, [users])

    const getShifts = async () => {
        try {
            const response: AxiosResponse<any> = await Axios.get("http://localhost:3000/shifts",
            {headers: {
                "Authorization" : sessionId,
                "Content-Type": "application/json"
            }});

            const shifts = parseShifts(sortShifts(response.data));
            setShifts(shifts);
        } catch (ex) {
            console.log(ex)
        }
    };

    const getOrganisationPayRate = async () => {
        try {
            const response: AxiosResponse<any> = await Axios.get(
                `http://localhost:3000/organisations/${userDetails.organisationId}`,
                {headers: {
                    "Authorization": sessionId,
                    "Content-Type": "application/json"
            }});

            if (response.status === 200) {
                setOrgHourlyRate(response.data.hourlyRate);
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    const getUsers = async () => {

        try {
            const response: AxiosResponse<any> = await Axios.get("http://localhost:3000/users",
            {headers : {
                "Authorization" : sessionId,
                "Content-Type": "application/json"
            }});
            if (response.status === 200 ) {
                setUsers(response.data);
            }

        } catch (ex) {
            console.log(ex);
        }
    }

    const mapUserIdsToName = () => {
        const updatedUserIdMap = userIdMap;
        for (let i = 0; i < users.length; i++) {
            updatedUserIdMap.set(users[i].id, users[i].name);
        }
        setUserIdMap(updatedUserIdMap);
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

    const timesToStrings = (shiftTimes: Date[]) => {
        let shiftTimeStrings : string[] = [];
        for (let i = 0; i < shiftTimes.length; i++) {
            let timeNumber: number = shiftTimes[i].getHours() + (shiftTimes[i].getMinutes()  * 0.01);
            if (timeNumber >= 13) {
                timeNumber -= 12;
                shiftTimeStrings.push((Math.round(timeNumber * 100) / 100).toFixed(2) + "pm");
            } else {
                shiftTimeStrings.push((Math.round(timeNumber * 100) / 100).toFixed(2) + 'am');
            }
        }
        return shiftTimeStrings;
    }

    const calculateHoursWorked = (shiftTimes: Date[], breakLength: number | undefined) => {
        const finishHours: number = shiftTimes[1].getHours();
        const finishMinutes: number = (shiftTimes[1].getMinutes());
        const startHours: number = shiftTimes[0].getHours();
        const startMinutes: number = (shiftTimes[0].getMinutes());

        let hoursDiff: number;
        if (finishHours < startHours){
            hoursDiff = 24 - startHours + finishHours
        } else {
            hoursDiff = finishHours - startHours;
        }

        let minutesDiff = breakLength ? finishMinutes - startMinutes - breakLength : finishMinutes - startMinutes;
        if (minutesDiff < 0) {
            hoursDiff--;
            minutesDiff = 60 - minutesDiff;
        }
        const timeDiff = hoursDiff + (minutesDiff * 0.01);

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
            
            const hoursWorked = calculateHoursWorked([start, finish], shift.breakLength);

            const cost = orgHourlyRate * hoursWorked;

            const modifiedShift: organisationShift = {
                id: shift.id,
                userId: shift.userId,
                name: userIdMap.get(shift.userId),
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
        </div>
    );
};

export default OrganisationsShifts;