// import Image from "next/image";


// const AuthLayout = ({ children }: { children: React.ReactNode }) => {
//     return (
//         <div className='h-full flex flex-col items-center justify-center space-y-6 '>
//             <Image height={200} width={200} alt="logo" src='logo.svg' className="rounded-full" />

//             {children}
//         </div>

//     );
// }

// export default AuthLayout;

import Image from "next/image";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='h-full flex flex-col items-center justify-center space-y-6' style={{ backgroundColor: '#e1e8f5' }}>
            <Image height={200} width={200} alt="logo" src='logo.svg' className="rounded-full" />
            {children}
        </div>
    );
}

export default AuthLayout;
