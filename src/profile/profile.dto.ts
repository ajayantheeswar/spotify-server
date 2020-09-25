export class AccountOverViewResponseDTO {
    constructor(
        public userName: string,
        public email: string,
        public dob: string,
        public gender: string,
        public editable : boolean
    ) {}
}