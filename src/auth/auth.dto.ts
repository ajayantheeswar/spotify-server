export class EmailSignUpDTO {
    email: string;
    name: string;
    password : string
    dob : string;
    gender : string;
}

export class EmailSignUpResponseDTO {
    message : string;
    name : string;
    email : string;
    role : string;
    success : boolean;
}

export class EmailSignInDTO {
    email: string;
    password : string
}