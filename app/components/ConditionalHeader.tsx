import Header from './Header';

interface HeaderProps {
    currentUser: {
        email: string,
        role: string,
    }
}

export const ConditionalHeader = ({currentUser}: HeaderProps) => {
    return (
        <div>
            <Header currentUser={currentUser}/>
        </div>
    );
}