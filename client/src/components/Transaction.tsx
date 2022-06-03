import React from 'react'
import Event from '../api/Event'

interface Props {
    event: Event
}

const Transaction: React.FC<Props> = ({ event }) => {
    return (
        <tr className="text-left text-medium opacity-100 hover:bg-blue-100">
            <td className="lg:p-3 md:p-1"> {event.investor}</td>
            <td className="lg:p-3 md:p-1"> {event.token}</td>
            <td className="lg:p-3 md:p-1">
                {`${event.amount} ${event.token}`}
            </td>
            <td className="lg:p-3 md:p-1">{toDateString(event.date)}</td>
            <td className="lg:p-3 md:p-1">{event.type}</td>
        </tr>
    )
}

const toDateString = (date: Date): string => {
    const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    const minute =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    const month =
        date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const year = date.getFullYear()
    return `${day}/${month}/${year} ${hour}:${minute}`
}

export default Transaction
