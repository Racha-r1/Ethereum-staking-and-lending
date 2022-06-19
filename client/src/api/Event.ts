export default interface Event {
    type: string;
    amount: number;
    date: Date;
    investor: string;
    token: string;
    success?: boolean;
}